const apiResponse=require('../utils/ApiResponse')
const catchAsync=require('../utils/async')
const userSchema=require('../models/usermaster')
const planschema=require('../models/upgradeplans')
const preferenceSchema=require('../models/preference')
const reportSchema = require('../models/report')
const connectionSchema = require('../models/connection');
const kycSchema =require('../models/kyc')
const notificationSchema = require('../models/notification')
const visitorSchema = require('../models/visitors')
const socialSchema =require('../models/SocialMedia')
const Api = require('../models/apitrack');
const schedule = require('node-schedule');
const mongoose = require('mongoose')

exports.pofileImgSetting = catchAsync(async (req, res) => {
    try {
      const data = req.body;
      if (!data._id) {
        return apiResponse.ErrorResponse(res, "Please Provide All details");
      } else {
        const updateData = {
            profile_img_setting: data.profile_img_setting,
        };
        const response = await userSchema.findOneAndUpdate(
          { _id: data._id },
          updateData,
          { new: true, upsert: true } 
        )
     return apiResponse.successResponseWithData(res, "Profile updated successfully", response);
      }
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, "Something went wrong");
    }
});
exports.get_planApp= catchAsync(async (req, res) => {
  try {
      const response= await planschema.find()
      apiResponse.successResponseWithData(res, "data fetched Successfully!",response);
  } catch (error) {
        console.log(error);
        apiResponse.ErrorResponse(res, error.message || 'Something went wrong')
  }
});
exports.upGradenow = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    if (!data.plan_id) {
      return apiResponse.ErrorResponse(res, "Please Provide All details");
    } else {
      const checkplan=await planschema.findOne({_id:data.plan_id}) 
      if(checkplan){
        const responsecheck=await userSchema.findOne({_id:data.user_id, premimun:{$ne:'Not A prime Member'}})
        if(responsecheck){
      const response=await userSchema.findOneAndUpdate({_id:data.user_id},{$set:{premimun:checkplan.plan_name}},{new:true})
      const check=await preferenceSchema.findOneAndUpdate({ user_id:data.user_id},{$set:{premimun: checkplan.plan_name}})
        console.log('user',check)
      if(!check){
        const datas= new preferenceSchema({
        user_id:data.user_id,
        premimun: checkplan.plan_name,
        
    })
    datas.mother_tongue = undefined;
    await datas.save()
}
    return apiResponse.successResponseWithData(res, "Subscribed successfully", response);
    }else{
      return apiResponse.ErrorResponse(res, "already Subscribed");
    }
      }else{
        return apiResponse.ErrorResponse(res, "No plan found");
      }
    }

  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, "Something went wrong");
  }
});
exports.blockProfile = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    if (!data.user_id || ! data.other_id) {
      return apiResponse.ErrorResponse(res, "Please Provide All details");
    } else {
      const otherid=new mongoose.Types.ObjectId(data.other_id)
      const response=await userSchema.findOneAndUpdate({_id:data.user_id},{$push:{block_contact:otherid}},{new:true})
      return apiResponse.successResponseWithData(res, "Profile blocked successfully", response);
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, "Something went wrong");
  }
});
exports.unblockProfile = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    if (!data.user_id || ! data.other_id) {
      return apiResponse.ErrorResponse(res, "Please Provide All details");
    } else {
      const otherid=new mongoose.Types.ObjectId(data.other_id)
      const response=await userSchema.findOneAndUpdate({_id:data.user_id},{$pull:{block_contact:otherid}},{new:true})
      return apiResponse.successResponseWithData(res, "Profile unblocked successfully", response);
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, "Something went wrong");
  }
});
exports.reportProfile = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    if (!data.report_id || ! data.reporter_id) {
      return apiResponse.ErrorResponse(res, "Please Provide All details");
    } else {
      const response=new reportSchema({
        report_id:data.report_id,
        reporter_id:data.reporter_id,
        discription:data.discription,
        type:data.type
      })
      return apiResponse.successResponseWithData(res, "Profile reported successfully successfully", response);
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, "Something went wrong");
  }
});
exports.contactPrivacy = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    if (!data.user_id) {
      return apiResponse.ErrorResponse(res, "Please Provide All details");
    } else {
      const response=await userSchema.findOneAndUpdate({_id:data.user_id},{$set:{mobileNumber_visible:data.mobileNumber_visible}},{new:true})   
      return apiResponse.successResponseWithData(res, "Contact Updated successfully", response);
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, "Something went wrong");
  }
});
exports.deleteProfile = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    if (!data.user_id) {
      return apiResponse.ErrorResponse(res, "Please Provide All details");
    } else {
      await connectionSchema.deleteMany({from_user:data.user_id})
      await connectionSchema.deleteMany({to_user:data.user_id})
      await kycSchema.deleteOne({user_id:data.user_id})
      await notificationSchema.deleteMany({user_id:data.user_id})
      await notificationSchema.deleteMany({other_id:data.user_id})
      await preferenceSchema.deleteOne({user_id:data.user_id})
      await reportSchema.deleteMany({report_id:data.user_id})
      await reportSchema.deleteMany({reporter_id:data.user_id})
      await visitorSchema.deleteMany({visiter_id:data.user_id})
      await visitorSchema.deleteMany({user_id:data.user_id})
      const response=await userSchema.deleteOne({_id:data.user_id}) 
      return apiResponse.successResponseWithData(res, "Contact Updated successfully", response);
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, "Something went wrong");
  }
});
exports.hideProfile = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    if (!data.user_id) {
      return apiResponse.ErrorResponse(res, "Please Provide All details");
    } else {
      if(data.hideProfile==7 || data.hideProfile==14 || data.hideProfile==30){
        const response=await userSchema.findOneAndUpdate({_id:data.user_id},{$set:{hideProfile:data.hideProfile}},{new:true})
        await preferenceSchema.findOneAndUpdate({user_id:data.user_id},{$set:{hideProfile:data.hideProfile}},{new:true})
        let duration = data.hideProfile == 7 ? 7 : (data.hideProfile == 14 ? 14 : 30);
        schedule.scheduleJob(new Date(Date.now() + duration * 24 * 60 * 60 * 1000), async () => {
          await userSchema.findOneAndUpdate({_id:data.user_id},{$set:{hideProfile:0}},{new:true})
          await preferenceSchema.findOneAndUpdate({user_id:data.user_id},{$set:{hideProfile:0}},{new:true})
        });
        return apiResponse.successResponseWithData(res, "hide Updated successfully", response);
      }
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, "Something went wrong");
  }
});
exports.unHideProfile = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    if (!data.user_id) {
      return apiResponse.ErrorResponse(res, "Please Provide All details");
    } else {
      if(data.hideProfile==0){
        const response=await userSchema.findOneAndUpdate({_id:data.user_id},{$set:{hideProfile:data.hideProfile}})
        await preferenceSchema.findOneAndUpdate({user_id:data.user_id},{$set:{hideProfile:data.hideProfile}})
        return apiResponse.successResponseWithData(res, "hide Updated successfully", response);
      }
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, "Something went wrong");
  }
});

