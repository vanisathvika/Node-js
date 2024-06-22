const express = require("express");
const path = require('path');
const fs = require("fs");
const users = require("./database.json");
var database;
var token="wrong key";

fs.readFile("database.json", function(err, data) { 
    if (err) throw err; 
    database = JSON.parse(data); 
}); 

const jwt = require("jsonwebtoken");

const app = express();

const port = 3000;

app.use(express.json());

app.get('/',
    (req, res) => {
        res.sendFile(__dirname + '/login.html');
    });

app.post("/auth", (req, res) => {
    const name = req.body.name;
    console.log(name);

    const password = req.body.password;
    console.log(password)

    let isPresent = false;
    let isPresentIndex = null;

    for (let i = 0; i < database.length; i++) {
        if (database[i].name === name && database[i].password === password) {
            isPresent = true;
            isPresentIndex = i;
            break;
        }
    }

    if (isPresent) {
        const token = jwt.sign(database[isPresentIndex], "secret");
        res.json({
            login: true,
            token: token,
            data: database[isPresentIndex],
        });
    } else {
        res.json({
            login: false,
            token: token,
            error: "please check name and password.",
        });
    }
});

app.post("/verifyToken", (req, res) => {
    const token = req.body.token;

    if (token) {
        const decode = jwt.verify(token, "secret");
        res.json({
            login: true,
            data: decode,
        });
    } else {
        res.json({
            login: false,
            data: "error",
        });
    }
});

app.post('/login',(req, res) => {
    res.redirect("/login")
});

app.listen(port, () => {
    console.log(`Server is running : http://localhost:${port}/`);
});
