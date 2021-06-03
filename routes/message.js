const express = require('express')
const router = express.Router()
const Message = require('../models/message.model')
const jwt = require('jsonwebtoken')
const IOserver = require('../index')


router.post('/store-message/:id', async (req, res) => {
    
    req.io.on('connection' , (socket) => {
        socket.on('message', async (data) => { 
            console.log(data)
        });
    })

    try {
        const message = new Message({
            message: req.body.message,
            userId: req.params.id
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

