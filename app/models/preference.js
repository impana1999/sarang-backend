const mongoose =  require ('mongoose')
const Schema = mongoose.Schema;

const preference = new Schema({
user_id:{
    type : mongoose.Types.ObjectId,
},
age_range:{
    type : String,
},
height_range:{
    type : String,
},
martial_status:{
    type : String,
},
phisycal_status:{
    type : String,
},
mother_tongue:{
    type:[" "]
},
eating_habbits:{
    type : String,
},
drinking_habbits:{
    type : String,
},
smoking_habbits:{
    type : String,
},
annual_income:{
    type : Number,
},
educational:{
    type : String,
},
employed_in:{
    type : String,
},
occupation:{
    type : String,
},
country:{
    type : String,
},
Ancenstrial_origin:{
    type : String,
},
looking_for:{
    type : String,
},
residential_address:{
    type : String,
},
residential_status:{
    type : String,
},
city:{
    type : String,
},
religion:{
    type : String,
},
caste:{
    type : String,
},
typAbout_partner:{
    type : String,
},
gender:{
    type : String,
},
premimun:{
    type : String
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

preference.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
    } else {
        this.updatedAt = Date.now();
    }
    next();
});
module.exports=new mongoose.model('preference' ,preference)
 