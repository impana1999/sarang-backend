const apiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/async');
const OurServices = require('../models/OurServices');
exports.createService = catchAsync(async (req, res) => {
    try {
        const { type,title, description } = req.body;
        const image =  req.files.map(file => file.filename) || []
        console.log("image-->", image);
        const saveData = await OurServices.create({ type, title, description, image });
        return apiResponse.successResponseWithData(res, "Catering service created successfully", saveData);
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.getAllServices = catchAsync(async (req, res) => {
    try {
        const {type}=req.body
        const response = await OurServices.find({ type: type });
        return apiResponse.successResponseWithData(res, "Retrieved all data services", response);
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.updateServices = catchAsync(async (req, res) => {
    try {
        const { title, description, id } = req.body;
        const image = req?.files.map(file => file.filename); // Ensure images is an array
        let updateServices ;
        if(image.length > 0){
            updateServices = await OurServices.findOneAndUpdate({ _id: id },{ $set: { title, description, image } },{ new: true });
            }else{
                updateServices = await OurServices.findOneAndUpdate({ _id: id },{ $set: { title, description}},{ new: true });
            }
        if (!updateServices) {
            return apiResponse.ErrorResponse(res, "WP service not found");
        }

        return apiResponse.successResponseWithData(res, "WP service updated successfully", updateServices);
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.deleteServices = catchAsync(async (req, res) => {
    try {
        const { id } = req.body;
        const deleteServices = await OurServices.findOneAndDelete({ _id: id});
        if (!deleteServices) {
            return apiResponse.ErrorResponse(res, "WP service not found");
        }
        return apiResponse.successResponseWithData(res, "WP service deleted successfully",deleteServices);
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});










