const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const userRouter = require('./router/user');
const applyReferral = require('./router/applyReferral');
const cors = require('cors');

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.set('io', io);

app.use('/api/users', userRouter);
app.use('/api/referral', applyReferral);


const mongo_url = process.env.MONGO_URL;

mongoose.connect(mongo_url)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB:", err));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Join user to a room (room named after user ID)
    socket.on('join-user', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    // Listen for disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});