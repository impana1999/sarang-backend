const apiResponse=require('../utils/ApiResponse')
const catchAsync=require('../utils/async')
const {generateAdminTokenPayload,generateUserTokenPayload,generateTokensObject } = require("../services/token.helper");
const userSchema=require('../models/usermaster')
const {sendmail}=require('../services/sms')
const preferenceSchema=require('../models/preference')
const kycSchema =require('../models/kyc')
const connectionSchema = require('../models/connection');
const visitorSchema = require('../models/visitors');
const processApi = require('../middleware/apitrack')
function genOTP(min, max) {
  var OTP = Math.floor(min + Math.random() * max)
  return OTP
}
//author Sarang

exports.login=catchAsync(async(req,res)=>{
  try{
  const data=req.body
  if(!data.mobile_number&&!data.email_id){
    apiResponse.ErrorResponse(res, "Please Provide All details");
  }else{
    if(data.mobile_number){
      const checkexists = await userSchema.findOne({mobile_number:data.mobile_number})
      if(checkexists){
        const results = await userSchema.findOne({mobile_number:data.mobile_number})
        const tokenPayload = generateUserTokenPayload(results);
        const tokens = generateTokensObject(tokenPayload);
    apiResponse.successResponseWithData(res, "Otp sent successfully",tokens);
    const apiname = 'login';
const resu = await processApi(apiname);
console.log("Processed API:", resu);
      }else{
      const userdata=new userSchema({
        mobile_number:data.mobile_number,
        fcm_token:data.fcm_token
      })
     const results= await userdata.save()
        const tokenPayload = generateUserTokenPayload(results);
        const tokens = generateTokensObject(tokenPayload);
    apiResponse.successResponseWithData(res, "Otp sent successfully",tokens);
    const apiname = 'login';
const resu = await processApi(apiname);
console.log("Processed API:", resu);
    }
    }else{
      const checkexists = await userSchema.findOne({email_id:data.email_id})
      if(checkexists){
        const otp=genOTP(100000,90000)
        const results = await userSchema.findOneAndUpdate({email_id:data.email_id},{$set:{otp:otp}},{new:true})
        const tokenPayload = generateUserTokenPayload(results);
        const tokens = generateTokensObject(tokenPayload);
        const email= await sendmail(data.email_id,otp)
        console.log(email)
        apiResponse.successResponseWithData(res, "Otp sent successfully",{otp,...tokens});
      }else{
      const otp=genOTP(100000,90000)
      const userdata=new userSchema({
        email_id:data.email_id,
        otp:otp,
        fcm_token:data.fcm_token
      })
     const results= await userdata.save()
        const tokenPayload = generateUserTokenPayload(results);
        const tokens = generateTokensObject(tokenPayload);
const email= await sendmail(data.email_id,otp)
console.log(email)
const apiname = 'login'; // Example API name
const resu = await processApi(apiname);
console.log("Processed API:", resu);
    apiResponse.successResponseWithData(res, "Otp sent successfully",{otp,...tokens});
    }
  }
  }
  }catch(err){
      console.log(err)
      apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.otpVerify=catchAsync(async(req,res)=>{
  try{
  const data=req.body
  if(!data.email_id&&!data.mobile_number){
    apiResponse.ErrorResponse(res, "Please Provide All details");
  }else{
    if(data.email_id){
      console.log(data.email_id)
      const results=await userSchema.findOne({email_id:data.email_id,profile:true,otp:data.otp})
      if(results){
        const response=await userSchema.findOne({email_id:data.email_id},{_id:1,profile:1})
        apiResponse.successResponseWithData(res, "Otp Verified Successfully!",response);
      }else{
        const resposnes=await userSchema.findOne({email_id:data.email_id,profile:false,otp:data.otp})
        if(resposnes)
        {
          const response=await userSchema.findOne({email_id:data.email_id},{_id:1,profile:1})
          apiResponse.successResponseWithData(res, "Otp Verified Successfully!",response);
        }else{
          apiResponse.ErrorResponse(res, "Invalid OTP");
        }
        
      }
    }else {
      console.log(data.mobile_number)
      const results=await userSchema.findOne({mobile_number:data.mobile_number,profile:true})
      if(results){
        console.log(results)
        const response=await userSchema.findOne({mobile_number:data.mobile_number},{_id:1,profile:1})
        apiResponse.successResponseWithData(res, "Otp Verified Successfully!",response);
      }else{
        console.log(data.mobile_number)
        const response=await userSchema.findOne({mobile_number:data.mobile_number},{_id:1,profile:1})
        console.log(response)
        apiResponse.successResponseWithData(res, "Otp Verified Successfully!",response);
      }
    }
  } 
  }catch(err){
      console.log(err)
      apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.createProfile = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    if (!data.profile_for || !data.first_name || !data.last_name || !data.gender) {
      return apiResponse.ErrorResponse(res, "Please Provide All details");
    } else {
      const randomNumber = Math.floor(Math.random() * 1000000)
      const profileID = `user${randomNumber}`;
      const updateData = {
        profile_for: data.profile_for,
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        religion: data.religion,
        community: data.community,
        mother_tongue: data.mother_tongue,
        email_id: data.email_id,
        mobile_number: data.mobile_number,
        country: data.country,
        DOB: data.DOB,
        living_in: {
          livin_state: data.living_in.livin_state,
          livin_city: data.living_in.livin_city,
          martial_status: data.living_in.martial_status,
          diet: data.living_in.diet,
          height: data.living_in.height,
          sub_community: data.living_in.sub_community,
        },
        educational: {
          highest_qualification: data.educational.highest_qualification,
          work_with: data.educational.work_with,
          as: data.educational.as,
          annual_income: data.educational.annual_income,
        },
        about_yourself: data.about_yourself,
        profile: true,
        profileID:profileID
      };

      if (data.family_profile) {
        updateData.family_profile = {
          father_name: data.family_profile.father_name,
          mother_name: data.family_profile.mother_name,
          father_status: data.family_profile.father_status,
          mother_status: data.family_profile.mother_status,
          no_brothers: data.family_profile.no_brothers,
          no_sisters: data.family_profile.no_sisters,
        };
      }

      const response = await userSchema.findOneAndUpdate(
        { _id: data._id },
        updateData,
        { new: true, upsert: true } // To return the updated document, and insert if not found
      );
const check=await preferenceSchema.findOneAndUpdate({ user_id:data._id},{$set:{gender: data.gender}})
console.log('user',check)
if(!check){
  const datas= new preferenceSchema({
    user_id:data._id,
    gender: data.gender,
    })
    datas.mother_tongue = undefined;
    await datas.save()
}
      return apiResponse.successResponseWithData(res, "Profile updated successfully", response);
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, "Something went wrong");
  }
});
exports.getProfile = catchAsync(async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return apiResponse.ErrorResponse(res, "Please provide all details");
    } else {
      const checkyc = await kycSchema.findOne({ user_id: user_id });
      const response = await userSchema.findOne({ _id: user_id });
      
      if (!checkyc) {
        return apiResponse.successResponseWithData(res, "Data fetched successfully", {
          response,
          kyc_status: 'KYC not applied'
        });
      } else {
        return apiResponse.successResponseWithData(res, "Data fetched successfully", {
          response,
          kyc_status: checkyc.approve
        });
      }
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
  }
});
exports.editProfile=catchAsync(async(req,res)=>{
  try{
  const data=req.body
  if(!data.user_id){
      apiResponse.ErrorResponse(res, "Please Provide All details");
  }else{
    const results=await userSchema.findOne({_id:data.user_id})
    if(results){
      if(data.living_in&&data.educational){
        const response=await userSchema.findOneAndUpdate({_id:data.user_id},{$set:{
          living_in:{
            livin_state:data.living_in.livin_state,
            livin_city:data.living_in.livin_city,
            martial_status:data.living_in.martial_status,
            diet:data.living_in.diet,
            sub_community:data.living_in.sub_community,
            pincode :data.living_in.pincode,
            grewupin:data.living_in.grewupin,
            Employername:data.living_in.Employername,
            residentialstatus:data.living_in.residentialstatus,
           height: results.living_in.height, 
          },
          country:data.living_in.country,
          educational:{
            highest_qualification:data.educational.highest_qualification,
            work_with:data.educational.work_with,
            as:data.educational.as,
            annual_income:data.educational.annual_income,
          }
        }},{new:true})
        apiResponse.successResponseWithData(res, "profile updated successfully",response);
      }else if(data.family_profile){
        const response=await userSchema.findOneAndUpdate({_id:data.user_id},{$set:{
          family_profile:{
            father_name:data.family_profile.father_name,
            mother_name:data.family_profile.mother_name,
            father_status:data.family_profile.father_status,
            mother_status:data.family_profile.mother_status,
            no_brothers:data.family_profile.no_brothers,
            no_sisters:data.family_profile.no_sisters,
            native_place:data.family_profile.native_place
          }
        }},{new:true})
        apiResponse.successResponseWithData(res, "profile updated successfully",response);
      }else if(data.religion){
        const response=await userSchema.findOneAndUpdate({_id:data.user_id},{$set:{
          religion:data.religion.religion,
          community:data.religion.community,
          mother_tongue:data.religion.mother_tongue,
        }},{new:true})
        apiResponse.successResponseWithData(res, "profile updated successfully",response);
      }else if(data.email_id){
        const response=await userSchema.findOneAndUpdate({_id:data.user_id},{$set:{
          email_id:data.email_id
        }},{new:true})
        apiResponse.successResponseWithData(res, "profile updated successfully",response);
    }else {
    const response=await userSchema.findOneAndUpdate({_id:data.user_id},{$set:{
      profile_for:data.profile_for,
      first_name:data.first_name,
      last_name:data.last_name,
      gender:data.gender,
      mobile_number:data.mobile_number,
      "living_in.height": data.height, 
      DOB:data.DOB,
      about_yourself:data.about_yourself,
    }},{new:true})
    apiResponse.successResponseWithData(res, "profile updated successfully",response);
  }
}else{
    apiResponse.successResponse(res, "No user Found");
  }
  }
  }catch(err){
      console.log(err)
      apiResponse.ErrorResponse(res, "Something went wrong");
    }
});
exports.addOrUpadtePimg = catchAsync(async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id ) {
      return apiResponse.ErrorResponse(res, "Please provide a user ID and image files");
    } else {
      const profile_img_names =  req.files.map(file => file.filename);

      const response = await userSchema.findOneAndUpdate(
        { _id: user_id },
        { $push: { profile_img: { $each: profile_img_names } } },
        { new: true }
      );
      console.log(response);
      return apiResponse.successResponseWithData(res, "Profile Added successfully", response);
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
  }
});
exports.deleteimg = catchAsync(async (req, res) => {
  try {
    const { user_id,profile_img_name } = req.body;
    if (!user_id ) {
      return apiResponse.ErrorResponse(res, "Please provide a user ID and image files");
    } else {
      const response = await userSchema.findOneAndUpdate(
        { _id: user_id },
        { $pull: { profile_img:profile_img_name  } },
        { new: true }
      );
      console.log(response);
      return apiResponse.successResponseWithData(res, "Profile Added successfully", response);
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
  }
});
exports.getOtherProfile = catchAsync(async (req, res) => {
  try {
    const { user_id, other_id } = req.body; 
    if (!user_id || !other_id) {
      return apiResponse.ErrorResponse(res, "Please provide both user IDs");
    } else {
      const userPreferences = await preferenceSchema.findOne({ user_id: user_id });
      const otherUserPreferences = await preferenceSchema.findOne({ user_id: other_id ,gender:{$ne:userPreferences.gender}});
      if (!userPreferences || !otherUserPreferences) {
        return apiResponse.ErrorResponse(res, 'User preferences not found for one or both users');
      }
      let matchingCount = 0;
      const matchingFieldsWithData = {};
      if (userPreferences.age_range === otherUserPreferences.age_range){ 
        matchingFieldsWithData['age_range'] = { value: userPreferences.age_range, matched: 'yes' };
        matchingCount++;
      }else{
        matchingFieldsWithData['age_range'] = { value: userPreferences.age_range, matched: 'no' };
      }
      if (userPreferences.height_range === otherUserPreferences.height_range){
        matchingCount++;
        matchingFieldsWithData['height_range'] = { value: userPreferences.height_range, matched: 'yes' }
      }else{
        matchingFieldsWithData['height_range'] = { value: userPreferences.height_range, matched: 'no' }
      }
      if (userPreferences.martial_status === otherUserPreferences.martial_status){
        matchingCount++;
        matchingFieldsWithData['martial_status'] = { value: userPreferences.martial_status, matched: 'yes' }
      } else{
        matchingFieldsWithData['martial_status'] = { value: userPreferences.martial_status, matched: 'no' }
      }
      if (userPreferences.religion === otherUserPreferences.religion){
        matchingCount++;
        matchingFieldsWithData['religion'] = { value: userPreferences.religion, matched: 'yes' }
      }else{
        matchingFieldsWithData['religion'] = { value: userPreferences.religion, matched: 'no' }
      }
      if (userPreferences.caste === otherUserPreferences.caste){
        matchingCount++;
        matchingFieldsWithData['caste'] = { value: userPreferences.caste, matched: 'yes' }
      }else{
        matchingFieldsWithData['caste'] = { value: userPreferences.caste, matched: 'no' }
      }
      if (userPreferences.mother_tongue && otherUserPreferences.mother_tongue) {
        const matchedLanguages = userPreferences.mother_tongue.filter(lang => otherUserPreferences.mother_tongue.includes(lang));
        if (matchedLanguages.length > 0){
          matchingCount++;
          matchingFieldsWithData['mother_tongue'] = { value: userPreferences.mother_tongue, matched: 'yes' }
        } 
      }else{
        matchingFieldsWithData['mother_tongue'] = { value: userPreferences.mother_tongue, matched: 'no' }
      }
      if (userPreferences.country === otherUserPreferences.country){
        matchingCount++;
        matchingFieldsWithData['country'] = { value: userPreferences.country, matched: 'yes' }
      }else{
        matchingFieldsWithData['country'] = { value: userPreferences.country, matched: 'no' }
      }
      if (userPreferences.employed_in === otherUserPreferences.employed_in){
        matchingCount++;
        matchingFieldsWithData['employed_in'] ={ value: userPreferences.employed_in, matched: 'yes' }
      }else{
        matchingFieldsWithData['employed_in'] = { value: userPreferences.employed_in, matched: 'no' }
      } 
      if (userPreferences.annual_income === otherUserPreferences.annual_income){
        matchingCount++;
        matchingFieldsWithData['annual_income'] = { value: userPreferences.annual_income, matched: 'yes' }
      }else{
        matchingFieldsWithData['annual_income'] = { value: userPreferences.annual_income, matched: 'no' }
      }
      let eatingHabitMatch = '';
      if (userPreferences.eating_habbits === otherUserPreferences.eating_habbits) {
        eatingHabitMatch = userPreferences.eating_habbits === 'Non-veg' ? 'You both enjoy Non-vegetarian food' : 'You both enjoy Vegetarian food';
        matchingCount++;
      }
      let cityMatch = '';
      if (userPreferences.city && otherUserPreferences.city && userPreferences.city === otherUserPreferences.city) {
        cityMatch = `You both live in ${userPreferences.city}`;
        matchingCount++;
      }
      let casteMatch = '';
      if (userPreferences.caste && otherUserPreferences.caste && userPreferences.caste === otherUserPreferences.caste) {
        const otherUser = await userSchema.findOne({_id: other_id });
        if (otherUser && otherUser.gender) {
          if (otherUser.gender == 'Male') {
            casteMatch = `He belongs to the ${userPreferences.caste} community too`;
            matchingCount++;
          } else if (otherUser.gender == 'Female') {
            casteMatch = `She belongs to the ${userPreferences.caste} community too`;
            matchingCount++;
          }
        }
      }
      const otherUser = await userSchema.findOne({_id: other_id });
      const check=await visitorSchema.findOne({ user_id:other_id,visiter_id:user_id})
      if(!check){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
        const datas= new visitorSchema({
        user_id:other_id,
        visiter_id:user_id
        })
        datas.mother_tongue = undefined;
        await datas.save()
      }
      const checkotherUser = await userSchema.findOne({_id: other_id });
      const checkUser = await userSchema.findOne({_id: other_id });
    if(checkotherUser.profile_img_setting.visible_to_all==true){
      if(checkotherUser.mobileNumber_visible.all==true || checkUser.premimun !=='Not A prime Member'){
        return apiResponse.successResponseWithData(res, "Data successfully retrieved", {
          preference: matchingFieldsWithData,
          other_user_data:otherUser,
          prefrencecount: `you match ${matchingCount}/12 of this preference` ,
          eating_habit_match: eatingHabitMatch,
          city_match: cityMatch,
          caste_match: casteMatch
        });
    }else if(checkotherUser.mobileNumber_visible.prime_members==true){
      otherUser.mobile_number =' ';
      return apiResponse.successResponseWithData(res, "Data successfully retrieved", {
        preference: matchingFieldsWithData,
        other_user_data:otherUser,
        prefrencecount: `you match ${matchingCount}/12 of this preference` ,
        eating_habit_match: eatingHabitMatch,
        city_match: cityMatch,
        caste_match: casteMatch
      });
    }
    }
    if(checkotherUser.profile_img_setting.visible_to_mem_i_like_all==true){
      if(checkotherUser.mobileNumber_visible.all==true){
        const existingConnections = await connectionSchema.find({
          from_user: other_id,
          status :  { $ne: "pending" }
      });
      const toUserIds = existingConnections.map(connection => connection.to_user);
      console.log(toUserIds);
      console.log(userPreferences.premimun)
      if (checkUser.premimun !== 'Not A prime Member' || toUserIds.includes(user_id)) {
        return apiResponse.successResponseWithData(res, "Data successfully retrieved", {
          preference: matchingFieldsWithData,
          other_user_data:otherUser,
          prefrencecount: `you match ${matchingCount}/12 of this preference` ,
          eating_habit_match: eatingHabitMatch,
          city_match: cityMatch,
          caste_match: casteMatch
        });
      }else{
        otherUser.profile_img = [];
        return apiResponse.successResponseWithData(res, "Data successfully retrieved", {
          preference: matchingFieldsWithData,
          other_user_data:otherUser,
          prefrencecount: `you match ${matchingCount}/12 of this preference` ,
          eating_habit_match: eatingHabitMatch,
          city_match: cityMatch,
          caste_match: casteMatch
        });
      }
    }else if(checkotherUser.mobileNumber_visible.prime_members==true){
      const existingConnections = await connectionSchema.find({
        from_user: other_id,
        status :  { $ne: "pending" }
    });
    const toUserIds = existingConnections.map(connection => connection.to_user);
    console.log(toUserIds);
    console.log(checkotherUser.profile_img_setting.visible_to_mem_i_like_all)
    if (checkUser.premimun != 'Not A prime Member' || toUserIds.includes(user_id)) {
      otherUser.mobile_number =' ';
      return apiResponse.successResponseWithData(res, "Data successfully retrieved", {
        preference: matchingFieldsWithData,
        other_user_data:otherUser ,
        prefrencecount: `you match ${matchingCount}/12 of this preference` ,
        eating_habit_match: eatingHabitMatch,
        city_match: cityMatch,
        caste_match: casteMatch
      });
    }else{
      otherUser.mobile_number =' ';
      otherUser.profile_img = [];
      return apiResponse.successResponseWithData(res, "Data successfully retrieved", {
        preference: matchingFieldsWithData,
        other_user_data:otherUser,
        prefrencecount: `you match ${matchingCount}/12 of this preference` ,
        eating_habit_match: eatingHabitMatch,
        city_match: cityMatch,
        caste_match: casteMatch
      });
    }
    }
    }
    if(checkotherUser.profile_img_setting.visible_to_mem_i_like==true){
      if(checkotherUser.mobileNumber_visible.all==true){
        const existingConnections = await connectionSchema.find({
          from_user: other_id,
          status :  { $ne: "pending" }
      });
      const toUserIds = existingConnections.map(connection => connection.to_user);
      console.log(toUserIds);
      if (toUserIds.includes(user_id)) {
        return apiResponse.successResponseWithData(res, "Data successfully retrieved", {
          preference: matchingFieldsWithData,
          other_user_data:otherUser ,
          prefrencecount: `you match ${matchingCount}/12 of this preference` ,
          eating_habit_match: eatingHabitMatch,
          city_match: cityMatch,
          caste_match: casteMatch
        });
      }else{
        otherUser.profile_img = [];
        return apiResponse.successResponseWithData(res, "Data successfully retrieved", {
          preference: otherUserPreferences,
          other_user_data:otherUser,
          prefrencecount: `you match ${matchingCount}/12 of this preference` ,
          eating_habit_match: eatingHabitMatch,
          city_match: cityMatch,
          caste_match: casteMatch
        });
      }
    }else if(checkotherUser.mobileNumber_visible.prime_members==true){
      const existingConnections = await connectionSchema.find({
        from_user: other_id,
        status :  { $ne: "pending" }
    });
    const toUserIds = existingConnections.map(connection => connection.to_user);
    console.log(toUserIds);
    if (toUserIds.includes(user_id)) {
      otherUser.mobile_number =' ';
      return apiResponse.successResponseWithData(res, "Data successfully retrieved", {
        preference: matchingFieldsWithData,
        other_user_data:otherUser ,
        prefrencecount: `you match ${matchingCount}/12 of this preference` ,
        eating_habit_match: eatingHabitMatch,
        city_match: cityMatch,
        caste_match: casteMatch
      });
    }else{
      otherUser.mobile_number =' ';
      otherUser.profile_img = [];
      return apiResponse.successResponseWithData(res, "Data successfully retrieved", {
        preference: matchingFieldsWithData,
        other_user_data:otherUser,
        prefrencecount: `you match ${matchingCount}/12 of this preference` ,
        eating_habit_match: eatingHabitMatch,
        city_match: cityMatch,
        caste_match: casteMatch
      });
    }
    }
  }
  }
  }catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
  }
});

