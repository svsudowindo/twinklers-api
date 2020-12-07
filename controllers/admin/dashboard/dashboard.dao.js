var CategoryModal = require('../category/category.model');
var ProductModal = require('../products/products.model');
var Utils = require('./../../../common/services/utils')
var UsersModal = require('../../auth/user/user.model');
exports.getDashboardData = (req, res, next) => {
  const responsePayLoadObj = {
    category_active: 0,
    category_inactive: 0,
    products_active: 0,
    products_inactive: 0,
    users_active: 0,
    users_inactive: 0
  };
  CategoryModal.find({}, (error, result) => {
    if (error) {
      return res.send(Utils.sendResponse(500, null, ['Unable to Fetch Categories'], 'Unable to Fetch Categories'));
    } else {

      const active = [];
      const inactive = [];
      result.forEach(obj => {
        if (obj.active) {
          active.push(obj);
        } else {
          inactive.push(obj);
        }
      });
      responsePayLoadObj.category_active = active.length;
      responsePayLoadObj.category_inactive = inactive.length;
      ProductModal.find({}, (productsError, productsResult) => {
        if (productsError) {
          return res.send(Utils.sendResponse(500, null, ['Unable to Fetch Products'], 'Unable to Fetch Products'));
        } else {
          const productsActive = [];
          const productsInactive = [];
          productsResult.forEach(obj => {
            if (obj.active) {
              productsActive.push(obj);
            } else {
              productsInactive.push(obj);
            }
          });
          responsePayLoadObj.products_active = productsActive.length;
          responsePayLoadObj.products_inactive = productsInactive.length;
          UsersModal.find({
            "role.role_id": 2
          }, (userError, usersResult) => {
            if (userError) {
              return res.send(Utils.sendResponse(500, null, ['Unable to Fetch Users'], 'Unable to Fetch Users'));
            } else {
              responsePayLoadObj.users_active = usersResult.length;
            }
            return res.send(Utils.sendResponse(200, responsePayLoadObj, [], 'Dashboard Details Fetched successfully'));
          })
        }
      })
    }
  })
}
