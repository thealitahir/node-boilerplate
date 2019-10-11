var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');
const nodemailer = require('nodemailer');
var http = require('https');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

router.get('/login', async (req, res) => {
  console.log('in login');
  console.log(req.body);
  const user = await new Promise((resolve, reject) => {
    UserModel.findOne(
      { email: req.body.email, password: req.body.password },
      function (err, user) {
        if (!err) {
          resolve(user);
          //res.send({ status: true, message: 'User found', data: user });
        } else {
          reject(err);
          // res.send({ status: false, message: 'User not found' });
        }
      }
    );
  });
  console.log(user);

  if (!user) {
    res.send({ status: false, message: 'Invalid Credentials', data: {} });
  } else {
    var key = generateRandomString();
    const updated_user = await new Promise((resolve, reject) => {
      UserModel.findOneAndUpdate(
        { email: req.body.email },
        {
          $set: {
            auth_key: key
          }
        },
        { new: true },
        function (error, auth_user) {
          if (!error) {
            resolve(auth_user);
          } else {
            reject(error);
          }
        }
      );
    });
    console.log(updated_user);
    if (updated_user) {
      res.send({
        status: true,
        message: 'User login successful',
        data: updated_user
      });
    } else {
      res.send({ status: false, message: 'User login failed', data: {} });
    }
  }
});

router.post('/register', async (req, res) => {
  console.log('in register');
  console.log(req.body);

  const unique_user = await new Promise((resolve, reject) => {
    UserModel.findOne({ email: req.body.email }, (err, user) => {
      if (!err) {
        resolve(user);
      } else {
        reject(err);
      }
    });
  });
  console.log(unique_user);

  if (unique_user) {
    res.send({ status: false, message: 'Email already exists', data: {} });
  } else {
    var key = generateRandomString();
    var newUser = new UserModel();
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    newUser.phoneNo = req.body.phoneNo;
    newUser.location = req.body.location;
    newUser.auth_key = key;
    const new_user = await new Promise((resolve, reject) => {
      newUser.save((err, new_user) => {
        if (!err) {
          resolve(new_user);
        } else {
          reject(err);
        }
      });
    });
    console.log(new_user);
    if (new_user) {
      res.send({
        status: true,
        message: 'User registered successfully',
        data: new_user
      });
    } else {
      res.send({
        status: false,
        message: 'Unable to register user',
        data: {}
      });
    }
  }
});

router.post('/forgetPassword', async (req, res) => {
  console.log('in forget password');
  var user = req.body;
  console.log(user);
  const msg = {
    to: user.email,
    from: 'ali.techqalandars@gmail.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail.send(msg);
  //let testAccount = await nodemailer.createTestAccount();
  /* let transporter = nodemailer.createTransport({
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
  console.log(info); */
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
    async function (err, status) {
      if (status) {
        console.log('Get /get_all_combined_transcriptions Call');
        const doctor_transcriptions = await new Promise((resolve, reject) => {
          Doctor_Transcribtions.find({ ...searchQuery, is_active: 'true' })
            .sort({ _id: -1 })
            .exec(function (err, doctorTranscribtions) {
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
            .exec(function (err, audioTranscribtions) {
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

function generateRandomString() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (var i = 0; i < 25; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  text += Date.now();
  return text;
}

module.exports = router;