// social media

exports.createSocialMedia = catchAsync(async (req, res) => {
    try {
        const { instagram, facebook, youtube, linkedin} = req.body;

          const checkData = await socialSchema.findOne();

          let saveData;
          if(checkData){
            saveData = await socialSchema.findOneAndUpdate({_id:checkData._id},{$set:{instagram, facebook, youtube, linkedin }},{new:true});
          }else{
            saveData = await socialSchema.create({  instagram, facebook, youtube, linkedin });
          }
          return apiResponse.successResponseWithData(res, "socialMedia created successfully", saveData);
      } catch (err) {
          console.log(err);
          return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
      }
});


exports.getSocialMedia= catchAsync(async (req, res) => {
  try {

      const socialMediaData = await socialSchema.findOne();
      console.log("socialMediaData==>", socialMediaData);

      if (!socialMediaData) {
          return apiResponse.ErrorResponse(res, 'Social media data not found.');
      }

      return apiResponse.successResponseWithData(res, 'Social media data found successfully', socialMediaData);
  } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
  }
});
exports.deleteSocialMedia = catchAsync(async (req, res) => {
  try {
    const deleteResult = await socialSchema.deleteMany({});

    if (deleteResult.deletedCount === 0) {
      return apiResponse.ErrorResponse(res, 'No social media data found to delete.');
    }

    return apiResponse.successResponse(res, 'All social media data deleted successfully');
  } catch (err) {
    console.log(err);
    return apiResponse.successResponseWithData(res, err.message || 'Something went wrong',deleteResult);
  }
});
exports.apistrack=catchAsync(async (req,res)=>{
  try{
    const response =await Api.find()
    return apiResponse.successResponseWithData(res, ' data fetched successfully', response);
  }catch(err){
    console.log(err);
    return apiResponse.successResponseWithData(res, err.message || 'Something went wrong',deleteResult);
  }
});
  
 

