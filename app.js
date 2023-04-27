const express = require("express")

const app = express();

port = process.env.PORT | 3000;

app.get("/", (req, res) => {
    res.send("a7a")
})

app.use(express.json());

app.listen(port, () => {
    console.log("Server Running on Port: " + port);
})