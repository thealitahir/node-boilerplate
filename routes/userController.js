var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');
const nodemailer = require('nodemailer');
var http = require('https');

router.get('/login', function(req, res) {
  console.log('in login');
  console.log(req.body);
  UserModel.findOne(
    { email: req.body.email, password: req.body.password },
    function(err, user) {
      if (!err) {
        res.send({ status: true, message: 'User found', data: user });
      } else {
        res.send({ status: false, message: 'User not found' });
      }
    }
  );
});

router.post('/register', function(req, res) {
  console.log('in register');
  console.log(req.body);
  var newUser = new UserModel();
  newUser.firstName = req.body.fullName;
  newUser.lastName = req.body.lastName;
  newUser.username = req.body.email;
  newUser.password = req.body.password;

  newUser.save((err, doc) => {
    if (!err) {
      res.send({
        status: true,
        message: 'User registered successfully',
        data: doc
      });
    } else {
      res.send({ status: false, message: 'User not found' });
    }
  });
});

router.post('/forgetPassword', async (req, res) => {
  console.log('in forget password');
  var user = req.body;
  console.log(user);
  //let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ali.techqalandars@gmail.com', // generated ethereal user
      pass: 'techqalandars1234' // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  var mail_options = {
    from: '"Fred Foo 👻" <ali.techqalandars@gmail.com>', // sender address
    to: user.email, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
  };
  let info = await new Promise((resolve, reject) => {
    transporter.sendMail(mail_options, (err, response) => {
      if (err) {
        res.send({ status: 500, message: 'Unable to send email.' });
        reject(err);
      } else {
        res.send({ status: 200, message: 'Email Sent', data: response });
        resolve(response);
      }
    });
  });
  console.log(info);
});

router.post('/asycAwaitExample', (req, res) => {
  var jsonData = req.body.details;
  var searchQuery =
    jsonData.usertype == TRANSCRIBER
      ? { uploaded_by_id: jsonData.id }
      : { doctor_id: jsonData.id };
  searchQuery.is_active = 'true';
  isAuthorizedUser(
    jsonData.id,
    jsonData.usertype,
    jsonData.auth_key,
    '',
    async function(err, status) {
      if (status) {
        console.log('Get /get_all_combined_transcriptions Call');
        const doctor_transcriptions = await new Promise((resolve, reject) => {
          Doctor_Transcribtions.find({ ...searchQuery, is_active: 'true' })
            .sort({ _id: -1 })
            .exec(function(err, doctorTranscribtions) {
              if (err) {
                res.send({
                  status: 500,
                  message: 'Unable to find Transcription.'
                });
                reject(err);
              } else {
                resolve(doctorTranscribtions);
              }
            });
        });

        const audio_transcriptions = await new Promise((resolve, reject) => {
          Audio_Transcribtions.find({ ...searchQuery, is_active: 'true' })
            .sort({ _id: -1 })
            .exec(function(err, audioTranscribtions) {
              if (err) {
                res.send({
                  status: 500,
                  message: 'Unable to find Transcription.'
                });
                reject(err);
              } else {
                resolve(audioTranscribtions);
              }
            });
        });
        var data = {};
        data.array = audio_transcriptions.concat(doctor_transcriptions);
        res.send({
          status: 200,
          message: 'All Doctor and Audio Transcriptions.',
          data: data
        });
      } else {
        res.send({ status: 300, message: 'Authentication Failed' });
      }
    }
  );
});

module.exports = router;
