const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required:true,
        minLength: 4
    },
    lastName: {
        type: String,
        required:true
    },
    emailId: {
        type: String,
        required:true,
        index: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email invalid")
            }
        }
    },
    password: {
        type: String,
        required:true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Password invalid")
            }
        }
    },
    age: {
        type: Number,
        min:18,
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is invalid")
            }
        }
    },
    photouUrl: {
        type: String,
        default: "https://www.inforwaves.com/media/2021/04/dummy-profile-pic-300x300-1.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("URL invalid")
            }
        }
    },
    about: {
        type: String,
        default: "This is default text"    
    },
    skills: {
        type: [String]
    }
});

const userModel = mongoose.model("User", userSchema)
module.exports = userModel