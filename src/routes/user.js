const express = require('express')
const userRouter = express.Router()
const User = require("../models/user")
const {userAuth} = require("../middlewares/auth")

const ConnectionRequest = require("../models/connectionRequest") 
const USER_SELF_DATA = "firstName lastName photoUrl age gender about skills";
// Get all connecton request for logged in user
userRouter.get("/user/requests/received",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        console.log("loggedInUser", loggedInUser)
        const connectionRequests = await ConnectionRequest.find({toUserId: loggedInUser._id, status:"interested"})
        .populate("fromUserId", USER_SELF_DATA)
        res.json({message: "Data fetched successfully!!!", data: connectionRequests})
    } catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async(req, res) => {
    console.log("connectionRequest", req)
    try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
        $or: [
            {toUserId: loggedInUser._id, status: "accepted"},
            {fromUserId: loggedInUser._id, status: "accepted"}
        ]
    }).populate("fromUserId", USER_SELF_DATA).populate("toUserId", USER_SELF_DATA);
    console.log("connectionRequest", connectionRequest)
    const data = connectionRequest.map((row) => {
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId;
    })
    res.json({data})
    } catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SELF_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;