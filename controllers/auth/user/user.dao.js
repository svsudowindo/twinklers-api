var User = require('./user.model');
var Utils = require('../../../common/services/utils')
var emailService = require('../../../common/email.config/email.config');
var ROLES = require('../../../common/services/app.properties').ROLES;
var ROLE_IDS = require('../../../common/services/app.properties').ROLE_IDS;

var RolesModal = require('../roles/roles.model');
var GenderModal = require('../gender/gender.model');

/**
 * Create User
 */
exports.saveUser = (req, res, next) => {
  let payload = req.body;
  var user = new User(payload);
  RolesModal.find({
    role_id: payload.role.role_id
  }, (rolesError, rolesResult) => {
    if (rolesError) {
      return res.send(Utils.sendResponse(500, null, ['Unable to fetch roles'], 'Unable to fetch roles'));
    }
    if (rolesResult.length <= 0) {
      return res.send(Utils.sendResponse(404, null, ['No Role exist with specified role id'], 'No Role exist with specified role id'));
    }
    GenderModal.find({
      gender_id: payload.gender.gender_id
    }, (genderError, genderResult) => {
      if (genderError) {
        return res.send(Utils.sendResponse(500, null, ['Unable to fetch gender'], 'Unable to fetch gender'));
      }
      if (genderResult.length <= 0) {
        return res.send(Utils.sendResponse(404, null, ['No Gender exist with specified gender id'], 'No Gender exist with specified role id'));
      }
      user.role = rolesResult[0];
      user.gender = genderResult[0];
      user.userName = payload.firstName + ' ' + payload.lastName;
      user.password = Utils.generatePassword(8);
      user.authToken = Utils.generatePassword(36);
      user.save((userSaveError, savedUser) => {
        if (userSaveError) {
          if (userSaveError.errors.email) {
            return res.send(Utils.sendResponse(500, null, [userSaveError.errors.email.message], userSaveError.errors.email.message));
          } else {
            return res.send(Utils.sendResponse(500, null, ['Unable to  create User. Please try again'], 'Unable to fetch user. Please try again'));
          }
        }
        if (savedUser.length >= 0) {
          return res.send(Utils.sendResponse(400, null, ['Unauthorized user'], 'Unauthorized user'));
        }
        let emailBody = {
          email: user.email,
          password: user.password
        };
        emailService.sendMail(emailBody, 'Registration with Twinklers', 'You have registered with Twinklers', 'Please Use following credentials to login', true)
        return res.send(Utils.sendResponse(200, savedUser, [], 'User Saved Successfully'));
      })
    })

  })

}

/**
 * Request a new password by using registered email ID 
 */
exports.forgotPassword = (req, res, next) => {
  const payload = req.body;
  User.find({
    email: payload.email
  }, (userError, userRes) => {
    if (userError) {
      return res.send(Utils.sendResponse(500, null, ['Unable to fetch User details ... Please Try again'], 'Unable to fetch User details ... Please Try again'));
    }
    if (userRes.length <= 0) {
      return res.send(Utils.sendResponse(302, null, ['User Does not exist ... Please enter Registered Email'], 'User Does not exist ... Please enter Registered Email'));
    }
    const password = Utils.generatePassword(8);
    const authToken = Utils.generatePassword(36);
    let emailBody = {
      email: payload.email,
      password: password
    };
    // emailService.sendMail(emailBody, 'Twinkler ... Forgot Password ', 'Your New Password', 'Please Use following credentials to login', true);
    userRes[0].password = password;
    userRes[0].authToken = authToken;
    updatePassword(userRes, req, res, next);
  })
}

function updatePassword(userRes, req, res, next) {
  userRes[0].updatedDate = new Date().getMilliseconds();
  User.updateOne({
    _id: userRes[0]._id
  }, userRes[0], (passwordUpdateError, passwordSuccess) => {
    if (passwordUpdateError) {
      return res.send(Utils.sendResponse(500, null, ['Unable to Update Password ... Please Try again'], 'Unable to Update Password ... Please Try again'));
    }
    if (passwordSuccess && passwordSuccess.nModified === 1) {
      delete userRes[0].password;
      return res.send(Utils.sendResponse(200, userRes[0], [], 'User Saved Successfully'));
    } else {
      return res.send(Utils.sendResponse(500, null, ['Unable to Update Password ... Please Try again'], 'Unable to Update Password ... Please Try again'));
    }
  })
}
/**
 * Reset Password by previous password and new password
 */
