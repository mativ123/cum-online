const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require("bcrypt");

const app = express();

app.set("view engine", "pug");

app.use(express.static("public"));
app.use(session({
    secret: "dinMOR69420838847jnkfj",
    saveUninitialized: true,
    resave: false,
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const salt = "$2b$10$O3vN7ezQgxet83d0kuuU3O";

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
        req.session.points = 0;
    }
    if(req.session.click_scale == undefined) {
        req.session.click_scale = 1;
    }
    var username = "not logged in";
    if(req.session.user != undefined) {
        username = req.session.user;
    }
    res.render("index", {click: click, points: req.session.points, username: username});
});

app.get("/login", (req, res) => {
    res.render("login", {});
});

app.post("/login", (req, res) => {
    db.all("SELECT * FROM User", (err, rows) => {
        if(err) {
            throw err;
        }
        var should_run = true;
        rows.forEach((row, key, arr) => {
            if(should_run) {
                bcrypt.compare(req.body.pass, row.password, (err, result) => {
                    if(err) {
                        throw err;
                    }
                    if(result && req.body.username == row.username) {
                        req.session.user = row.username;
                        should_run = false;
                        res.redirect("/");
                    }
                });
                if(arr.length == key) {
                    res,redirect("/login");
                }
            }
        });
    });
});

app.get("/register", (req, res) => {
    res.render("register.pug", {});
})

app.post("/register", (req, res) => {
    db.all("SELECT username FROM User", (err, rows) => {
        if(err){
            throw err;
        }
        var should_run = true;
        rows.forEach((row) => {
            if(row.username == req.body.username && should_run) {
                res.redirect("/register");
                should_run = false;
            }
            if(req.body.pass == req.body.conf_pass && should_run) {
                bcrypt.hash(req.body.pass, salt, (err, hash) => {
                    if(err) {
                        throw err;
                    }
                    db.run("INSERT INTO User (username, password) VALUES (?,?)", [req.body.username, hash], (err) => {
                        if(err) {
                            throw err;
                        }
                    });
                });
                should_run = false;
                res.redirect("/login");
            } else if(should_run) {
                res.redirect("/register");
            }
        });
    });
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
    db.all("SELECT * FROM User", (err, rows) => {
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
