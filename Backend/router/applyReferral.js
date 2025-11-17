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

        const referrerRewardConfig = await Config.findOne({ key: user.referralCode });

        if (!referrerRewardConfig || !referrerRewardConfig.value) {
            return res.status(500).json({
                message: "Reward configuration missing",
                key: code
            });
        }

        const rewardAmount = referrerRewardConfig.value;

        // ✅ CORRECT LOGIC: Only B (the new user) gets coins, using A's reward value
        referredUser.coins += rewardAmount;

        // B records that they used A's referral code
        user.usedReferral.push(code);
        referredUser.usedByReferral.push(user.referralCode);

        await user.save();
        await referredUser.save();

        // ✅ IMPORTANT: A's coins NEVER change - we don't modify referredUser at all

        const referrerInfo = {
            name: referredUser.name,
            code: code,
            email: referredUser.email,
            joinedDate: new Date(referredUser.createdAt).toLocaleDateString()
        };

        const io = req.app.get('io');

        // Notify B that they earned coins by using A's code
        io.to(email).emit('referral-applied', {
            message: "Referral code applied successfully",
            coinsAwarded: rewardAmount,
            totalCoins: user.coins,
            usedReferral: user.usedReferral,
            referrer: referrerInfo
        });

        // Notify A that B used their code
        // A's coins don't change, just inform about the referral
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
