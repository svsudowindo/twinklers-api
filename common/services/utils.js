var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%&!@';

exports.generatePassword = (length) => {
  var result = '';
  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

exports.sendResponse = (statusCode, data, errors = [], message) => {
  return JSON.stringify({ status: statusCode, data: data, errors: errors, message: message });
}

exports.getIsObject = (input) => {
  if (typeof (input) !== 'string' && typeof (input) !== 'number' && typeof (input) !== 'boolean') {
    return true;
  } else {
    return false;
  }
}
