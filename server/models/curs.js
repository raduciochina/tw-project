const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Curs = sequelize.define(
    "Curs", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        prof: {
            type: DataTypes.STRING,
            allowNull: false
        },
        feedback: DataTypes.FLOAT,
        data: DataTypes.STRING,
        descriere: DataTypes.STRING,
        cod: DataTypes.INTEGER
    }, { tableName: "Cursuri" }
)

module.exports = Curs;