const express = require("express");
const app = express();
var cors = require('cors')
const {connectDB} = require("./config/database")
const User = require("./models/user")
const {validateSignUp} = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require('cookie-parser')

require('dotenv').config();
app.use(cors(
    {
        origin: 'http://localhost:5174',
        credentials: true
    }
    
))
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

// // Get User by email
// app.get("/user", async(req,res) => {
//     const emailId = req.body.emailId;
//     try {
//         console.log("Emaik Id", emailId);
//         const user = await User.findOne({emailId: emailId});
//         if(!user) {
//             res.status(404).send("User not found");
//         } else {
//             res.send(user);
//         }
//     } catch(error) {
//         res.status(400).send("Somthing went wrong");
//     }
// });

// //Get All Users
// app.get("/feed", async (req, res) => {
//     try {
//     const users = await User.find()
//     if(!users.length) {
//         res.status(404).send("User not found");
//     } else {
//         res.send(users);
//     }
//     } catch(error) {
//         res.status(400).send(error);
//     }
// })

// //Get User by Id
// app.get("/user/:userId", async (req, res) => {
//     const userId = req.params.userId;
//     try {
//     const user = await User.findById(userId)
//     if(!user) {
//         res.status(404).send("User not found");
//     } else {
//         console.log("User: ", user)
//         res.send(user);
//     }
//     } catch(error) {
//         res.status(400).send("Somthing went wrong");
//     }
// })

// // Delete user by id

// app.delete("/user/:userId", async (req, res) => {
//     const userId = req.params.userId;
//     try {
//     const user = await User.findByIdAndDelete(userId)
//     res.status(200).send("User deleted", user);
//     } catch(error) {
//         res.status(400).send("Somthing went wrong");
//     }
// })

// // Update the user by id

// app.patch("/user/:userId", async(req, res) => {
//     const userId = req.params.userId;
//     const updatedValue = req.body;
//     const ALLOUD_VALUES = ["emailId","password", "firstName", "lastName", "age", "gender", "photouUrl", "about", "skills"]
//     console.log("userId", userId)
//     console.log("updatedValue", updatedValue)
//     try{
//         const isUpdateAllowed = Object.keys(updatedValue).every((k) => ALLOUD_VALUES.includes(k))
//         if(!isUpdateAllowed) {
//          throw new Error("update not allowed")
//         }
//         await User.findByIdAndUpdate(userId,updatedValue, {
//             returnDocument: "after",
//             runValidators: true
//         } )
//         res.send("User Updated")
//     } catch(error) {
//         res.status(400).send(error.message);
//     }
// })

connectDB()
.then(() => {
    console.log("Databaae connected")
    app.listen(process.env.PORT, () => {
        console.log("Server is successfully listening on port 7777")
    })
})
.catch(err => {
    console.error("Databaae not connected")
})
