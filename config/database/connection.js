import sequelize from "sequelize"

export const connection = new sequelize("podpahapp", "dymealves", "hM/Ko+36geN+", {
    host: "mysql743.umbler.com",
    dialect: "mysql",
    timezone: "-03:00"
})