import sequelize from "sequelize"

import { connection } from "../config/database/connection.js"
import { category } from "./category.js"

export const article = connection.define("articles", {
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false
    },
    description: {
        type: sequelize.TEXT,
        allowNull: false
    },
    content: {
        type: sequelize.TEXT,
        allowNull: false
    }
})

article.belongsTo(category)
category.hasMany(article)

article.sync({ force: false })