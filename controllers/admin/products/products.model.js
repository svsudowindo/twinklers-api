var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var ProductsSchema = mongoose.Schema({
  categoryID: {
    type: Object,
    default: null
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  mrp: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number,
    required: true,
    default: 0
  },
  cost: {
    type: Number,
    required: true
  },
  availableStock: {
    type: Number,
    required: true
  },
  isStockAvailable: {
    type: Boolean,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    default: ''
  }],
  rating: {
    type: Number,
    default: 0
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

ProductsSchema.plugin(uniqueValidator);
var Products = mongoose.model('products', ProductsSchema);

module.exports = Products;
