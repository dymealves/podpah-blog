import express from "express"
import bcrypt from "bcryptjs"

import { user } from "../models/user.js"
import { category } from "../models/category.js"

export const client = express.Router()

/* Cadastro de Usuários */

client.get("/signup", (req, res) => {
    category.findAll().then(categories => {
        user.findAll().then(users => {
            res.render("public/users/signup", {
                categories: categories,
                users: users
            })
        })
    })
})

client.post("/signup", (req, res) => {
    let fullName = req.body.fullName
    let email = req.body.email
    let password = req.body.password

    user.findOne({ where: { email }}).then(findUser => {
        if(findUser === undefined || findUser === null) {
            const salt = bcrypt.genSaltSync(10)
            let passwordHash = bcrypt.hashSync(password, salt)

            if(!fullName.length || fullName === null || fullName === undefined) {
                res.redirect("/user/signup")
            } else if(!email.length || email === null || email === undefined) {
                res.redirect("/user/signup")
            } else if(!password.length || password === null || password === undefined) {
                res.redirect("user/signup")
            } else {
                user.create({
                    fullName,
                    email,
                    password: passwordHash
                }).then(() => { 
                    res.redirect("/")
                }).catch(error => {
                    res.redirect("/user/signup")
                }) 
            }
        } else {
            res.redirect("/user/signup")
        }
    })
})

/* Login de Usuários */

client.get("/signin", (req, res) => {
    category.findAll().then(categories => {
        res.render("public/users/signin", {
            categories: categories
        })
    })
})

client.post("/authenticate", (req, res) => {
    let email = req.body.email
    let password = req.body.password

    if(!email.length || email === null || email === undefined) {
        res.redirect("/user/signin")
    } else if(!password.length || password === null || password === undefined) {
        res.redirect("/user/signin")
    } else {
        user.findOne({ where: { email } }).then(user => {
            if(user) {
                let correctPassword = bcrypt.compareSync(password, user.password)

                if(correctPassword) {
                    req.session.user = {
                        id: user.id,
                        email: user.email,
                        permission: user.permission
                    }

                    res.redirect("/")
                } else {
                    res.redirect("/user/signin")
                }
            } else {
                res.redirect("/user/signin")
            }
        })
    }
})

client.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})