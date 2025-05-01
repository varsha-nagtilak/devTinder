const express = require("express");
const app = express();
const {connectDB} = require("./config/database")
const User = require("./models/user")
const {validateSignUp} = require("./utils/validation")
const bcrypt = require("bcrypt")

app.use(express.json());

app.post("/signUp",async (req,res) => {
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
        res.send("Saved")
    } catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})

app.post("/login",async (req, res) => {
  const {emailId, password} = req.body;  
  try {
    const user = await User.findOne({emailId});
    if(!user) {
        res.status(404).send("Invalid credencials");
    } 
    const isPasswordValid = await bcrypt.compare(password,user.password )
    if(isPasswordValid) {
        res.send("User Logged In!!!");
    } else {
        throw new Error("Invalid credencials")
    }
  } catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})
// Get User by email
app.get("/user", async(req,res) => {
    const emailId = req.body.emailId;
    try {
        console.log("Emaik Id", emailId);
        const user = await User.findOne({emailId: emailId});
        if(!user) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
    } catch(error) {
        res.status(400).send("Somthing went wrong");
    }
});

//Get All Users
app.get("/feed", async (req, res) => {
    try {
    const users = await User.find()
    if(!users.length) {
        res.status(404).send("User not found");
    } else {
        res.send(users);
    }
    } catch(error) {
        res.status(400).send(error);
    }
})

//Get User by Id
app.get("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
    const user = await User.findById(userId)
    if(!user) {
        res.status(404).send("User not found");
    } else {
        console.log("User: ", user)
        res.send(user);
    }
    } catch(error) {
        res.status(400).send("Somthing went wrong");
    }
})

// Delete user by id

app.delete("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
    const user = await User.findByIdAndDelete(userId)
    res.status(200).send("User deleted", user);
    } catch(error) {
        res.status(400).send("Somthing went wrong");
    }
})

// Update the user by id

app.patch("/user/:userId", async(req, res) => {
    const userId = req.params.userId;
    const updatedValue = req.body;
    const ALLOUD_VALUES = ["emailId","password", "firstName", "lastName", "age", "gender", "photouUrl", "about", "skills"]
    console.log("userId", userId)
    console.log("updatedValue", updatedValue)
    try{
        const isUpdateAllowed = Object.keys(updatedValue).every((k) => ALLOUD_VALUES.includes(k))
        if(!isUpdateAllowed) {
         throw new Error("update not allowed")
        }
        await User.findByIdAndUpdate(userId,updatedValue, {
            returnDocument: "after",
            runValidators: true
        } )
        res.send("User Updated")
    } catch(error) {
        res.status(400).send(error.message);
    }
})

connectDB()
.then(() => {
    console.log("Databaae connected")
    app.listen(7777, () => {
        console.log("Server is successfully listening on port 7777")
    })
})
.catch(err => {
    console.error("Databaae not connected")
})
