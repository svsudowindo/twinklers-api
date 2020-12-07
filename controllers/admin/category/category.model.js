var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var CategorySchema = mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  id: {
      type: String,
      required: true,
      unique: true
  },
  active: {
      type: Boolean,
      required: true,
      default: true
  },
  createDate: {
    type: Date,
    default: (new Date()).getMilliseconds()
  },
  updatedDate: {
    type: Date,
    required: true,
    default: (new Date()).getMilliseconds()
  },
  createdBy: {
      type: Object
  },
  updatedBy: {
      type: Object
  }
})

CategorySchema.plugin(uniqueValidator);
var CategoryPassword = mongoose.model('category', CategorySchema);

module.exports = CategoryPassword;
