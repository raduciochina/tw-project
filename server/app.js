const express = require("express");
// const Curs = require("./Curs");
// const User = require("./User");
const router = require("./routes/cursuri");
const router2 = require("./routes/users");
const sequelize = require("./sequelize");
const User = require("./models/user");
const Curs = require("./models/curs");
const cors = require('cors');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 3000;
app.use(cors());

// User.hasMany(Curs);
User.belongsToMany(Curs, { through: "enrollements" });
Curs.belongsToMany(User, { through: "enrollements" });

app.get("/", (req, res) => {
    res.send("Welcome to my API");
})

app.listen(port, async() => {
    console.log("Running on port " + port);
    try {
        await sequelize.authenticate();
        console.log("Connection has been established succesfully")
    } catch (err) {
        console.log("Unable to connect to the database: ", err)
    }
})

app.use("/api", router);
app.use("/api", router2);
app.use((err, req, res, next) => {
    res.status(500).json({ "Error": "Something broke!" })
});