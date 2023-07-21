const jwt = require("jsonwebtoken");
const { refreshTokenBodyValidation } = require("../utils/validationSchema");
const express = require("express");
const router = express.Router();
const verifyRefreshToken = require("../utils/verifyRefreshToken");
const UserToken = require("../models/UserToken");
const ACCESS_TOKEN_PRIVATE_KEY = "keeprefresh";

router.post("/", async (req, res) => {
    const { error } = refreshTokenBodyValidation(req.body);

    if (error) {
        return res.status(400).json({ error: true, message: error.details[0].message });
    }

    // console.log(req.body.refreshToken,"Before verifyRefreshToken");
    verifyRefreshToken(req.body.refreshToken)
        .then(({ tokenDetails }) => {
            // console.log("Inside verifyRefreshToken.then");
            // console.log(tokenDetails,'----');
            const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
            const accessToken = jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "14m" });

            // console.log('here');
            res.status(200).json({
                accessToken,
                message: "Access token created successfully",
            });
            console.log('done');
        })
        .catch((err) => {
            console.log("Inside verifyRefreshToken.catch");
            res.status(400).json(err);
        });
});


router.delete("/", async (req, res) => {
    try {
        const { error } = refreshTokenBodyValidation(req.body);

        if (error) {
            return res.status(400).json({ error: true, message: error.details[0].message });
        }

        const refreshToken = req.body.refreshToken;

        const userToken = await UserToken.findOneAndDelete({ token: refreshToken });

        if (!userToken) {
            return res.status(400).json({ error: true, message: "Invalid refresh token" });
        }

        res.status(200).json({ error: false, message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

module.exports = router;
