const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    const token = req.header("x-access-token")

    if (!token) {
        return res.status(403).json({ error: true, message: "Access denied : No Token provided" });
    }
    try {
        const tokenDetails = jwt.verify(token, process.env.acccess - token);

        req.user = tokenDetails;
        next();
    } catch (error) {
        console.log(error);
        res.status(403).json({ error: true, message: "Access denied : No Token provided" })
    }
}

module.exports = auth;