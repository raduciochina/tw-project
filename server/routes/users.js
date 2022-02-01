const express = require("express");
const Curs = require("../models/curs");
const User = require("../models/user");
const router2 = express.Router();

// let users = [
//     new User(1, "Andrei", "student", ["TW", "DSAD", "MM"]),
//     new User(2, "Radu", "student", ["TW", "DSAD", "MM"]),
//     new User(3, "Luca", "profesor", ["TW", "MM"])
// ]


// get users
router2.get("/users", async(req, res) => {
    // let listaFiltrata = [];
    // if (req.query.grad) {
    //     listaFiltrata = users.filter(x => x.grad == req.query.grad);
    // } else {
    //     listaFiltrata = users;
    // }
    // res.json(listaFiltrata);
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json(err);
    }
})

router2.post("/users", async(req, res) => {
    try {
        const userNou = await User.create(req.body);
        return res.status(200).json(userNou);
    } catch (err) {
        res.status(500).json(err);
    }
    // let cursNou = new Curs(
    //     req.body.id,
    //     req.body.name,
    //     req.body.prof,
    //     req.body.feedback
    // );
    // cursuri.push(cursNou);
    // console.log(cursuri);
    // return res.json(cursNou);
})

router2.post("/users/:userId/cursuri", async(req, res, next) => {
    try {
        const user = await User.findByPk(req.params.userId);
        if (user) {
            const curs = new Curs(req.body);
            curs.UserId = user.id;
            await curs.save();
            res.status(201).json({ message: "Curs creat!" });
        } else {
            res.status(404).json({ message: '404 - user not found!' });
        }
    } catch (err) {
        next(err);
    }
})

router2.get("/users/:userId/cursuri", async(req, res, next) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            include: [Curs]
        });
        if (user) {
            res.status(200).json(user.Curs);
        } else {
            res.status(404).json({ message: '404 - user not found!' });
        }
    } catch (err) {
        next(err);
    }
})

router2.put("/users/:userId/cursuri/:idCurs", async(req, res, next) => {
    try {
        const user = await User.findByPk(req.params.userId);
        if (user) {
            const cursuri = await user.getCurs({ id: req.params.idCurs });
            const curs = cursuri.shift();
            if (curs) {
                curs.name = req.body.name;
                curs.prof = req.body.prof;
                curs.feedback = req.body.feedback;
                await curs.save();
                res.status(202).json({ message: "Curs updated!" });
            } else {
                res.status(404).json({ message: "Curs not found!" });
            }
        } else {
            res.status(404).json({ message: "404- User not found!" });
        }
    } catch (err) {
        next(err);
    }
})

router2.get("/users/:idUser/enrollements", async(req, res, next) => {
    try {
        const user = await User.findByPk(req.params.idUser);
        const cursuri = await user.getCurs({ attributes: ['id'] });
        if (cursuri.length > 0) {
            res.json(cursuri);
        } else {
            res.status(204);
        }
    } catch (err) {
        next(err);
    }
})

module.exports = router2;