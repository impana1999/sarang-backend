const apiResponse=require('../utils/ApiResponse')
const catchAsync=require('../utils/async')
const preferenceSchema=require('../models/preference')
const visitorSchema = require('../models/visitors');
const usermaster = require('../models/usermaster');
const connectionSchema = require('../models/connection');
exports.addOrEditPreference=catchAsync(async(req,res)=>{
    try{
   const data=req.body
   if(!data.user_id ){
      apiResponse.ErrorResponse(res,'Please provide All the details');
   }else{
    const find=await preferenceSchema.findOne({user_id:data.user_id})
    if(find){
      let response
      if(data.type==='BasicInfo'){
         response=await preferenceSchema.findOneAndUpdate({user_id:data.user_id},{$set:{
          user_id:data.user_id,
          age_range:data.age_range,
          height_range:data.height_range,
          martial_status:data.martial_status,
          phisycal_status:data.phisycal_status,
          mother_tongue:data.mother_tongue,
          eating_habbits:data.eating_habbits,
          drinking_habbits:data.drinking_habbits,
          smoking_habbits:data.smoking_habbits,
          annual_income:data.annual_income
        }},{new:true})
      }
      if(data.type==='proffession'){
        response=await preferenceSchema.findOneAndUpdate({user_id:data.user_id},{$set:{
        educational:data.educational,
        employed_in:data.employed_in,
        occupation:data.occupation,
      }},{new:true})
      }
      if(data.type==='Location'){
        response=await preferenceSchema.findOneAndUpdate({user_id:data.user_id},{$set:{
        country:data.country,
        Ancenstrial_origin:data.Ancenstrial_origin,
        looking_for:data.looking_for,
        residential_address:data.residential_address,
        residential_status:data.residential_status,
        city:data.city,
      }},{new:true})
      }
      if(data.type==='religious'){
        response=await preferenceSchema.findOneAndUpdate({user_id:data.user_id},{$set:{
        religion:data.religion,
        caste:data.caste,
        typAbout_partner:data.typAbout_partner,
      }},{new:true})
      }
      
    apiResponse.successResponseWithData(res, "preference updated Successfully",response);
    }
   }
}catch(err){
        console.log(err)
        apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
}
});
exports.getMypreference=catchAsync(async(req,res)=>{
  try{
 const data=req.body
 if(!data.user_id ){
    apiResponse.ErrorResponse(res,'Please provide All the details');
 }else{
  const find=await preferenceSchema.findOne({user_id:data.user_id})
  if(find){
    const response=await preferenceSchema.findOne({user_id:data.user_id})
  apiResponse.successResponseWithData(res, "data Successfully",response);
  }
 }
}catch(err){
      console.log(err)
      apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
}
});
exports.getMyNewMatches = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    if (!data.user_id) {
      return apiResponse.ErrorResponse(res, 'Please provide the user_id');
    } else {
      const userPreferences = await preferenceSchema.findOne({ user_id: data.user_id });
      
      if (!userPreferences) {
        return apiResponse.ErrorResponse(res, 'User preferences not found');
      }

      const currentDate = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(currentDate.getDate() - 7);

      const query = {
        user_id: { $ne: data.user_id },
        createdAt: { $gte: oneWeekAgo, $lte: currentDate },
        gender:{$ne:userPreferences.gender},
        hideProfile:{$eq:0},
        $or: []
      };

      if (userPreferences.age_range) {
        query.$or.push({ age_range: userPreferences.age_range });
      }
      if (userPreferences.height_range) {
        query.$or.push({ height_range: userPreferences.height_range });
      }
      if (userPreferences.martial_status) {
        query.$or.push({ martial_status: userPreferences.martial_status });
      }
      if (userPreferences.religion) {
        query.$or.push({ religion: userPreferences.religion });
      }
      if (userPreferences.caste) {
        query.$or.push({ caste: userPreferences.caste });
      }
      if (userPreferences.mother_tongue && userPreferences.mother_tongue.length > 0) {
        query.$or.push({ mother_tongue: { $in: userPreferences.mother_tongue } });
      }
      if (userPreferences.country) {
        query.$or.push({ country: userPreferences.country });
      }
      if (userPreferences.employed_in) {
        query.$or.push({ employed_in: userPreferences.employed_in });
      }
      if (userPreferences.annual_income) {
        query.$or.push({ annual_income: userPreferences.annual_income });
      }

      if (query.$or.length === 0) {
        return apiResponse.ErrorResponse(res, 'No valid preferences found');
      }

      const matchingData = await preferenceSchema.find(query);

      const matchingIds = matchingData.map(matching => matching.user_id);

      const blockedUserData = await usermaster.findOne({ _id: data.user_id });
      const blockedContactIds = blockedUserData.block_contact.map(contact => contact);

      const filteredMatchingIds = matchingIds.filter(id => !blockedContactIds.some(blockedId => blockedId.equals(id)));

//console.log('ids',filteredMatchingIds);

      const matchingDatas = await usermaster.find({ _id: { $in: filteredMatchingIds },premimun:{$eq:'Not A prime Member'} }); 
   const connectiondata = await connectionSchema.find({
    $or: [
      {
        $and: [
          { from_user: data.user_id },
          { to_user: { $in: filteredMatchingIds } }
        ]
      },
      {
        $and: [
          { from_user: { $in: filteredMatchingIds } },
          { to_user: data.user_id }
        ]
      }
    ]
  })
  const matchingDatasWithStatus = matchingDatas.map(matching => {
    const connection = connectiondata.find(conn => {
        return (conn.from_user.equals(data.user_id) && conn.to_user.equals(matching._id)) ||
               (conn.from_user.equals(matching._id) && conn.to_user.equals(data.user_id));
    });
    
    const connectionStatus = connection ? connection.status : null;
    
    const matchingObject = matching.toObject();
    
    return {
        ...matchingObject,
        connectionStatus: connectionStatus
    };
});

//console.log(matchingDatasWithStatus);
      return apiResponse.successResponseWithData(res, "Data successfully retrieved", 
      {matchingDatas:matchingDatasWithStatus,
        totalData:matchingDatas.length});
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
  }
});
exports.getPremiumMatches = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    if (!data.user_id) {
      return apiResponse.ErrorResponse(res, 'Please provide the user_id');
    } else {
      const userPreferences = await preferenceSchema.findOne({ user_id: data.user_id });
      
      if (!userPreferences) {
        return apiResponse.ErrorResponse(res, 'User preferences not found');
      }

      const query = {
        user_id: { $ne: data.user_id },
        gender:{$ne:userPreferences.gender},
        $or: [],
        hideProfile:{$eq:0},
      };

      if (userPreferences.age_range) {
        query.$or.push({ age_range: userPreferences.age_range });
      }
      if (userPreferences.height_range) {
        query.$or.push({ height_range: userPreferences.height_range });
      }
      if (userPreferences.martial_status) {
        query.$or.push({ martial_status: userPreferences.martial_status });
      }
      if (userPreferences.religion) {
        query.$or.push({ religion: userPreferences.religion });
      }
      if (userPreferences.caste) {
        query.$or.push({ caste: userPreferences.caste });
      }
      if (userPreferences.mother_tongue && userPreferences.mother_tongue.length > 0) {
        query.$or.push({ mother_tongue: { $in: userPreferences.mother_tongue } });
      }
      if (userPreferences.country) {
        query.$or.push({ country: userPreferences.country });
      }
      if (userPreferences.employed_in) {
        query.$or.push({ employed_in: userPreferences.employed_in });
      }
      if (userPreferences.annual_income) {
        query.$or.push({ annual_income: userPreferences.annual_income });
      }
      query.$or.push({ premimun: { $exists: false } }); 
      if (query.$or.length === 0) {
        return apiResponse.ErrorResponse(res, 'No valid preferences found');
      }
      const matchingData = await preferenceSchema.find(query);
      // console.log(matchingData)

      const matchingIds = matchingData.map(matching => matching.user_id);
      // console.log(matchingIds)
      const blockedUserData = await usermaster.findOne({ _id: data.user_id });
      let filteredMatchingIds = [];

      if (blockedUserData) {
          const blockedContactIds = blockedUserData.block_contact ? blockedUserData.block_contact.map(contact => contact) : [];
          //console.log(blockedContactIds);
          filteredMatchingIds = matchingIds.filter(id => !blockedContactIds.some(blockedId => blockedId.equals(id)));
      }
      
// console.log(filteredMatchingIds);

      const matchingDatas = await usermaster.find({ _id: { $in: filteredMatchingIds },premimun:{$ne:'Not A prime Member'}});
      const connectiondata = await connectionSchema.find({
        $or: [
          {
            $and: [
              { from_user: data.user_id },
              { to_user: { $in: filteredMatchingIds } }
            ]
          },
          {
            $and: [
              { from_user: { $in: filteredMatchingIds } },
              { to_user: data.user_id }
            ]
          }
        ]
      })
      const matchingDatasWithStatus = matchingDatas.map(matching => {
        const connection = connectiondata.find(conn => {
            return (conn.from_user.equals(data.user_id) && conn.to_user.equals(matching._id)) ||
                   (conn.from_user.equals(matching._id) && conn.to_user.equals(data.user_id));
        });
        const connectionStatus = connection ? connection.status : null;
        
        const matchingObject = matching.toObject();
        
        return {
            ...matchingObject,
            connectionStatus: connectionStatus
        };
    });
    // console.log(matchingDatasWithStatus);
      return apiResponse.successResponseWithData(res, "Data successfully retrieved", {matchingDatas:matchingDatasWithStatus,
        totalData:matchingDatas.length});
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
  }
});
exports.recentVisitors = catchAsync(async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return apiResponse.ErrorResponse(res, 'Please provide the user_id');
    } else {
      const currentDate = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(currentDate.getDate() - 7);
      const visitors = await visitorSchema.find({ user_id: user_id, createdAt: { $gte: oneWeekAgo, $lte: currentDate },});
      const visitorIds = visitors.map(visitor => visitor.visiter_id);
      // console.log(visitorIds)
      const blockedUserData = await usermaster.findOne({ _id:user_id });
      const blockedContactIds = blockedUserData.block_contact.map(contact => contact);
      // console.log(blockedContactIds);
      const filteredMatchingIds = visitorIds.filter(id => !blockedContactIds.some(blockedId => blockedId.equals(id)));

// console.log(filteredMatchingIds);
      const gendercheck=await usermaster.findOne({_id:user_id})
      const visitorData = await usermaster.find({ _id: { $in: filteredMatchingIds },gender:{$ne:gendercheck.gender} }); 
      const connectiondata = await connectionSchema.find({
        $or: [
          {
            $and: [
              { from_user: user_id },
              { to_user: { $in: filteredMatchingIds } }
            ]
          },
          {
            $and: [
              { from_user: { $in: filteredMatchingIds } },
              { to_user: user_id }
            ]
          }
        ]
      })
      const matchingDatasWithStatus = visitorData.map(matching => {
        const connection = connectiondata.find(conn => {
            return (conn.from_user.equals(user_id) && conn.to_user.equals(matching._id)) ||
                   (conn.from_user.equals(matching._id) && conn.to_user.equals(user_id));
        });
        const connectionStatus = connection ? connection.status : null;
        
        const matchingObject = matching.toObject(); 
        
        return {
            ...matchingObject,
            connectionStatus: connectionStatus
        };
    });
    // console.log(matchingDatasWithStatus);
      return apiResponse.successResponseWithData(res, "Data successfully retrieved", {visitorData:matchingDatasWithStatus,totalvisittors:visitorData.length});
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
  }
});
exports.moreMemberVisitors = catchAsync(async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return apiResponse.ErrorResponse(res, 'Please provide the user_id');
    } else {
      const visitors = await visitorSchema.find({ user_id: user_id});
      const visitorIds = visitors.map(visitor => visitor.visiter_id);
      // console.log(visitorIds)
      const blockedUserData = await usermaster.findOne({ _id:user_id });
      const blockedContactIds = blockedUserData.block_contact.map(contact => contact);
      // console.log(blockedContactIds);
      const filteredMatchingIds = visitorIds.filter(id => !blockedContactIds.some(blockedId => blockedId.equals(id)));

// console.log(filteredMatchingIds);
      const gendercheck=await usermaster.findOne({_id:user_id})
      const visitorData = await usermaster.find({ _id: { $in: filteredMatchingIds },gender:{$ne:gendercheck.gender} });
      const connectiondata = await connectionSchema.find({
        $or: [
          {
            $and: [
              { from_user: user_id },
              { to_user: { $in: filteredMatchingIds } }
            ]
          },
          {
            $and: [
              { from_user: { $in: filteredMatchingIds } },
              { to_user: user_id }
            ]
          }
        ]
      })
      const matchingDatasWithStatus = visitorData.map(matching => {
        const connection = connectiondata.find(conn => {
            return (conn.from_user.equals(user_id) && conn.to_user.equals(matching._id)) ||
                   (conn.from_user.equals(matching._id) && conn.to_user.equals(user_id));
        });
        const connectionStatus = connection ? connection.status : null;
        
        const matchingObject = matching.toObject(); 
        
        return {
            ...matchingObject,
            connectionStatus: connectionStatus
        };
    });
    // console.log(matchingDatasWithStatus); 
      return apiResponse.successResponseWithData(res, "Data successfully retrieved", {visitorData:matchingDatasWithStatus,totalvisittors:visitorData.length});
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
  }
});
exports.getMyMatches = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    if (!data.user_id) {
      return apiResponse.ErrorResponse(res, 'Please provide the user_id');
    } else {
      const userPreferences = await preferenceSchema.findOne({ user_id: data.user_id });
      if (!userPreferences) {
        return apiResponse.ErrorResponse(res, 'User preferences not found');
      }
      const currentDate = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(currentDate.getDate() - 7);

      const query = {
        user_id: { $ne: data.user_id },
        gender:{$ne:userPreferences.gender},
        //createdAt: { $lte: oneWeekAgo},
        hideProfile:{$eq:0},
        $or: []
      };
      if (userPreferences.age_range) {
        query.$or.push({ age_range: userPreferences.age_range });
      }
      if (userPreferences.height_range) {
        query.$or.push({ height_range: userPreferences.height_range });
      }
      if (userPreferences.martial_status) {
        query.$or.push({ martial_status: userPreferences.martial_status });
      }
      if (userPreferences.religion) {
        query.$or.push({ religion: userPreferences.religion });
      }
      if (userPreferences.caste) {
        query.$or.push({ caste: userPreferences.caste });
      }
      if (userPreferences.mother_tongue && userPreferences.mother_tongue.length > 0) {
        query.$or.push({ mother_tongue: { $in: userPreferences.mother_tongue } });
      }
      if (userPreferences.country) {
        query.$or.push({ country: userPreferences.country });
      }
      if (userPreferences.employed_in) {
        query.$or.push({ employed_in: userPreferences.employed_in });
      }
      if (userPreferences.annual_income) {
        query.$or.push({ annual_income: userPreferences.annual_income });
      }
      if (query.$or.length === 0) {
        return apiResponse.ErrorResponse(res, 'No valid preferences found');
      }

      const matchingData = await preferenceSchema.find(query);

      const matchingIds = matchingData.map(matching => matching.user_id);
      const blockedUserData = await usermaster.findOne({ _id: data.user_id });
      const blockedContactIds = blockedUserData.block_contact.map(contact => contact);
      const filteredMatchingIds = matchingIds.filter(id => !blockedContactIds.some(blockedId => blockedId.equals(id)));
//console.log('ids',filteredMatchingIds);
      const matchingDatas = await usermaster.find({ 
        _id: { $in: filteredMatchingIds },
        premimun:{$eq:'Not A prime Member'}
    });
   const connectiondata = await connectionSchema.find({
    $or: [
      {
        $and: [
          { from_user: data.user_id },
          { to_user: { $in: filteredMatchingIds } }
        ]
      },
      {
        $and: [
          { from_user: { $in: filteredMatchingIds } },
          { to_user: data.user_id }
        ]
      }
    ]
  })
  const matchingDatasWithStatus = matchingDatas.map(matching => {
    const connection = connectiondata.find(conn => {
        return (conn.from_user.equals(data.user_id) && conn.to_user.equals(matching._id)) ||
               (conn.from_user.equals(matching._id) && conn.to_user.equals(data.user_id));
    });
    
    const connectionStatus = connection ? connection.status : null;
    
    const matchingObject = matching.toObject();
    
    return {
        ...matchingObject,
        connectionStatus: connectionStatus
    };
});

//console.log(matchingDatasWithStatus);
      return apiResponse.successResponseWithData(res, "Data successfully retrieved", {matchingDatas:matchingDatasWithStatus,
        totalData:matchingDatas.length});
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
  }
});