exports.resetPassword = (req, res, next) => {
  const payload = req.body;
  if (payload.confirmPassword !== payload.newPassword) {
    return res.send(Utils.sendResponse(401, null, ['New passord and confirm password should be same... Please try again ...'], 'New passord and confirm password should be same... Please try again ...'));
  }
  User.find({
    password: payload.password
  }, (userError, userRes) => {
    if (userError) {
      return res.send(Utils.sendResponse(500, null, ['Unable to fetch User details ... Please Try again'], 'Unable to fetch User details ... Please Try again'));
    }
    if (userRes.length <= 0) {
      return res.send(Utils.sendResponse(302, null, ['Please enter the correct password ... Please try again ...'], 'Please enter the correct password ... Please try again ...'));
    }
    userRes[0].password = payload.newPassword;
    updatePassword(userRes, req, res, next);
  })
}

/**
 * Update Profile 
 */
exports.updateUserProfile = (req, res, next) => {
  const payload = req.body;
  User.find({
    _id: payload._id,
    email: payload.email
  }, (userError, userRes) => {
    if (userError) {
      return res.send(Utils.sendResponse(500, null, ['Unable to fetch User details ... Please Try again'], 'Unable to fetch User details ... Please Try again'));
    }
    if (userRes.length <= 0) {
      return res.send(Utils.sendResponse(302, null, ['User does not exist in the system... Please try with valid User'], 'User does not exist in the system... Please try with valid User'));
    }
    const updateInfo = Object.assign(userRes[0], payload);
    updateInfo.updatedDate = new Date().getMilliseconds();
    User.updateOne({
      _id: payload._id
    }, updateInfo, (userUpdateError, userUpdateSuccess) => {
      if (userUpdateError) {
        return res.send(Utils.sendResponse(500, null, ['Unable to update User ... Please try again ...'], 'Unable to update User ... Please try again ...'));
      }
      if (userUpdateSuccess.nModified === 1) {
        delete updateInfo.password;
        return res.send(Utils.sendResponse(200, updateInfo, [], 'User profile Updated Successfully'));
      } else {
        return res.send(Utils.sendResponse(500, null, ['Unable to update the user profile ... Please try again...'], 'Unable to update the user profile ... Please try again...'));
      }
    })
  })
}
/**
 * User Login
 */
exports.login = (req, res, next) => {
  const payload = req.body;
  User.find({
    email: payload.email,
    password: payload.password
  }, (loginError, loginSuccess) => {
    if (loginError) {
      return res.send(Utils.sendResponse(500, null, ['Unable to Login... Please try again...'], 'Unable to Login ... Please try again...'));
    }
    if (loginSuccess.length <= 0) {
      return res.send(Utils.sendResponse(302, null, ['Please enter valid credentials ...'], 'Please enter valid credentials ...'));
    }
    delete loginSuccess[0].password;
    return res.send(Utils.sendResponse(200, loginSuccess[0], [], 'Login Success...'));
  })
}

/**
 * Get user details by user id and Authorization Token
 */

exports.getUserByUserId = (req, res, next) => {
  const id = req.params.id;
  const authToken = req.get('Authorization');
  User.find({
    _id: id,
    authToken: authToken
  }, (userError, userRes) => {
    if (userError) {
      return res.send(Utils.sendResponse(500, null, ['Unable to get the user details... Please try again ...'], 'Unable to get the user details... Please try again ...'));
    }
    if (userRes.length <= 0) {
      return res.send(Utils.sendResponse(302, null, ['No user exist ...'], 'No user exist ...'));
    }
    delete userRes[0].password;
    return res.send(Utils.sendResponse(200, userRes[0], [], 'User details fetched Successfully ...'));
  })
}

exports.getAllUsers = (req, res, next) => {
  const id = req.params.id;
  const authToken = req.get('Authorization');
  User.find({
    _id: id,
    authToken: authToken,
    "role.role_id": ROLE_IDS.ADMIN
  }, (userError, userRes) => {
    if (userError) {
      return res.send(Utils.sendResponse(500, null, ['Unable to get the user details... Please try again ...'], 'Unable to get the user details... Please try again ...'));
    }
    if (userRes.length <= 0) {
      return res.send(Utils.sendResponse(302, null, ['Invalid User... Please try with admin'], 'Invalid User... Please try with admin'));
    }
    User.find({
      "role.role_id": ROLE_IDS.USER
    }, (usersListError, usersListSuccess) => {
      if (usersListError) {
        return res.send(Utils.sendResponse(500, null, ['Unable to get the user details... Please try again ...'], 'Unable to get the user details... Please try again ...'));
      }
      if (usersListSuccess.length <= 0) {
        return res.send(Utils.sendResponse(302, usersListSuccess, [], 'No Users Exist ... '));
      }
      usersListSuccess.forEach(function (v) {
        delete v.password
      });
      return res.send(Utils.sendResponse(200, usersListSuccess, [], 'User details fetched Successfully ...'));
    })
  })
}
