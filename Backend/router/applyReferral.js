const express = require("express");
const Config = require("../model/config");
const User = require("../model/user");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/apply-referral", verifyToken, async (req, res) => {
    try {
        const { referralCode, email } = req.body;   // email = user applying the code (B)

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

        // Get the referrer's (A's) reward config - this determines how much B gets
        const referrerRewardConfig = await Config.findOne({ key: code });

        if (!referrerRewardConfig || !referrerRewardConfig.value) {
            return res.status(500).json({
                message: "Reward configuration missing",
                key: code
            });
        }

        const rewardAmount = referrerRewardConfig.value;

        user.coins += rewardAmount;

        user.usedReferral.push(code);
        referredUser.usedByReferral.push(user.referralCode);

        await user.save();
        await referredUser.save();


        const referrerInfo = {
            name: referredUser.name,
            code: code,
            email: referredUser.email,
            joinedDate: new Date(referredUser.createdAt).toLocaleDateString()
        };

        const io = req.app.get('io');

        io.to(email).emit('referral-applied', {
            message: "Referral code applied successfully",
            coinsAwarded: rewardAmount,
            totalCoins: user.coins, 
            usedReferral: user.usedReferral,
            referrer: referrerInfo
        });

        io.to(email).emit('coins-updated', {
            totalCoins: user.coins,
            coinsAwarded: rewardAmount
        });


        io.to(referredUser.email).emit('new-referral', {
            referredBy: user.name,
            friendEmail: user.email,
            totalReferrals: referredUser.usedByReferral.length
        });

        return res.status(200).json({
            message: "Referral code applied successfully",
            coinsAwarded: rewardAmount,
            totalCoins: user.coins,
            referrer: referrerInfo
        });

    } catch (err) {
        return res.status(500).json({
            message: "Error applying referral code",
            error: err.message
        });
    }
});

module.exports = router;
