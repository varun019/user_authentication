const Joi = require("joi");
const JoiPassword = require("joi-password-complexity");

const signUpBodyValidation = (body) => {
    const schema = Joi.object({
        userName: Joi.string().required().min(5).label("userName"),
        email: Joi.string().required().label("email"),
        password: JoiPassword().required().label("password"),
    })
    console.log(body);
    return schema.validate(body);
}

const logInBodyValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().required().label("Email"),
        password: JoiPassword().required().label("Password"),
    })
    return schema.validate(body);
}

const refreshTokenBodyValidation = (body) =>  {
    const schema = Joi.object({
        refreshToken : Joi.string().required().label("refreshToken")
    })
    return schema.validate(body);
}
module.exports = { signUpBodyValidation, logInBodyValidation , refreshTokenBodyValidation};