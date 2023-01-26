const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(session({
    secret: "dinMOR69420838847jnkfj",
    saveUninitialized: true,
    resave: false,
    cookie: {maxAge: 60000},
}));
app.use(cookieParser());
app.use(bodyParser.json());

let db = new sqlite3.Database("./data", (err) => {
    if(err) {
        throw err;
    }
    console.log("connected");
});

const click = [
    {"price": 10,  "effect": 1},
    {"price": 40,  "effect": 6},
    {"price": 100, "effect": 20},
];

app.get("/", (req, res) => {
    if(req.session.points == undefined) {
        console.log("init points");
        req.session.points = 0;
    }
    if(req.session.click_scale == undefined) {
        console.log("init click_scale");
        req.session.click_scale = 1;
    }
    res.render("index", {click: click, points: req.session.points});
});

app.post("/cum", (req, res) => {
    req.session.points += req.session.click_scale;
    res.send({"n": req.session.points});
});

app.post("/upgrade", (req, res) => {
    if(click[req.body["n"]]["price"] <= req.session.points) {
        req.session.click_scale += click[req.body["n"]]["effect"];
        req.session.points -= click[req.body["n"]]["price"];
    }
    res.send({"n": req.session.points});
});

app.post("/sqtest", (req, res) => {
    db.run("INSERT INTO User (username) VALUES (?)", ["balls"], (err) => {
        if(err) {
            throw err;
        }
    });
    db.all("SELECT * FROM User WHERE username =?", ["balls"], (err, rows) => {
        if(err){
            throw err;
        }
        rows.forEach((row) => {
            console.log(row);
        });
    });
    res.send({"sus": "very"});
});

app.listen(process.env.PORT || 5000, () => console.log(`cum on 5000`));
