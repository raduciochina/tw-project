const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./sqlite/database.db"
});

sequelize.sync().then(() => {
    console.log("All models were synchronized successfully!");
})

module.exports = sequelize;