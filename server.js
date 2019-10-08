var express = require('express');
var app = express();
var mongoose = require('mongoose');
var login = require('./routes/login');
var register = require('./routes/register');
var port = 3000;
// Configurations
global.CONFIGURATIONS = {
  dbHost: 'localhost',
  dbPort: 27017,
  db: 'test',
  ssl: false,
  projectpath: '/home/platformFrontend/numtraplatformv2',
}

/* app.use('/login',login);
app.use('/register',register); */
var uri = 'mongodb://' + CONFIGURATIONS.dbHost + ':' + CONFIGURATIONS.dbPort + '/' + CONFIGURATIONS.db;
mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("DB CONNECTED");
  var server = app.listen(port, '0.0.0.0', function () {
    console.log('Server started on port :' + port);
  });
  io = require('socket.io').listen(server);
});