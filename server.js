var express = require("express");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var bodyParser = require('body-parser');

var app = express();

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

const click = [
    {"id": 0, "price": 10,  "effect": 1},
    {"id": 1, "price": 40,  "effect": 6},
    {"id": 2, "price": 100, "effect": 20},
];

app.get("/", (req, res) => {
    if(req.session.points == undefined) {
        console.log("init points");
        req.session.points = 0;
    }
    res.render("index", {click: click, points: req.session.points});
});

app.post("/cum", (req, res) => {
    req.session.points += req.body["n"];
    console.log(req.session.points);
    res.send({"success": true});
});

app.listen(process.env.PORT || 5000, () => console.log(`cum on 5000`));
