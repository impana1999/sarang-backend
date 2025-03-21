const apiResponse=require('../utils/ApiResponse')
const catchAsync=require('../utils/async')
const AppError=require('../utils/appError')
const adminSchema=require('../models/admin')
const userSchema=require('../models/usermaster')
const dropdown=require('../models/dropdown')
const kycSchema =require('../models/kyc')
const planschema=require('../models/upgradeplans')
const {generateAdminTokenPayload,generateUserTokenPayload,generateTokensObject,generateAdminTokensObject } = require("../services/token.helper");


exports.adminRegistration =catchAsync( async (req, res) => {
    try {
      const { user_name, password } = req.body;
      if( !user_name || !password ){
        apiResponse.ErrorResponse(res, "Please Provide All details");
      }
      const existingAdmin = await adminSchema.findOne({ user_name:user_name,password:password });
      if (existingAdmin) {
        return res.status(409).json({  status:false,message: 'Admin already exists' });
      }
  else{
      const newAdmin = new adminSchema({
        user_name:user_name,
        password:password 
      });
  
     const response= await newAdmin.save();
     const tokenPayload = generateAdminTokenPayload(response);
     const tokens = generateAdminTokensObject(tokenPayload);
      return res.status(201).json({ status:true, message: 'Admin registered successfully',response,tokens });
    } 
  }catch (error) {
      console.log(error)
      apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.adminLogin =catchAsync( async (req, res) =>{
    try {
      const { user_name, password } = req.body;
      if( !user_name || !password ){
        apiResponse.ErrorResponse(res, "Please Provide All details");
      }
      const admin = await adminSchema.findOne({ user_name :user_name,password:password});
      const tokenPayload = generateAdminTokenPayload(admin);
     const tokens = generateAdminTokensObject(tokenPayload);
      if (!admin) {
        return res.status(401).json({ status:false, message: 'Authentication failed' });
      }else{
          return res.status(200).json({ status:true,message: 'logged in successfully',admin,tokens });
      }
    } catch (error) {
      console.log(error)
      apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.getAllUsers = catchAsync(async (req, res,next) => {
        const response = await userSchema.find().sort({ createdAt: -1 });
        apiResponse.successResponseWithData(res, "User Fetched Successfully!",response);
})
exports.newusers =catchAsync( async (req, res) => {
    try {
      const now = new Date();
      const twentyFourHoursAgo = Date.now(now - 24 * 60 * 60 * 1000); 
  
      const count = await userSchema.countDocuments({
        createdAt: {
          $gte: twentyFourHoursAgo,
          $lt: now
        }
      });
      apiResponse.successResponseWithData(res, "Otp sent successfully",count);
    } catch (error) {
      console.log(error)
      apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.totalUsersCount =catchAsync( async (req, res) => {
  try{
        const totalUsersCount = await userSchema.find().count()
        apiResponse.successResponseWithData(res, "Otp sent successfully",totalUsersCount);
    }catch (error) {
        console.log(error)
        apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.adminBlock = catchAsync(async (req, res) => {
  try {
      const { _id } = req.body;
      const user = await userSchema.findOne({ _id:_id });
      if (!user) {
        apiResponse.ErrorResponse(res, "User Not Found");
      }
           if (user.adminBlock === true){
            const response = await userSchema.findOneAndUpdate({_id:_id},{ $set: { adminBlock:false} },{ new: true });
            apiResponse.successResponseWithData(res, "Unblocked Successfully!",response);
          } else {
            const response = await userSchema.findOneAndUpdate({_id:_id},{ $set: { adminBlock:true} },{ new: true });
            apiResponse.successResponseWithData(res, "Blocked Successfully!",response);
          }
  } catch (error) {
      console.log(error);
      apiResponse.ErrorResponse(res, err.message || 'Something went wrong')
  }
});
exports.addAlldropdown = catchAsync(async (req, res) => {
try {
  const{religion,community,mother_tongue,living_in_city,living_in_state,married_status,diet,
    height,qualification,worked_with,income,physical_status,eating_habbits,educational,employed_in,occupation,
    ancestrel_origin,looking_for,residential_status,caste,drinking_habbits,smoking_habbits,residential_area,city}=req.body
  const data=new dropdown({
    religion:religion,
    community:community,
    mother_tongue:mother_tongue,
    living_in_city:living_in_city,
    living_in_state:living_in_state,
    married_status:married_status,
    diet:diet,
    height:height,
    qualification:qualification,
    worked_with:worked_with,
    income:income,
    physical_status:physical_status,
    eating_habbits:eating_habbits,
    educational:educational,
    employed_in:employed_in,
    occupation:occupation,
    ancestrel_origin:ancestrel_origin,
    looking_for:looking_for,
    residential_status:residential_status,
    caste:caste,
    residential_area:residential_area,
    city:city,
    drinking_habbits:drinking_habbits,
    smoking_habbits:smoking_habbits,
  })
  const response=await data.save()
  apiResponse.successResponseWithData(res, "Dropdown added Successfully!",response);
} catch (error) {
      console.log(error);
      apiResponse.ErrorResponse(res, error.message || 'Something went wrong')
}
});
exports.getAllDropdown = catchAsync(async (req, res) => {
  try {
    const response=await dropdown.find()
    apiResponse.successResponseWithData(res, "Dropdown fetched Successfully!",response);
  } catch (error) {
        console.log(error);
        apiResponse.ErrorResponse(res, err.message || 'Something went wrong')
  }
});
exports.approve_kyc = catchAsync(async (req, res) => {
  try {
    const data= req.body
    if(!data.user_id){
      apiResponse.ErrorResponse(res, "Please provide all teh details");
    }else{
     const datas= await kycSchema.findOne({user_id:data.user_id,approve:'false'})
     console.log(datas)
     if(data.type==="Approve"){
      const response= await kycSchema.findOneAndUpdate({user_id:data.user_id},{$set:{approve:'Approved'}},{new:true})
       await userSchema.findOneAndUpdate({_id:data.user_id},{$set:{kyc_status:'Approved'}},{new:true})
      apiResponse.successResponseWithData(res, "approved Successfully!",response);
     }
     if(data.type==="Reject"){
      const response= await kycSchema.findOneAndUpdate({user_id:data.user_id},{$set:{approve:'Rejected'}},{new:true})
      await userSchema.findOneAndUpdate({_id:data.user_id},{$set:{kyc_status:'Rejected'}},{new:true})
      apiResponse.successResponseWithData(res, "rejeted Successfully!",response)
    }

  }
 } catch (error) {
        console.log(error);
        apiResponse.ErrorResponse(res, error.message || 'Something went wrong')
  }
});
exports.getAprroved_kyc = catchAsync(async (req, res) => {
  try {
    const response= await kycSchema.find({approve:'Approved'})
    apiResponse.successResponseWithData(res, "fetched Successfully!",response);
  } catch (error) {
        console.log(error);
        apiResponse.ErrorResponse(res, err.message || 'Something went wrong')
  }
});
exports.getReject_kyc = catchAsync(async (req, res) => {
  try {
    const response= await kycSchema.find({approve:'Rejected'})
    apiResponse.successResponseWithData(res, "fetched Successfully!",response);
  } catch (error) {
        console.log(error);
        apiResponse.ErrorResponse(res, err.message || 'Something went wrong')
  }
});
exports.add_plans = catchAsync(async (req, res) => {
  try {
    const data =req.body
    if(!data.plan_name || !data.months){
      apiResponse.ErrorResponse(res, 'Please Provide All Details')
    }else{
      const response= await planschema.create(req.body)
      apiResponse.successResponseWithData(res, "data added Successfully!",response);
    }
  } catch (error) {
        console.log(error);
        apiResponse.ErrorResponse(res, err.message || 'Something went wrong')
  }
});
exports.getAll_plans = catchAsync(async (req, res) => {
  try {
      const response= await planschema.find()
      apiResponse.successResponseWithData(res, "data fetched Successfully!",response);
  } catch (error) {
        console.log(error);
        apiResponse.ErrorResponse(res, err.message || 'Something went wrong')
  }
});
exports.edit_plans = catchAsync(async (req, res) => {
  try {
    const data =req.body
    if(!data._id){
      apiResponse.ErrorResponse(res, 'Please Provide All Details')
    }else{
      const response= await planschema.findOneAndUpdate({_id:data._id},{$set:{plan_name:data.plan_name,months:data.months,
        amount:data.amount,discription:data.discription}},{new:true})
      apiResponse.successResponseWithData(res, "data added Successfully!",response);
    }
  } catch (error) {
        console.log(error);
        apiResponse.ErrorResponse(res, error.message || 'Something went wrong')
  }
});
exports.delete_plan = catchAsync(async (req, res) => {
  try {
    const data =req.body
    if(!data._id){
      apiResponse.ErrorResponse(res, 'Please Provide All Details')
    }else{
      const response= await planschema.findOneAndDelete({_id:data._id})
      apiResponse.successResponseWithData(res, "data deleted Successfully!",response);
    }
  } catch (error) {
        console.log(error);
        apiResponse.ErrorResponse(res, error.message || 'Something went wrong')
  }
});

