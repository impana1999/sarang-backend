const apiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/async');
const Aboutus = require('../models/Aboutus');

exports.createAbout = catchAsync(async (req, res) => {
    try {
        const {title, content,type} = req.body;
        const saveData = await Aboutus.create({ type, title, content });
        return apiResponse.successResponseWithData(res, "Privacy and policy created successfully", saveData);
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.getAllAboutUs = catchAsync(async (req, res) => {
    try {
        const data=req.body
        const allPrivacy = await Aboutus.find({type:data.type});
        return apiResponse.successResponseWithData(res, "All privacy and policy retrieved successfully", allPrivacy);
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.updateAbout = catchAsync(async (req, res) => {
    try {
        const data=req.body
        const updatedData = await Aboutus.findOneAndUpdate({_id:data._id},{$set:{title:data.title,content:data.content}},{new:true});
        if (!updatedData) {
            return apiResponse.ErrorResponse(res, "Privacy and policy not found");
        }
        return apiResponse.successResponseWithData(res, "Privacy and policy updated successfully", updatedData);
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.deleteAbout = catchAsync(async (req, res) => {
    try {
        const _id=req.body
        const deletedData = await Aboutus.findOneAndDelete({_id:_id});
        return apiResponse.successResponseWithData(res, "All privacy and policy deleted successfully", deletedData);
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});





