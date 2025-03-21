const apiResponse=require('../utils/ApiResponse')
const catchAsync=require('../utils/async')
const connectionSchema = require('../models/connection');
const SendNotification = require('../middleware/pushNotification');
const notificationSchema = require('../models/notification')
const userSchema=require('../models/usermaster')
const mongoose= require('mongoose')
exports.sendConnection = catchAsync(async (req, res) => {
    try {
        const data = req.body;
        if (!data.from_user || !data.to_users || data.to_users.length === 0) {
            return apiResponse.ErrorResponse(res, 'Please provide all the details including from_user and to_users array');
        } else {
            const fromUser = data.from_user;
            const toUsers = data.to_users;
            const existingConnections = await connectionSchema.find({
                from_user: fromUser,
                to_user: { $in: toUsers },
                status : "pending"
            });
            if (existingConnections.length > 0) {
                return apiResponse.ErrorResponse(res, 'One or more connections already exist');
            } else {
                const check = await userSchema.findOne({_id:fromUser})
                const tokenscheck=await userSchema.find({_id:{$in:toUsers}})
                const tokens = tokenscheck.map(doc=>doc.fcm_token)
                for (const token of tokens) {
                    const notificationData = [{
                        msg: `${check.first_name} sent you an invitation`,
                        ProfilePic: check.profile_img[0],
                        Type: 'Notification',
                        token: token
                    }];
                    const notification = SendNotification(notificationData);
                    const notifications = toUsers.map(toUser => ({
                        user_id: toUser,
                        other_id:fromUser ,
                        type: notificationData[0].Type,
                        message: notificationData[0].msg
                    }));
                    await notificationSchema.insertMany(notifications);
                }
                const connections = toUsers.map(toUser => ({ from_user: fromUser, to_user: toUser }));
                const response = await connectionSchema.insertMany(connections);
                return apiResponse.successResponseWithData(res, "Data successfully inserted", response);
            }
        }
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.acceptConnection = catchAsync(async (req, res) => {
    try {
        const data = req.body;
        if (!data.request_id ) {
            return apiResponse.ErrorResponse(res, 'Please provide all the details including from_user and to_users array');
        } else {
            const checkrequest = await connectionSchema.findOne({_id:data.request_id,status :'pending'});
            console.log(checkrequest)
            if(checkrequest){
              const response = await connectionSchema.findOneAndUpdate({_id:data.request_id,status :'pending'},{$set:{status:'Accepted'}});
              const check = await userSchema.findOne({_id:checkrequest.from_user})
                const tokenscheck=await userSchema.findOne({_id:checkrequest.to_user})
              let notificationData = [{
                    msg:`${check.first_name} accepted your request `, 
                    ProfilePic:check.profile_img[0],
                    Type: 'Notifcation',
                    token: tokenscheck.fcm_token
                   }];
                   console.log(check)
                   const notification = SendNotification(notificationData);
                   const notifications =new notificationSchema ({
                    user_id:checkrequest.from_user,
                    other_id:checkrequest.to_user,
                    type: notificationData[0].Type,
                    message: notificationData[0].msg
                });
                await notifications.save();
                return apiResponse.successResponseWithData(res, "request accepted successfully", response);
            }else{
                return apiResponse.ErrorResponse(res, 'connection request not found '); 
            }
        }
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
// exports.getNotification = catchAsync(async (req, res) => {
//     try {
//             const existingConnections = await notificationSchema.find({
//                 user_id:req.body.user_id,
//             });
//             if (existingConnections.length < 0) {
//                 return apiResponse.ErrorResponse(res, 'no notification found');
//             } else {
//                 return apiResponse.successResponseWithData(res, "Data fecthed successfully", {response:existingConnections});
//             }
//     } catch (err) {
//         console.log(err);
//         return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
//     }
// });
exports.cancelRequest = catchAsync(async (req, res) => {
    try {
        const data = req.body;
        if (!data.from_user||!data.to_user ) {
            return apiResponse.ErrorResponse(res, 'Please provide all the details including from_user and to_users');
        } else {
            const checkrequest = await connectionSchema.findOne({from_user:data.from_user,to_user:data.to_user,status :'pending'});
            console.log(checkrequest)
            if(checkrequest){
              const response = await connectionSchema.findOneAndDelete({from_user:data.from_user,to_user:data.to_user,status :'pending'},{new:true});
              const check = await userSchema.findOne({_id:checkrequest.from_user})
                const tokenscheck=await userSchema.findOne({_id:checkrequest.to_user})
                const notificationData = [{
                    msg: `${check.first_name} sent you an invitation`,
                    ProfilePic: check.profile_img[0],
                    Type: 'Notification',
                    token: tokenscheck.fcm_token
                }];
                   await notificationSchema.findOneAndDelete({
                    user_id:checkrequest.to_user,
                    other_id:checkrequest.from_user,
                    type: notificationData[0].Type,
                    message: notificationData[0].msg
                });
                return apiResponse.successResponseWithData(res, "request deleted successfully", response);
            }else{
                return apiResponse.ErrorResponse(res, 'connection request not found '); 
            }
        }
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.getRequests = catchAsync(async (req, res) => {
    try {
        const id=new mongoose.Types.ObjectId(req.body.user_id)
        const existingConnections = await connectionSchema.aggregate([
            {
                $match: {
                    to_user:id,
                    status: "pending"
                }
            },
            {
                $lookup: {
                    from: "usermasters", 
                    localField: "from_user", 
                    foreignField: "_id",
                    as: "userData"
                }
            },
            // {
            //     $unwind: "$userData" // unwind the array created by the lookup
            // },
            // {
            //     $project: {
            //         _id: "$userData._id",
            //         username: "$userData.username",
            //         email: "$userData.email",
            //         // add more fields as needed
            //     }
            // }
        ]);

        if (existingConnections.length === 0) {
            return apiResponse.ErrorResponse(res, 'No requests found');
        } else {
            return apiResponse.successResponseWithData(res, "Data fetched successfully", { response: existingConnections });
        }
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.sendRequests = catchAsync(async (req, res) => {
    try {
        const id=new mongoose.Types.ObjectId(req.body.user_id)
        const existingConnections = await connectionSchema.aggregate([
            {
                $match: {
                    from_user:id,
                    status: "pending"
                }
            },
            {
                $lookup: {
                    from: "usermasters", 
                    localField: "to_user", 
                    foreignField: "_id",
                    as: "userData"
                }
            },
            // {
            //     $unwind: "$userData" 
            // },
            // {
            //     $project: {
            //         _id: "$userData._id",
            //         username: "$userData.username",
            //         email: "$userData.email",
            //         // add more fields as needed
            //     }
            // }
        ]);

        if (existingConnections.length === 0) {
            return apiResponse.ErrorResponse(res, 'No requests found');
        } else {
            return apiResponse.successResponseWithData(res, "Data fetched successfully", { response: existingConnections });
        }
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.AcceptedRequests = catchAsync(async (req, res) => {
    try {
        const id=new mongoose.Types.ObjectId(req.body.user_id)
        const existingConnections = await connectionSchema.aggregate([
            {
                $match: {
                    to_user:id,
                    status: "Accepted"
                }
            },
            {
                $lookup: {
                    from: "usermasters", 
                    localField: "from_user", 
                    foreignField: "_id",
                    as: "userData"
                }
            },
            // {
            //     $unwind: "$userData" 
            // },
            // {
            //     $project: {
            //         _id: "$userData._id",
            //         username: "$userData.username",
            //         email: "$userData.email",
            //         // add more fields as needed
            //     }
            // }
        ]);

        if (existingConnections.length === 0) {
            return apiResponse.ErrorResponse(res, 'No requests found');
        } else {
            return apiResponse.successResponseWithData(res, "Data fetched successfully", { response: existingConnections });
        }
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
exports.getNotification = catchAsync(async (req, res) => {
    try {
        const existingConnections = await notificationSchema.find({
            user_id: req.body.user_id,
        });

        if (existingConnections.length === 0) {
            return apiResponse.ErrorResponse(res, 'No notifications found');
        } else {
            // Extracting unique other_id values
            const otherIds = [...new Set(existingConnections.map(connection => connection.other_id))];

            // Fetching firstname and profileimg for each other_id from usermaster
            const otherUsersDetails = await Promise.all(otherIds.map(async (otherId) => {
                const userDetails = await userSchema.findOne({ _id: otherId }, { first_name: 1, profile_img: 1 });
                return userDetails;
            }));

            // Merging notification details with other users' details
            const notificationsWithDetails = existingConnections.map(connection => {
                const otherUserDetails = otherUsersDetails.find(user => user._id.equals(connection.other_id));
                return {
                    ...connection.toObject(),
                    otherUserDetails: otherUserDetails
                };
            });

            return apiResponse.successResponseWithData(res, "Data fetched successfully", { response: notificationsWithDetails });
        }
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err.message || 'Something went wrong');
    }
});
