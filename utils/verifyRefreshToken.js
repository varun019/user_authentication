const jwt = require("jsonwebtoken");
const UserToken = require("../models/UserToken");
const secretkey = "secretkey"; 

const verifyRefreshToken = async (refreshToken) => {
    // console.log(refreshToken, '[][][][][][][][]');

    try {
        const doc = await UserToken.findOne({ token: refreshToken });
        // console.log('start');

        if (!doc) {
            throw { message: "Invalid refresh Token" };
        }

        const tokenDetails = await jwt.verify(refreshToken, secretkey);
        // console.log(tokenDetails, 'I am here!');
        return {
            tokenDetails,
            message: "Valid refresh Token",
        };
    } catch (err) {
        console.error(err);
        throw { message: "Invalid refresh Token" };
    }
};

module.exports = verifyRefreshToken;
