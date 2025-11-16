const express = require("express");
const Config = require("../model/config");
const User = require("../model/user");

const router = express.Router();

router.post("/apply-referral", async (req, res) => {
    try {
        const { referralCode, email } = req.body;

        if (!referralCode || !email) {
            return res.status(400).json({ 
                message: "Referral code and email are required" 
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        const code = referralCode.trim().toUpperCase();

        const referredUser = await User.findOne({ referralCode: code });

        if (!referredUser) {
            return res.status(404).json({ 
                message: "Invalid referral code" 
            });
        }

        if (referredUser.email === email) {
            return res.status(400).json({ 
                message: "You cannot use your own referral code" 
            });
        }

        if (user.usedReferral.includes(code)) {
            return res.status(400).json({ 
                message: "Referral code already used" 
            });
        }

        const configData = await Config.findOne({ key: code });

        if (!configData || !configData.value) {
            return res.status(500).json({ 
                message: "Reward configuration missing" , 
                key : code
            });
        }

        user.coins += configData.value;
        user.usedReferral.push(code);
        await user.save();

        return res.status(200).json({
            message: "Referral code applied successfully",
            coinsAwarded: configData.value,
            totalCoins: user.coins
        });

    } catch (err) {
        return res.status(500).json({
            message: "Error applying referral code",
            error: err.message
        });
    }
});

module.exports = router;
