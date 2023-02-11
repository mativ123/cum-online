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
    cookie: {maxAge: 999999999 * 999999999}
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
    if(req.session.click_scale == undefined) {
        req.session.click_scale = 1;
    }
    if(req.session.user != undefined) {
        username = req.session.user;
        db.all("SELECT points FROM Save WHERE user=?", [req.session.user], (err, rows) => {
            if(err) {
                throw err;
            }
            rows.forEach((row) => {
                res.render("index", {click: click, points: row.points, username: req.session.user});
            });
        });
    } else {
        res.render("index", {click: click, points: 0, username: "not logged in"});
    }
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
                    db.run("INSERT INTO Save(user) VALUES (?)", [req.body.username], (err) => {
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
    db.get("SELECT points FROM Save WHERE user=?", [req.session.user], (err, row) => {
        if(err) {
            throw err;
        }
        var point = row.points;
        db.get("SELECT upgrades FROM Save WHERE user=?", [req.session.user], (err, row) => {
            if(err) {
                throw err;
            }
            var multiplier = 0;
            row.upgrades.match(/(?<=:click.=).\d*(?=:)/g).forEach((item) => {
                multiplier += Number(item);
            });
            db.run("UPDATE Save SET points=? WHERE user=?", [point += multiplier, req.session.user], (err) => {
                if(err) {
                    throw err;
                }
            });
        });
        res.send({"n": row.points});
    });
});

app.post("/upgrade", (req, res) => {
    db.get("SELECT points FROM Save WHERE user=?", [req.session.user], (err, row) => {
        if(err) {
            throw err;
        }
        if(row.points >= click[req.body["n"]]["price"]) {
            db.run("UPDATE Save SET points=? WHERE user=?", [row.points - click[req.body["n"]].price, req.session.user], (err) => {
                if(err) {
                    throw err;
                }
            });
            db.get("SELECT upgrades FROM Save WHERE user=?", [req.session.user], (err, row) => {
                if(err) {
                    throw err;
                }
                const search = new RegExp(`click${req.body["n"]}`);
                if(search.test(row.upgrades)) {
                    const replace = new RegExp(`(?<=:click${req.body["n"]}=).\\d*(?=:)`);
                    var up_n = row.upgrades.match(replace);
                    var out = row.upgrades.replace(replace, `${click[req.body["n"]].effect + Number(up_n)}`);
                    console.log(`${up_n} - ${out}`);
                    db.run("UPDATE Save SET upgrades=? WHERE user=?", [out, req.session.user], (err) => {
                        if(err) {
                            throw err;
                        }
                    });
                } else {
                    db.run("UPDATE Save SET upgrades=? WHERE user=?", [`${row.upgrades}click${req.body["n"]}=${click[req.body["n"]].effect}:`, req.session.user], (err) => {
                        if(err) {
                            throw err;
                        }
                    });
                }
                db.all("SELECT * FROM Save", (err, rows) => {
                    if(err) {
                        throw err;
                    }
                    console.table(rows);
                });
            });
        }
        res.send({"n": row.points});
    });
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
