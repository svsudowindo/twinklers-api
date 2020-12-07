var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  userName: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  gender: {
    gender_id: {
      type: Number,
      required: true
    },
    name: {
      type: String
    }
  },
  role: {
    "role_id": {
      type: Number,
      required: true
    },
    "name": {
      type: String
    }
  },
  addresses: [{
    type: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    street: {
      type: String,
      default: ''
    },
    landmark: {
      type: String,
      default: ''
    },
    pincode: {
      type: Number,
      default: null
    }
  }],
  authToken: {
    type: String,
    required: true
  },
  createDate: {
    type: Date,
    default: (new Date()).getMilliseconds()
  },
  updatedDate: {
    type: Date,
    required: true,
    default: (new Date()).getMilliseconds()
  }
})

UserSchema.plugin(uniqueValidator);
var User = mongoose.model('User', UserSchema);

module.exports = User;
