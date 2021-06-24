const express = require('express')
const router = express.Router()
const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post('/register', async (req, res) => {
    if (req.body.password === '') {
        return res.status(402).send('Password reqiured')
    }
    const hashPassword = await bcrypt.hashSync(req.body.password, 8)
    const user = new User({
        username: req.body.username,
        password: hashPassword,
        online: false
    })
    await user
        .save()
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.status(403).send("Can't Add Username" || { message: err.message })
        })
});

router.post('/login', async (req, res) => {

    const { username, password } = req.body

    try {
        await User.findOne({ username: username }, async (err, user) => {
            if (err) return res.status(500).send("Error")
            if (!user) return res.status(422).send({ message: "Username not valide" })
            if (user) {
                let checkUserPassword = bcrypt.compareSync(password, user.password)
                if (checkUserPassword) {
                    const token = jwt.sign({ id: user._id }, 'bybypoplol', { expiresIn: 86400 });
                    res.status(200).json({ token: token, user: user })

                    await User.findOneAndUpdate({ username: username }, { online: req.body.online })

                } else {
                    res.status(400).send("Wrong password")
                }
            }
        })
    } catch (error) {
        res.status(500).send({ message: "something Wrong" })
    }
});

router.put('/offline-user/:Id', async (req, res) => {

    await User.findByIdAndUpdate(req.params.Id , { online: req.body.online })
        .then((data) => {
            console.log(req.body.online);
            res.json(data)
        })
        .catch((error) => {
            res.status(422).send(`Error offline user ${error}`)
        })
})

router.get('/online-users', async (req, res) => {
    await User
        .find({online : true})
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.status(500).send("Can't Get all Users" || { message: err.message })
        })
})


module.exports = router