const express = require("express");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Config = require("../model/config");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET || 'Prantik',
        { expiresIn: '7d' }
    );
};


// ---------------------- REGISTER ----------------------
router.post("/register", async (req, res) => {
    try {
        let { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate unique referral code
        let referralCode;
        let exists = true;
        while (exists) {
            const random = Math.floor(10000 + Math.random() * 90000);
            referralCode = (name.split(" ")[0] + random).toUpperCase();
            exists = await User.findOne({ referralCode });
        }

        const FIXED_REWARD_VALUE = Math.floor(Math.random() * 100) + 1;

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            referralCode,
            coins: 0,
            usedReferral: []
        });

        await newUser.save();

        const configData = new Config({
            key: referralCode,
            value: FIXED_REWARD_VALUE,
            email: email
        });

        await configData.save();

        // Generate JWT token
        const token = generateToken(newUser);

        // Set cookie with JWT token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                referralCode: newUser.referralCode
            },
            token,
            referralRewardConfig: configData
        });

    } catch (error) {
        console.error("Register error :", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});


// ---------------------- LOGIN ----------------------
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

        // Generate JWT token
        const token = generateToken(user);

        // Set cookie with JWT token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                referralCode: user.referralCode
            },
            token
        });

    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

// ---------------------- LOGOUT ----------------------
router.post("/logout", (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.status(200).json({ message: "Logged out successfully" });
});

// ---------------------- REFERRAL DATA ----------------------
router.get("/referral-data/:email", verifyToken, async (req, res) => {
    try {
        const { email } = req.params;

        // Current user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get user's referral reward config (what THIS user gives to others)
        const userConfig = await Config.findOne({ key: user.referralCode });
        const userRewardValue = userConfig ? userConfig.value : 50;

            const referredByYouCodes = user.usedByReferral;
            const referredByYouList = await User.find({ referralCode: { $in: referredByYouCodes } });
        
            const referredByYouData = referredByYouList.map(u => ({
                name: u.name,
                code: u.referralCode,
                coins: userRewardValue,  
                email: u.email,
                status: "completed",
                joinedDate: new Date(u.createdAt).toLocaleDateString()
            }));
        
            let referrersList = [];
        
            if (user.usedReferral.length > 0) {
                const referrers = await User.find({ referralCode: { $in: user.usedReferral } });
                referrersList = referrers.map(referrer => ({
                    name: referrer.name,
                    email: referrer.email,
                    code: referrer.referralCode,
                    joinedDate: new Date(referrer.createdAt).toLocaleDateString(),
                    status: "active"
                }));
            }

        res.status(200).json({
            message: "Referral data fetched successfully",
            user: {
                name: user.name,
                email: user.email,
                referralCode: user.referralCode,
                coins: user.coins,  
                totalReferrals: referredByYouList.length,
                rewardTier:
                    user.coins >= 1000 ? "Premium" :
                        user.coins >= 500 ? "Gold" : "Silver"
            },
            referredUsers: referredByYouData,
                referrers: referrersList,
            coinsPerReferral: userRewardValue
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching referral data", error: error.message });
    }
});

module.exports = router;
