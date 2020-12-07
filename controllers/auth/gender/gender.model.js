var mongoose = require('mongoose');

var GenderSchema = mongoose.Schema({
    name: {
        type: String
    },
    gender_id: {
        type: Number
    }
});

var Genders = mongoose.model('genders', GenderSchema);

module.exports = Genders;
