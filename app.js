var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var cors = require('cors');
var authRoutes = require('./routes/auth-routes');
var adminRoutes = require('./routes/admin-routes');

var userRoutes = require('./routes/user-routes');
var commonRoutes = require('./routes/common-routes');
var APP_CONFIG = require('./common/config/app.config');

var User = require('./controllers/auth/user/user.model');
var Utils = require('./common/services/utils');

var ROLE_IDS = require('./common/services/app.properties').ROLE_IDS
app.use(cors());
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

app.use('/auth', authRoutes.authRoutes);
app.use('/admin', function (req, res, next) {
  const authToken = req.get('Authorization');
  User.find({
    authToken: authToken,
    "role.role_id": ROLE_IDS.ADMIN
  }, (userError, userResult) => {
    if (userError) {
      return res.send(Utils.sendResponse(500, null, ['Unable to  fetch User. Please try again'], 'Unable to fetch user. Please try again'));
    }
    if (userResult.length <= 0) {
      return res.send(Utils.sendResponse(401, null, ['Unauthorized User'], 'Unauthorized User. Please try again'));
    }
    next();
  })
}, adminRoutes.adminRoutes);

app.use('/user', function (req, res, next) {
  const authToken = req.get('Authorization');
  User.find({
    authToken: authToken,
    "role.role_id": ROLE_IDS.USER
  }, (userError, userResult) => {
    if (userError) {
      return res.send(Utils.sendResponse(500, null, ['Unable to  fetch User. Please try again'], 'Unable to fetch user. Please try again'));
    }
    if (userResult.length <= 0) {
      return res.send(Utils.sendResponse(401, null, ['Unauthorized User'], 'Unauthorized User. Please try again'));
    }
    next();
  })
}, userRoutes.userRoutes);


app.use('/common', function (req, res, next) {
  const authToken = req.get('Authorization');
  User.find({
    authToken: authToken
  }, (userError, userResult) => {
    if (userError) {
      return res.send(Utils.sendResponse(500, null, ['Unable to  fetch User. Please try again'], 'Unable to fetch user. Please try again'));
    }
    if (userResult.length <= 0) {
      return res.send(Utils.sendResponse(401, null, ['Unauthorized User'], 'Unauthorized User. Please try again'));
    }
    next();
  })
}, commonRoutes.commonRoutes);
// mongodb://localhost:27017/twinkler
// mongodb+srv://saikumar1330:8125431943@meatonline.2gfnx.mongodb.net/MeatOnline?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://saikumar1330:8125431943@cluster0.zwjjz.mongodb.net/twinklers-db?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(res => {
  app.listen(process.env.PORT, () => {
    console.log('listening', process.env.PORT);
	console.log('just checking for auto deploymentt');
  })
})
