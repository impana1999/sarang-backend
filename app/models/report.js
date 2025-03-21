const mongoose =  require ('mongoose')
const Schema = mongoose.Schema;

const preference = new Schema({
report_id:{
    type : mongoose.Types.ObjectId,
},
reporter_id:{
    type : mongoose.Types.ObjectId,
},
discription:{
    type:String
},
type:{
    type:String
},
createdAt:{
    type : Number,
    default:Date.now()
},
updatedAt:{
    type : Number,
    default:Date.now()
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
module.exports=new mongoose.model('report' ,preference)
 