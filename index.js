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
app.use('/api/message', auth, messageRoutes)

//connecting to DB
mongoose.connect('mongodb://localhost:27017/chatDB',
    { useNewUrlParser: true, useUnifiedTopology: true },
    console.log('Connected to DB'))

io.on('connection' , (socket) => {
    console.log("User connected with " + socket.id);
    
})

server.listen(5000, () => {
    console.log('server listening on port 5000')
});



