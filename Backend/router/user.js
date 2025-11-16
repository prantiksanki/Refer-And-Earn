const express = require("express");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const Config = require("../model/config");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        let { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let referralCode;
        let exists = true;

        while (exists) {
            const random = Math.floor(10000 + Math.random() * 90000);      // referral code already exists 
            referralCode = (name.split(" ")[0] + random).toUpperCase();
            exists = await User.findOne({ referralCode });
        }

        let coin_Value = Math.floor(Math.random() * 101);
        if (isNaN(coin_Value) || coin_Value < 0 || coin_Value > 100) {
            coin_Value = 100;
        }

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            referralCode
        });

        await newUser.save();

        const existingConfig = await Config.findOne({ key: referralCode });
        if (existingConfig) {
            return res.status(500).json({
                message: "Referral code conflict in config, try again"
            });
        }

        const configData = new Config({
            key: referralCode,
            value: coin_Value,
            email: email
        });

        await configData.save();

        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
            referralRewardConfig: configData
        });

    } catch (error) {
        console.error("Register error :", error);
        res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        res.status(200).json({
            message: "Login successful",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Error logging in",
            error: error.message
        });
    }
});

module.exports = router;
