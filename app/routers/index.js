const express = require('express')
const route = express.Router();
//cotrollers
const adminController=require('../controllers/admin')
const regiController=require('../controllers/registration')
const kycController=require('../controllers/kyc')
const preferenceContrller=require('../controllers/preference')
const settingController=require('../controllers/settings')
const privacycontroller = require('../controllers/Aboutus')
const connetionController = require('../controllers/connection')
const Servicecontroller = require('../controllers/OurServices')
const {authMiddleware} = require('../services/verifyjwt')
const { upload, compress }=require('../middleware/upload');
const admin = require('../models/admin');
//routesregiController
//--admin route starts-- //
route.post ('/adminRegistration',adminController.adminRegistration)
route.post ('/adminLogin',adminController.adminLogin)
route.get ('/getAllUsers',authMiddleware,adminController.getAllUsers)
route.get ('/newusers',authMiddleware,adminController.newusers)
route.get ('/totalUsersCount',authMiddleware,adminController.totalUsersCount)
route.post('/addAlldropdown',authMiddleware,adminController.addAlldropdown)
route.post('/getAllDropdown',authMiddleware,adminController.getAllDropdown)
route.post('/adminBlock',authMiddleware,adminController.adminBlock)
route.post('/approve_kyc',authMiddleware,adminController.approve_kyc)
route.get('/getAprroved_kyc',authMiddleware,adminController.getAprroved_kyc)
route.get('/getReject_kyc',authMiddleware,adminController.getReject_kyc)
route.post('/add_plans',authMiddleware,adminController.add_plans)
route.get('/getAll_plans',authMiddleware,adminController.getAll_plans)
route.post('/edit_plans',authMiddleware,adminController.edit_plans)
route.post('/delete_plan',authMiddleware,adminController.delete_plan)

//--admin route ends--//

//--onboarding start--//
route.post('/createProfile',authMiddleware,regiController.createProfile)
route.post('/otpVerify',regiController.otpVerify)
route.post('/login',regiController.login)
route.post('/getProfile',authMiddleware,regiController.getProfile)
route.post('/editProfile',authMiddleware,regiController.editProfile)
route.post('/addOrUpadtePimg',authMiddleware,upload.array('attachment'),compress,regiController.addOrUpadtePimg)
route.post('/getOtherProfile',authMiddleware,regiController.getOtherProfile)
route.post('/deleteimg',authMiddleware,regiController.deleteimg)
//--onboarding ends --//

//--Kyc module start--//
route.post('/addKyc',authMiddleware,kycController.addKyc)
//--Kyc module ends--//
//--matches module starts--//
route.post('/addOrEditPreference',authMiddleware,preferenceContrller.addOrEditPreference)
route.post('/getMyMatches',authMiddleware,preferenceContrller.getMyMatches)
route.post('/getMypreference',authMiddleware,preferenceContrller.getMypreference)
route.post('/getMyNewMatches',authMiddleware,preferenceContrller.getMyNewMatches)
route.post('/recentVisitors',authMiddleware,preferenceContrller.recentVisitors)
route.post('/moreMemberVisitors',authMiddleware,preferenceContrller.moreMemberVisitors)
route.post('/getPremiumMatches',authMiddleware,preferenceContrller.getPremiumMatches)
//--matches module ends--//

//--setting module starts--//
route.post('/pofileImgSetting',authMiddleware,settingController.pofileImgSetting)
route.post('/get_plan',authMiddleware,settingController.get_planApp)
route.post('/upGradenow',authMiddleware,settingController.upGradenow)
route.post('/blockProfile',authMiddleware,settingController.blockProfile)
route.post('/unblockProfile',authMiddleware,settingController.unblockProfile)
route.post('/reportProfile',authMiddleware,settingController.reportProfile)
route.post('/contactPrivacy',authMiddleware,settingController.contactPrivacy)
route.delete('/deleteProfile',authMiddleware,settingController.deleteProfile)
route.post('/hideProfile',authMiddleware,settingController.hideProfile)
route.post('/createSocialMedia', settingController.createSocialMedia);
route.get('/getSocialMedia', settingController.getSocialMedia)
route.delete('/deleteSocialMedia', settingController.deleteSocialMedia)
route.post('/unHideProfile',authMiddleware,settingController.unHideProfile)
//--setting module ends--//

//--connection module starts--//
route.post('/sendConnection',authMiddleware,connetionController.sendConnection)
route.post('/acceptConnection',authMiddleware,connetionController.acceptConnection)
route.post('/getRequests',authMiddleware,connetionController.getRequests)
route.post('/getNotification',authMiddleware,connetionController.getNotification)
route.post('/cancelRequest',authMiddleware,connetionController.cancelRequest)
route.post('/sendRequests',authMiddleware,connetionController.sendRequests)
route.post('/AcceptedRequests',authMiddleware,connetionController.AcceptedRequests)
//--connections module ends---//

// ----about privacy ----//
route.post('/createAbout',authMiddleware,privacycontroller.createAbout);
route.post('/getAllAboutUs',authMiddleware,privacycontroller.getAllAboutUs);
route.post('/updateAbout',authMiddleware,privacycontroller.updateAbout);
route.delete('/deleteAbout',authMiddleware,privacycontroller.deleteAbout);
// ----about privacy ----//

//Catering-services --start//
route.post('/createService',authMiddleware,upload.array('attachment'), compress, Servicecontroller.createService);
route.post('/getAllServices',authMiddleware,Servicecontroller.getAllServices);
route.post('/updateServices',authMiddleware,upload.array('attachment'), compress, Servicecontroller.updateServices);
route.post('/deleteServices',authMiddleware,Servicecontroller.deleteServices);
//Catering-services --ends//


//mine//
route.get('/apistrack', authMiddleware,settingController.apistrack)
module.exports = route;