const express = require("express");

const app = express();


app.get("/user", (req,res) => {

    res.send({firstName:"Varsha", lastnam: "Nagtilak"})
})

app.post("/user", (req,res) => {
console.log("")
    res.send("Data save")
})

app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777")
})