const express = require('express');
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const redis = require('redis')

const app = express();

//redis client setup
const client = redis.createClient();
client.on('connect', () => {
    console.log("Redis server connected...")
})


//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//CRUD

app.get("/", (req, res) => {
    client.zrevrange('people', 0, -1, 'withscores', (err, reply) => {
        res.render("index", {
            people: reply
        });
    })
});

app.post("/add", (req, res) => {
    const name = req.body.name;
    const score = req.body.score;
    client.zadd('people', score, name, (err, reply) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Entry added")
        }
        res.redirect("/");
    });
})


//export server
app.listen(3000);
console.log("Server started at port 3000");

module.exports = app;