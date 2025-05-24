const jwt = require('jsonwebtoken')
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        //Read token
        const { token } = req.cookies;
        if(!token) {
            return res.status(401).send("Please login!!!")
        }
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
        console.log("decoded message:", decodedToken)
        const {_id} = decodedToken;
        console.log("decoded _id:", _id)
        // Find user
        const user = await User.findById(_id)
        if(!user) {
            throw new Error("User not found!")
        }
        req.user = user
        next();
    } catch(err) {
        res.status(400).send("Error: "+ err.message)
    }

}

module.exports = {
    userAuth 
}