import sequelize from "sequelize"

import { connection } from "../config/database/connection.js"

export const user = connection.define("user", {
    fullName: {
        type: sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    },
    permission: {
        type: sequelize.STRING,
        defaultValue: "client",
        allowNull: false
    }
})

user.sync({ force: false })