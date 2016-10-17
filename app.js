var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
var neo4j = require("neo4j-driver").v1;
var shortid = require("shortid");

var User = require('./models/user');

var app = express();

//View Engine
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(path.join(__dirname, "public")));

var username = process.env['NEO4J_USERNAME'];
var password = process.env['NEO4J_PASSWORD'];

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic(username, password));
var session = driver.session();

app.get("/", function(req, res) {

  res.render('index');

});

app.post('/friends/add', function(req, res) {
  var bothUsers = req.body;

  var senderInfo = bothUsers[0];
  var receiverInfo = bothUsers[1];

  User.addFriend(senderInfo, receiverInfo, function(msg) {
    res.send(msg);
  });

});

app.get('/users/get', function(req, res) {
  User.getAllUsers(function(allUsers, msg) {
    console.log(msg);
    res.send({
      users: allUsers
    });
  });
});

app.post('/users/signup', function(req, res) {
  var userInfo = {
    "fname": req.body.first_name,
    "lname": req.body.last_name,
    "email": req.body.email,
    "username": req.body.username,
    "password": req.body.password
  }

  User.createUser(userInfo, function(msg) {
    res.send(msg);
  });

});

app.post('/users/remove', function(req, res) {
  var userInfo = req.body;

  User.removeUser(userInfo, function(msg) {
    res.send(msg);
  });

});

app.post('/users/update', function(req, res) {
  var userInfo = req.body;

  User.updateUser(userInfo, function(msg) {
    res.send(msg);
  });

});

app.post('/users/login', function(req, res) {
  var userName = req.body.username;
  var userPass = req.body.password;

  session
    .run("MATCH (n:User) RETURN n")
    .then(function(result) {
      var userArr = [];
      result.records.forEach(function(record) {
        userArr.push({
          fname: record._fields[0].properties.fname,
          lname: record._fields[0].properties.lname,
          email: record._fields[0].properties.email,
          username: record._fields[0].properties.username
        });
      });
      res.send({
        users: userArr
      });
    }).catch(function(err) {
      console.log(err);
    });

  res.redirect("home");

});

app.listen(3000);

console.log("Server Started on Port 3000");

module.exports = app;
