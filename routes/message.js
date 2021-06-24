const express = require('express')
const router = express.Router()
const Message = require('../models/message.model')
const jwt = require('jsonwebtoken')



router.post('/store-message', async (req, res) => {
    try {
        const message = new Message({
            message: req.body.message,
            userId: req.body.userId
        })
        await message.save()
            .then((data) => {
                res.send(data)
               
                
            })
    } catch (error) {
        if (error) res.status(500).send("token error")
    }
});

router.get('/all-messages/:Id', async (req, res) => {
    await Message.find({userId: req.params.Id}).populate('userId')
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            res.status(402).json(error)
        })
})

module.exports = router

