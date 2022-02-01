const express = require("express");
const Curs = require("../models/curs");
// const Curs = require("../Curs");
const router = express.Router();
const { Op } = require("sequelize");
const User = require("../models/user");
const Feedback = require("../models/feedback");

// let cursuri = [
//     new Curs(1, "TW", "Prof 1", 4),
//     new Curs(2, "MM", "Prof 2", 5),
//     new Curs(3, "DSAD", "Prof 3", 2)
// ]

const checkId = (req, res, next) => {
    if (req.params.idCurs && isNaN(req.params.idCurs)) {
        res.status(400).json({ error: "Wrong input for id" });
    } else {
        next();
    }
}

// get cursuri
router.get("/cursuri", async(req, res) => {
    try {
        const { minFeedback } = req.query;
        const { simplified } = req.query;
        const cursuri = await Curs.findAll({
            attributes: simplified ? { exclude: ["id", "createdAt", "updatedAt"] } : undefined,
            where: minFeedback ? {
                feedback: {
                    [Op.gt]: minFeedback
                }
            } : undefined
        });
        return res.status(200).json(cursuri);
    } catch (err) {
        return res.status(500).json(err);
    }
    // let listaFiltrata = [];
    // if (req.query.feedback) {
    //     listaFiltrata = cursuri.filter(x => x.feedback >= req.query.feedback);
    // } else {
    //     listaFiltrata = cursuri;
    // }
    // res.json(listaFiltrata);
})

router.get("/cursuri/:idCurs", checkId, async(req, res) => {
    try {
        const curs = await Curs.findByPk(req.params.idCurs);
        if (curs) {
            return res.status(200).json(curs);
        } else {
            return res.status(404).json({ error: `Curs with id ${req.params.idCurs} not found!` });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
    // const curs = cursuri.find(
    //     (curs) => curs.id == req.params.idCurs
    // );
    // if (curs) {
    //     return res.status(200).json(curs);
    // } else {
    //     return res.status(404).json({ error: "Entity not found!" });
    // }
})

router.post("/cursuri", async(req, res) => {
    try {
        const cursNou = await Curs.create(req.body);
        return res.status(200).json(cursNou);
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

router.put("/cursuri/:idCurs", async(req, res) => {
    try {
        const curs = await Curs.findByPk(req.params.idCurs);
        if (curs) {
            const cursActualizat = await curs.update(req.body);
            return res.status(200).json(curs);
        } else {
            return res.status(404).json({ error: `Curs with id ${req.params.idCurs} not found!` });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
    // cursModificat = cursuri.find(x => x.id == req.params.idCurs);
    // cursModificat.name = req.body.name;
    // cursModificat.prof = req.body.prof;
    // cursModificat.feedback = req.body.feedback;
    // return res.json(cursModificat);
})

router.get("/cursuri/:idCurs/enrollements", async(req, res, next) => {
    try {
        const curs = await Curs.findByPk(req.params.idCurs);
        const users = await curs.getUsers({ attributes: ['id'] });
        if (users.length > 0) {
            res.json(users);
        } else {
            res.status(204);
        }
    } catch (err) {
        next(err);
    }
})

router.post("/cursuri/:idCurs/enrollements/:userId", async(req, res, next) => {
    try {
        const curs = await Curs.findByPk(req.params.idCurs);
        const user = await User.findByPk(req.params.userId);
        if (curs && user) {
            curs.addUser(user);
            await curs.save();
            res.send(204);
        } else {
            res.status(204);
        }
    } catch (err) {
        next(err);
    }
})

router.delete("/cursuri/:idCurs/enrollements/:userId", async(req, res, next) => {
    try {
        const curs = await Curs.findByPk(req.params.idCurs);
        const user = await User.findByPk(req.params.userId);
        if (curs && user) {
            curs.removeUser(user);
            await curs.save();
            res.send(204);
        } else {
            res.status(204);
        }
    } catch (err) {
        next(err);
    }
})

router.delete("/cursuri/:idCurs", async(req, res) => {

    try {
        const curs = await Curs.findByPk(req.params.idCurs);
        if (curs) {
            await curs.destroy();
            res.send(204);
        } else {
            res.status(204);
        }
    } catch (err) {
        next(err);
    }
})

router.post("/cursuri/:idCurs/addFeedback", async(req, res, next) => {
    try {
        const feedback = await Feedback.create(req.body);
        return res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get("/cursuri/:idCurs/getFeedback", async(req, res) => {
    try {
        const feedback = await Feedback.findAll({
            where: req.params.idCurs ? {
                idCurs: {
                    [Op.eq]: req.params.idCurs
                }
            } : undefined
        });
        return res.status(200).json(feedback);
    } catch (err) {
        return res.status(500).json(err);
    }
})

module.exports = router;