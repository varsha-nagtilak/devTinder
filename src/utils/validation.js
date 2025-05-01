const validator = require("validator")
const validateSignUp = (reqData) => {
    const {firstName,lastName,emailId, password, photouUrl } = reqData;
    if(! firstName || !lastName) {
        throw new Error("Name invalid")
    } else if(!validator.isEmail(emailId)) {
        throw new Error("Email invalid")
    } else if(!validator.isStrongPassword(password)) {
        throw new Error("Password invalid")
    }
}
module.exports = {
    validateSignUp 
}