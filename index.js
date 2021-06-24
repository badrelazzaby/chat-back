const express = require('express')
const http = require('http')
const socketIO = require('socket.io');
const cors = require('cors')
const mongoose = require('mongoose')
const UserRoutes = require('./routes/user')
const messageRoutes = require('./routes/message')
const auth = require('./middleware/authVerification');



const app = express()
let server = http.createServer(app)
let io = socketIO(server, { cors: { origin: "*" } })

// static files
app.use(express.static("public"));
app.use(cors({
    origin: "*",
    methods: ["POST", "PUT", "GET"]
}))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Export socket config
app.use((req, res, next) => {
    req.io = io;
    return next();
});


//routes
app.use('/api/user', UserRoutes)
app.use('/api/message', messageRoutes)

//connecting to DB
mongoose.connect('mongodb://localhost:27017/chatDB',
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
    console.log('Connected to DB'))

io.on('connection', (socket, data) => {
    io.emit('user-connected', data)

    console.log("User connected with " + socket.id);

    socket.on('disconnect', () => {
        console.log('user with iD ' + socket.id + ' disconnected');
    })

    socket.on('send-message', async (data) => {
        console.log(data);
        io.emit('message', data)
    })

    // socket.on('user-connection', async (data) => {
    //     console.log(data);
    //     io.emit('user-connected', data)
    // })
});

server.listen(5000, () => {
    console.log('server listening on port 5000')
});



