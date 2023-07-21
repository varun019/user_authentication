const User = require("../models/User");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { signUpBodyValidation, logInBodyValidation, refreshTokenBodyValidation } = require("../utils/validationSchema");
const generateToken = require("../utils/generateTokens");

router.post('/register', async (req, res) => {
    try {
        console.log(req.body);
        const { error } = signUpBodyValidation(req.body);

        if (error) {
            return res.status(400).json({ error: true, message: error.details[0].message });
        }
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ error: true, message: "User already exists with the given email" })
        }
        else {

            // const salt = bcrypt.genSalt(Number(process.env.salt));
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            await new User({ ...req.body, password: hashedPassword }).save();

            res.status(201).json({ message: "User registered successfully" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
})

router.post('/login', async (req, res) => {

    try {
        const { error } = logInBodyValidation(req.body);

        if (error) {
            return res.status(400).json({ error: true, message: error.details[0].message });
        }

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({ error: true, message: "Invalid email or passeword" });
        }

        const verifiedPassword = bcrypt.compare(req.body.password, user.password);

        if (!verifiedPassword) {
            return res.status(401).json({ error: true, message: " Invalid email or passeword " });
        }

        const { accessToken, refreshToken } = await generateToken(user);

        res.status(200).json({
            error: false,
            message: "logged in successfully",
            accessToken,
            refreshToken,
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal server error" })
    }

})

module.exports = router;