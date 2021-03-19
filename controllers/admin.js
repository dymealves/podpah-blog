import express from "express"
import slugify from "slugify"

import { category } from "../models/category.js"
import { article } from "../models/article.js"
import { user } from "../models/user.js"

import { permission } from "../config/middleware/permission.js"

export const admin = express.Router()

/* Painel Administrativo de Categorias */

/* Listagem de Categorias */

admin.get("/categories", permission, (req, res) => {
    category.findAll().then(categories => {
        res.render("admin/categories/index", {
            categories: categories
        })
    })
})

/* Cadastro de Categoria */

admin.get("/categories/register", permission, (req, res) => {
    category.findAll().then(categories => {
        res.render("admin/categories/register", {
            categories: categories
        })
    })
})

admin.post("/categories/register", permission, (req, res) => {
    let title = req.body.title
    
    if(!title.length || title === null || title === undefined) {
        res.redirect("/admin/categories/register")
    } else {
        category.create({
            title,
            slug: slugify(title).toLowerCase()
        }).then(() => {
            res.redirect("/admin/categories")
        }).catch(error => {
            res.redirect("/admin/categories")
        })
    }
})

/* Deleção de Categoria */

admin.post("/categories/delete", permission, (req, res) => {
    let id = req.body.id

    if(isNaN(id) || !id.length || id === null || id === undefined) {
        res.redirect("/admin/categories")
    } else {
        article.destroy({ where: { categoryId: id } })

        category.destroy({ where: { id: id } }).then(() => {
            res.redirect("/admin/categories")
        }).catch(error => {
            res.redirect("/admin/categories")
        })
    }
})

/* Edição de Categoria */

admin.get("/categories/update/:id", permission, (req, res) => {
    let id = req.params.id

    category.findAll().then(categories => {
        category.findByPk(id).then(category => {
        if(isNaN(id) || category === null || !id.length || id === null || id === undefined) {
                res.redirect("/admin/categories")
        } else {
            res.render("admin/categories/update", {
                category: category,
                categories: categories
            })
        }        
        }).catch(error => {
            res.redirect("/admin/categories")
        })
    })

    
})

admin.post("/categories/update", permission, (req, res) => {
    let id = req.body.id
    let title = req.body.title

    if(!title.length || title === null || title === undefined) {
        res.redirect("/admin/categories")
    } else {
        category.update({ 
            title,
            slug: slugify(title).toLowerCase()
        }, { where: { id } }).then(() => {
            res.redirect("/admin/categories")
        }).catch(error => {
            res.redirect(`/admin/categories/update/${id}`)
        })
    }
})

/* Painel Administrativo de Artigos */

/* Listagem de Artigos */

admin.get("/articles", permission, (req, res) => {
    article.findAll({
        include: [
            { model: category }
        ]
    }).then(articles => {
        category.findAll().then(categories => {
            res.render("admin/articles/index", {
                articles: articles,
                categories: categories
            })
        })
    })
})

/* Cadastro de Artigos */

admin.get("/articles/register", permission, (req, res) => {
    category.findAll().then(categories => {
        res.render("admin/articles/register", {
            categories: categories
        })
    })
})

admin.post("/articles/register", permission, (req, res) => {
    let title = req.body.title
    let category = req.body.category
    let description = req.body.description
    let content = req.body.content

    if(!title.length || title === null || title === undefined) {
        res.redirect("/admin/articles/register")
    } else if(category === "disabled" || category === null || category === undefined) {
        res.redirect("/admin/articles/register")
    } else if(!content.length || content === null || content === undefined) {
        res.redirect("/admin/articles/register")
    } else if(!description.length || description === null || description === undefined) {
        res.redirect("/admin/articles/register")
    } else {
        article.create({
            title,
            slug: slugify(title).toLowerCase(),
            content,
            description,
            categoryId: category
        }).then(() => {
            res.redirect("/admin/articles")
        }).catch(error => {
            res.redirect("/admin/articles/register")
        })
    }
})

/* Deleção de Artigos */

admin.post("/articles/delete", permission, (req, res) => {
    let id = req.body.id

    if(isNaN(id) || !id.length || id === null || id === undefined) {
        res.redirect("/admin/articles")
    } else {
        article.destroy({ where: { id } }).then(() => {
            res.redirect("/admin/articles")
        }).catch(error => {
            res.redirect("/admin/articles")
        })
    }
})

/* Edição de Artigos */

admin.get("/articles/update/:id", permission, (req, res) => {
    let id = req.params.id
    
    category.findAll().then(categories => {
        article.findByPk(id).then(article => {
            if(isNaN(id) || article === null || !id.length || id === null || id === undefined) {
                res.redirect("/admin/articles")
            } else {
                res.render("admin/articles/update", {
                    categories: categories,
                    article: article
                })
            }
        })
    })
})

admin.post("/articles/update", permission, (req, res) => {
    let id = req.body.id
    let title = req.body.title
    let category = req.body.category
    let description = req.body.description
    let content = req.body.content

    if(!title.length || title === null || title === undefined) {
        res.redirect("/admin/articles")
    } else if(category === "disabled" || category === null || category === undefined) {
        res.redirect("/admin/articles")
    } else if(!description.length || description === null || description === undefined) {
        res.redirect("/admin/articles")
    } else if (!content.length || content === null || content === undefined) {
        res.redirect("/admin/articles")
    } else {
        article.update({
            title,
            slug: slugify(title).toLowerCase(),
            category,
            description,
            content
        }, { where: { id } }).then(() => {
            res.redirect("/admin/articles")
        }).catch(error => {
            res.redirect(`/admin/articles/update/${id}`)
        })
    }
})

/* Listagem de Usuários */

admin.get("/users", permission, (req, res) => {
    category.findAll().then(categories => {
        user.findAll().then(users => {
            res.render("admin/users/index", {
                categories: categories,
                users: users
            })
        })
    })
})

/* Edição de Usuários */

admin.get("/users/update/:id", permission, (req, res) => {
    category.findAll().then(categories => {
        let id = req.params.id

        user.findOne({ where: { id } }).then(user => {
            res.render("admin/users/update", {
                categories: categories,
                user: user
            })
        })
    })
})

admin.post("/users/update", permission, (req, res) => {
    let id = req.body.id
    let fullName = req.body.fullName
    let permission = req.body.permission

    if(!fullName.length || fullName === null || fullName === undefined) {
        res.redirect(`/admin/users/update/${id}`)
    } else if(permission === "disabled" || permission === null || permission === undefined) {
        res.redirect(`/admin/users/update/${id}`)
    } else {
        user.update({
            fullName,
            permission
        }, { where: { id } }).then(() => {
            res.redirect("/admin/users")
        }).catch(error => {
            res.redirect(`/admin/users/update/${id}`)
        })
    }
})

/* Deleção de Usuários */

admin.post("/users/delete", permission, (req, res) => {
    let id = req.body.id

    user.destroy({ where: { id } }).then(() => {
        res.redirect("/admin/users")
    }).catch(error => {
        res.redirect("/admin/users")
    })
})