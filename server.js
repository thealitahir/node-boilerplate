var express = require('express');
var app = express();
var mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
var user = require('./routes/userController');
const passport = require('passport');
const cookieParser = require('cookie-parser');
var port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser(''));
// Configurations
global.CONFIGURATIONS = {
  dbHost: 'localhost',
  dbPort: 27017,
  db: 'test',
  ssl: false,
  projectpath: '/home/platformFrontend/numtraplatformv2'
};

app.use('/user', user);
var uri =
  'mongodb://' +
  CONFIGURATIONS.dbHost +
  ':' +
  CONFIGURATIONS.dbPort +
  '/' +
  CONFIGURATIONS.db;
mongoose.connect("mongodb+srv://thealitahir:testuser@cluster0-qbtub.azure.mongodb.net/test?retryWrites=true&w=majority");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('DB CONNECTED');
  var server = app.listen(port, '0.0.0.0', function () {
    console.log('Server started on port :' + port);
  });
  io = require('socket.io').listen(server);
});

module.exports = app;
