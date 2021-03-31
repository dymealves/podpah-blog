import express from "express"
import sequelize from "sequelize"
import ejs from "ejs"
import bodyParser from "body-parser"
import session from "express-session"

import { connection } from "./config/database/connection.js"

import { article } from "./models/article.js"
import { category } from "./models/category.js"
import { user } from "./models/user.js"

import { admin } from "./controllers/admin.js"
import { client } from "./controllers/user.js"

/* Configurando Express */

const app = express()

/* Configurando Conexão ao Bando de Dados */

connection.authenticate().then(() => {
    console.log("Conectado ao banco de dados com sucesso!")
}).catch(error => {
    console.log(`Falha ao se conectar ao banco de dados: ${error}`)
})

/* Configurando Sessões */

app.use(session({
    secret: "!@(#h9g-12b3g123=Q(JQwqsndkn1=9203gj1h=",
    cookie: { maxAge: 86400000 }
}))

/* Configurando Middlewares */

app.use((req, res, next) => {
    res.locals.user = req.session.user || null

    next()
})

/* Configurando Arquivos Estáticos */

app.use(express.static("src/public"))

/* Configurando View Engine */

app.set('views', "C:/wamp64/www/cursonode.com/podpahapp/src/views", 'views');
app.set("view engine", "ejs")

/* Configurando Body Parser */

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* Configurando Rotas */

app.use("/admin", admin)

app.use("/user", client)

app.get("/", (req, res) => {
    let page = req.query.page
    let limit = 4
    let offset
    let next

    if(isNaN(page) || page === "1") {
        offset = 0
    } else {
        offset = (Number(page) - 1) * limit
    }

    article.findAndCountAll({
        include: [
            { model: category }
        ],
        order: [
            [ "id", "desc" ]
        ],
        limit,
        offset
    }).then(articles => {
        category.findAll({
            order: [
                [ "id", "desc" ]
            ]
        }).then(categories => {
            if(offset > articles.count) {
                res.redirect("/")
            }

            if(offset + limit >= articles.count) {
                next = false
            } else {
                next = true
            }

            res.render("index", {
                limit,
                offset,
                page,
                next,
                articles: articles,
                categories: categories
            })
        })          
    })
})

app.get("/article/:slug", (req, res) => {
    let slug = req.params.slug

    article.findOne({
        include: [
            { model: category }
        ],
        where: { slug } 
    }).then(article => {
        if(article === null) {
            res.redirect("/")
        } else {
            category.findAll({
                order: [
                    [ "id", "desc" ]
                ]
            }).then(categories => {
                res.render("public/article/index", {
                    article: article,
                    categories: categories
                })
            })
        }
    })
})

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug

    category.findAll().then(categories => {
        category.findOne({
            include: [
                { model: article }
            ],
            where: { slug }
        }).then(category => {
            res.render("public/category/index", {
                categories: categories,
                category: category,
                articles: category.articles
            })
        })
    })
})

/* Configurando Servidor */

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Servidor Rodando!"))