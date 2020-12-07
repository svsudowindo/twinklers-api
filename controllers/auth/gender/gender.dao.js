var GenderModal = require('../gender/gender.model');
var Utils = require('../../../common/services/utils');


/**
 * Create gender
 */
exports.createGender = (req, res, next) => {
    const payload = req.body;
    const genders = new GenderModal(payload);
    GenderModal.find({gender_id: payload.gender_id}, (genderError, genderSuccess) => {
        if (genderSuccess && genderSuccess.length <= 0) {
            genders.save((genderErr, genderResult) => {
                if (genderErr) {
                    return res.send(Utils.sendResponse(500, null, ['Unable to save Gender.. Please try again'], 'Unable to save Gender.. Please try again'));
                }
                return res.send(Utils.sendResponse(200, payload, [], 'Gender Created Successfully')); 
            })
        } else {
            return res.send(Utils.sendResponse(200, payload, [], 'Gender Already Exist')); 
        }
    })
}


/**
 * Get all Genders 
 */
exports.getGenders = (req,res, next) => {
    GenderModal.find({}, (genderError, genderResult) => {
        if (genderError) {
            return res.send(Utils.sendResponse(500, null, ['Unable to Fetch Genders.. Please try again'], 'Unable to Fetch Genders.. Please try again'));
        }
        if (genderResult.length <= 0) {
            return res.send(Utils.sendResponse(400, null, ['No Genders Exist'], 'No genders Exist'));
        }
        return res.send(Utils.sendResponse(200, genderResult, [], 'Genders Fetched Successfully')); 
    })
}