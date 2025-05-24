const express = require('express')
const requestRouter = express.Router()
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

const {userAuth} = require("../middlewares/auth")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        console.log("fromUser",fromUserId)
        const allowedStatus = ["interested", "ignored"]
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type: "
 + status            })
        }
        console.log("toUserId", toUserId)
        const toUser = await User.findById(toUserId)
        
        console.log("toUserId----", toUser)
        if(!toUser) {
            return res.status(404).json({message: "User not found"})
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })
        if(existingConnectionRequest){
            return res.status(400).send({message: "Connectin Request Aleready Exist"})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        console.log("connectionRequest", connectionRequest)
        const data = await connectionRequest.save()
        res.json({
            message: "Connection Request Sent",
            data
        })

    } catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})

  requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const {requestId, status} = req.params
        const allowedStaus = ["accepted", "rejected"]
        if(!allowedStaus.includes(status)) {
            return res.status(400).json({message: "Status not allowed"});
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if(!connectionRequest){
            return res.status(404).json({message: "Connection Request not found"});
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({message: "Connection request accepted", data})
    } catch(err) {
        res.status(400).send("Error: " + err.message);
    }})

// requestRouter.post("/request/send/interested/:toUserId", userAuth, async (req, res) => {
//     try {
//         const user = req.user;
//         console.log("user",user)
//         res.send(user.firstName + " sent the connect request!!")

//     } catch(err) {
//         res.status(400).send("Error: " + err.message);
//     }
// })

module.exports = requestRouter;