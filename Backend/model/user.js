const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    referralCode: 
    {
        type: String, 
        unique: true, 
        required: true,
    },
    coins:
    {
        type: Number,
        default: 0
    }, 
    usedReferral:
    {
        type: [String],
        default: [] ,
    }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
module.exports = User;


