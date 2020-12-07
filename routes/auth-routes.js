var express = require('express');
var authRoutes = express.Router();

var UserDAO = require('../controllers/auth/user/user.dao');
var RolesDAO = require('../controllers/auth/roles/roles.dao');
var GenderDAO = require('../controllers/auth/gender/gender.dao');

authRoutes.post('/register', UserDAO.saveUser);

authRoutes.post('/forgot-password', UserDAO.forgotPassword)

authRoutes.post('/login', UserDAO.login);

authRoutes.get('/get-roles', RolesDAO.getRoles);

authRoutes.post('/get-role-id', RolesDAO.getRoleById);

authRoutes.post('/create-roles', RolesDAO.createRoles);

authRoutes.post('/create-gender', GenderDAO.createGender);

authRoutes.get('/genders-list', GenderDAO.getGenders);

exports.authRoutes = authRoutes;
