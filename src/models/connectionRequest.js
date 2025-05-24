const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ingonred", "interested", "accepted", "rejected"],
            message: `{VALUES} is incorrect status type`
        }
    }}, {
        timestamps:true
    })

    connectionRequestSchema.index({firstUserId: 1, toUserId: 1})

    connectionRequestSchema.pre("save",function(next) {
        const connectionRequest = this;
        if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
            throw new Error("Can not send connection request to yourself")
        }
        next()
    } )
    const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema)

    module.exports = ConnectionRequestModel