import sequelize from "sequelize"

export const connection = new sequelize("podpahapp", "dymealves", "v]SQJ2[3vV[", {
    host: "mysql743.umbler.com",
    dialect: "mysql",
    timezone: "-03:00"
})