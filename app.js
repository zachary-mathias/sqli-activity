const http = require('http'),
    path = require('path'),
    port = process.env.PORT || 3000,
    express = require('express'),
    bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
    db.run("INSERT INTO user VALUES ('regularGuy', 'password', 'Normal User')");
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let query = "SELECT * FROM user WHERE username = '" + username + "' AND password = '" + password + "'";
    console.log(query);
    db.get(query, (err, row) => {
        if (err) {
            console.log(err)
            res.status(500).json({ "error": err.message });
            return;
        } else if (!row) {
            res.redirect("/index.html#unauthorized");
        } else {
            res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br><br>SECRETS <br> <br> MORE SECRETS <br><br><a href="/index.html"> Go back to login</a > ');
            }
    });

});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})