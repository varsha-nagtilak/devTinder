const express = require('express')
const authRouter = express.Router()
const User = require("../models/user")
const {validateSignUp} = require("../utils/validation")
const bcrypt = require("bcrypt")

authRouter.post("/signUp",async (req,res) => {
    const {firstName, lastName, emailId, password} = req.body
     try {
         validateSignUp(req.body)
         // Encrypt password
         const passwordHash = await bcrypt.hash(password, 10);
         const user = new User({
             firstName,
             lastName,
             emailId,
             password: passwordHash,
         });
         await user.save();
           const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
         const token = await user.getJwt()
         res.cookie("token", token, {expires: expiryDate})
         res.json(user)
         //res.send("Saved")
     } catch(err) {
         res.status(400).send("Error: " + err.message);
     }
 })

 authRouter.post("/login",async (req, res) => {
   const {emailId, password} = req.body;  
   try {
     const user = await User.findOne({emailId});
     if(!user) {
         res.status(404).send("Invalid credencials");
     } 
     const isPasswordValid = await user.validatePassword(password)
     if(isPasswordValid) {
         const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
         const token = await user.getJwt()
         res.cookie("token", token, {expires: expiryDate})
         res.json(user)
     } else {
         throw new Error("Invalid credencials")
     }
   } catch(err) {
         res.status(400).send("Error: " + err.message);
     }
 })

 authRouter.post("/logout", async(req, res)=> {
   res.cookie("token", null, {
    expires: new Date( Date.now())
   }).send("Logged  out")
 })

 module.exports = authRouter;