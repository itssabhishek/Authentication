//jshint esversion:6
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrpt = require('mongoose-encryption');
const encryptedChildren = require('mongoose-encryption');

const app = express();

//Connect to our DB
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });

//Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

//Encrypting Database
const secret = 'thisisasecret';
userSchema.plugin(encrpt, { secret: secret, encryptedFields: ['password'] });

//Model
const User = new mongoose.model('User', userSchema);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.get('/register', function (req, res) {
  res.render('register');
});

//For New registration
app.post('/register', function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save(function (err) {
    !err ? res.render('secrets') : console.log(err);
  });
});

//For Login registered user
app.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render('secrets');
        } else {
          console.log("Password doesn't match.");
        }
      } else {
        console.log("User doesn't Exits!");
        res.render('register');
      }
    }
  });
});

app.listen(3000, function () {
  console.log('Server has started on port 3000');
});
