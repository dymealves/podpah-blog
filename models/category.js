import sequelize from "sequelize"

import { connection } from "../config/database/connection.js"

export const category = connection.define("categories", {
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false
    }
})

category.sync({ force: false })