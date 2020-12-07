var express = require('express');
var userRoutes = express.Router();
var CategoryDAO = require('../controllers/admin/category/category.dao');
var UserDAO = require('../controllers/auth/user/user.dao');
var ProductDAO= require('../controllers/admin/products/products.dao');


exports.userRoutes = userRoutes;
