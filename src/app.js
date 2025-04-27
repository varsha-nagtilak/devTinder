const express = require("express");

const app = express();

app.use("/", (req, res) => {
    res.send("Namaste Varsha!");
})

app.use("/hello", (req, res) => {
    res.send("Hello Varsha!");
})

app.use("/test", (req, res) => {
    res.send("Namaste Varsha!");
})
app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777")
})