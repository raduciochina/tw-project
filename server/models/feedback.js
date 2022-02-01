const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const feedback = sequelize.define(
    "Feedback", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idCurs: DataTypes.INTEGER,
        feedback: DataTypes.INTEGER
    }, { tableName: "Feedback" }
)

module.exports = feedback;