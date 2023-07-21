const jwt = require("jsonwebtoken");
const UserToken = require("../models/UserToken");
const secretkey = "secretkey";

const generateToken = async (user) => {
    try {
        const payload = { _id: user._id, roles: user.roles };

        const accessToken = jwt.sign(payload, secretkey, { expiresIn: "14m" });

        const refreshToken = jwt.sign(payload, secretkey, { expiresIn: "30d" });

        const userToken = await UserToken.findOne({ userId: user._id });

        if (userToken) await userToken.deleteOne({userId : user._id});

        await new UserToken({ userId: user._id, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken })
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports = generateToken;