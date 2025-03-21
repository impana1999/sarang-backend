const mongoose =  require ('mongoose')
const Schema = mongoose.Schema;

const kycschema = new Schema({
user_id:{
    type : mongoose.Types.ObjectId,
    default:' '
},
full_name:{
    type : String,
    default:' '
},
kyc_name:{
    type : String,
    default:' '
},
kyc_no:{
    type : Number,
    default:' '
},
approve:{
    type : String,
    default:'false'
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

kycschema.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
    } else {
        this.updatedAt = Date.now();
    }
    next();
});
module.exports=new mongoose.model('kycSchema' ,kycschema)
 