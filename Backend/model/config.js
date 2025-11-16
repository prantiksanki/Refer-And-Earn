const mongoose = require("mongoose");


const configSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: 
    {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    email:
    {
        type: String,
        required: true , 
        unique: true,
    }
}, { timestamps: true });


const Config = mongoose.model("Config", configSchema);
module.exports = Config;
