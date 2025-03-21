const apiResponse=require('../utils/ApiResponse')
const catchAsync=require('../utils/async')
const kycSchema =require('../models/kyc')
const userSchema=require('../models/usermaster')
//author Sarang

exports.addKyc=catchAsync(async(req,res)=>{
  try{
 const data=req.body
 if(!data.user_id ||!data.kyc_name||!data.kyc_no){
    apiResponse.ErrorResponse(res,'Please provide All the details');
 }else{
  const find=await kycSchema.findOne({user_id:data.user_id,approve:'Rejected'})
  if(find){
    const response=await kycSchema.findOneAndUpdate({user_id:data.user_id},{$set:{approve:'false'}})
    await userSchema.findOneAndUpdate({_id:data.user_id},{$set:{kyc_status:'Pending'}},{new:true})
  apiResponse.successResponseWithData(res, "Kyc Added Successfully",response);
  }else{
    const datas= new kycSchema({
      user_id:data.user_id,
      kyc_name:data.kyc_name,
      kyc_no:data.kyc_no,
      full_name:data.full_name,
      })
  const response=await datas.save()
  apiResponse.successResponseWithData(res, "Kyc Added Successfully",response);
  await userSchema.findOneAndUpdate({_id:data.user_id},{$set:{kyc_status:'Pending'}},{new:true})
  }
 }
  }catch(err){
      console.log(err)
      apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
