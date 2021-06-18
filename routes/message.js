const express = require('express')
const router = express.Router()
const Message = require('../models/message.model')
const jwt = require('jsonwebtoken')



router.post('/store-message', async (req, res) => {
    try {
        const message = new Message({
            message: req.body.message,
        })
        await message.save()
            .then((data) => {
                res.send(data)
            })
    } catch (error) {
        if (error) res.status(500).send("token error")
    }
});

module.exports = router

