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
    usedReferral:         // Codes this user has used
    {
        type: [String],
        default: [] ,
    }, 
    usedByReferral:    // Codes of users who used this user's referral code
    {
        type: [String],
        default: [] ,
    },
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
module.exports = User;


