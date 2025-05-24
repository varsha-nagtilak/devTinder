const validator = require("validator")
const validateSignUp = (reqData) => {
    const {firstName,lastName,emailId, password, photoUrl } = reqData;
    if(! firstName || !lastName) {
        throw new Error("Name invalid")
    } else if(!validator.isEmail(emailId)) {
        throw new Error("Email invalid")
    } else if(!validator.isStrongPassword(password)) {
        throw new Error("Password invalid")
    }
}

const validateProfileData = (req) => {
    const ALLOWED_VALUES = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"]
    const isAllowedEditField = Object.keys(req.body).every((k) => ALLOWED_VALUES.includes(k))
    console.log("validateProfileData", isAllowedEditField)
    return isAllowedEditField;
}

const validatePassword = (reqData) => {
    const {password } = reqData;
    if(!validator.isStrongPassword(password)) {
        throw new Error("Password invalid")
    }
}
module.exports = {
    validateSignUp,
    validateProfileData,
    validatePassword
}