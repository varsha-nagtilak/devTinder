const express = require('express')
const profileRouter = express.Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

const {userAuth} = require("../middlewares/auth")
const { validateProfileData, validatePassword } = require('../utils/validation')

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log("user",user)
        res.send(user)

    } catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateProfileData(req)) {
            throw new Error("Invalid Edit Request.");
        } else {
            const loggedInUser = req.user;
            Object.keys(req.body).forEach((key) => {loggedInUser[key] = req.body[key]})
            console.log("loggedInUser",loggedInUser)
            await loggedInUser.save()
            res.json({
                message: `${loggedInUser.firstName}, your profile updated successfuly`,
                data: loggedInUser
            })
        }
    } catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})

profileRouter.patch("/profile/changePassword", userAuth, async(req, res)=> {
const changedPassword = req.body.password;
try {
    validatePassword(req.body);
    const loggedInUser = req.user;
    const passwordHash = await bcrypt.hash(changedPassword, 10);
    console.log("loggedInUser",loggedInUser)
    loggedInUser['password'] = passwordHash
    await loggedInUser.save()
    res.send("Password updated successfully")
} catch(err) {
    res.status(400).send("Error: " + err.message);
}
})

module.exports = profileRouter;