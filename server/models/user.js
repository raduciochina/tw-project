const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const User = sequelize.define(
    "User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        grad: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, { tableName: "Users" }
)

module.exports = User;