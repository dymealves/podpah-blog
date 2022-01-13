import sequelize from "sequelize"

export const connection = new sequelize("podpahapp", "root", "", {
    host: "localhost",
    dialect: "mysql",
    timezone: "-03:00"
})