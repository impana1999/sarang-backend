const mongoose =  require ('mongoose')
const Schema = mongoose.Schema;

const planschema = new Schema({
plan_name:{
    type : String,
},
months:{
    type : String,
    default:' '
},
amount:{
    type : String,
    default:' '
},
discription:{
    type : Array
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

planschema.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
    } else {
        this.updatedAt = Date.now();
    }
    next();
});
module.exports=new mongoose.model('plans' ,planschema)
 