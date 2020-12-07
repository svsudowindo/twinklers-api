var mongoose = require('mongoose');

var RolesSchema = mongoose.Schema({
    name: {
        type: String
    },
    role_id: {
        type: Number
    }
});

var Roles = mongoose.model('roles', RolesSchema);

module.exports = Roles;
