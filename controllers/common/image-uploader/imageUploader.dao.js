
var Utils = require('../../../common/services/utils')
var fs = require('fs');
var path = require('path');
exports.uploadImageAndGetURL = (req, res, next) => {

  const file = req.file;
  const match = ["image/png", "image/jpeg"];
  if (match.indexOf(file.mimetype) === -1) {
    return res.send(Utils.sendResponse(500, null, ['Please upload either png or jpeg Images'], 'Please upload either png or jpeg Images'));
  }
    var tmp_path = file.path;
    const splitForExtention = req.file.originalname.split('.')
    const ext = splitForExtention[splitForExtention.length - 1];
      const fileName = req.file.filename + (new Date().getTime()).toString() + '.' + ext
    var target_path = path.join(process.cwd(), 'public/uploads/', fileName)
  
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() { 
      return res.send(Utils.sendResponse(200, {fileUrl: APP_CONFIG.IMAGE_RESPONSE_URL + 'uploads/' + fileName }, [], 'Uploaded successfully'));
    });
    src.on('error', function(err) {
      if (err) {
        return res.send(Utils.sendResponse(500, null, ['Unable to upload image. Please try again'], 'Unable to Upload Image. Please try again'));
      }
    });
  };