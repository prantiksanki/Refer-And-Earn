const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const userRouter = require('./router/user');
const applyReferral = require('./router/applyReferral');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRouter);
app.use('/api/referral', applyReferral);


const mongo_url = process.env.MONGO_URL;

mongoose.connect(mongo_url)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB:", err));






app.listen(PORT, (req,res) =>
{
    console.log(`Server is running on port ${PORT}`);
})