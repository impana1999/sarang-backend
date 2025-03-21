const mongoose =  require ('mongoose')
const Schema = mongoose.Schema;
const LivinSchema = new Schema({
    
    livin_state: {
        type: String, 
        trim : true,
    },
    livin_city: {
        type: String, 
        trim : true,
    },
    martial_status: {
        type: String, 
        trim : true,
    },
    diet: {
        type: String, 
        trim : true,
    },
    height: {
        type: String, 
    },
    sub_community: {
        type: String, 
        trim : true,
    },
    pincode :{
        type: String, 
        default:''
    },
    grewupin:{
        type: String, 
        default:''
    },
     Employername:{
        type: String,
        default:'' 
    }, 
    residentialstatus:{
        type: String, 
        default:''
    },
}, { _id: false });  

const educationSchema = new Schema({
    highest_qualification: {
        type: String, 
    },
    work_with: {
        type: String, 
    },
    as: {
        type: String, 
    },
    annual_income: {
        type: Number, 
    },
}, { _id: false });  

const familySchema = new Schema({
    father_name: {
        type: String, 
    },
    mother_name: {
        type: String, 
    },
    father_status: {
        type: String, 
    },
    mother_status: {
        type: String, 
    },
    no_brothers: {
        type: Number, 
    },
    no_sisters: {
        type: Number, 
    },
    native_place:{
        type: String,
        default:''
    }
}, { _id: false });    

const userSchema = new Schema({

email_id:{
    type : String,
    default:''
},
mobile_number:{
    type : String,
    default:''
},
country:{
    type : String,
    default:''
},
DOB:{
    type : String,
    default:''
},
profile_for:{
    type:String,
    default:''
},
first_name:{
    type : String,
    default:''
},
last_name:{
    type : String,
    default:''
},
gender:{
    type : String,
    default:''
},
religion:{
    type : String,
    default:''
},
community:{
    type : String,
    default:''
},
mother_tongue:{
    type : String,
    default:''
},
living_in:{
    type : LivinSchema
},
educational:{
    type : educationSchema
},
about_yourself:{
    type : String,
    default:''
},
family_profile:{
    type:familySchema
},
profile_img:{
    type:Array,
    default:[]
},
fcm_token:{
    type : String,
},
profile_img_setting:{
    visible_to_all:{
        type:Boolean,
        default:true
    },
    visible_to_mem_i_like_all:{
        type:Boolean,
        default:false
    },
    visible_to_mem_i_like:{
        type:Boolean,
        default:false
    },
},
mobileNumber_visible:{
    all:{
        type:Boolean,
        default:true
    },
    prime_members:{
        type:Boolean,
        default:false
    }
},
otp:{
    type:Number,
    default:0
},
adminBlock:{
    type:Boolean,
    default:false
},
profile:{
    type: String, 
    trim : true,
    default:false
},
premimun:{
    type:String,
    default:'Not A prime Member' 
},
profileID:{
    type:String,
},
kyc_status:{
    type:String,
    default:'Not Applied'
},
block_contact:{
    type:Array,
},
hideProfile:{
    type : Number,
    default:0
},
createdAt:{
    type : Number,
    default:0
},
updatedAt:{
    type : Number,
    default:0
},
},{timestamps:false})

userSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
    } else {
        this.updatedAt = Date.now();
    }
    next();
});
module.exports=new mongoose.model('usermaster' ,userSchema)
 