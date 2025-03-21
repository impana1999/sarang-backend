const mongoose =  require ('mongoose')
const Schema = mongoose.Schema;

const apiTrack = new Schema({
apiName:{
    type :String,
    default:' '
},
count:{
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

apiTrack.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
    } else {
        this.updatedAt = Date.now();
    }
    next();
});
module.exports=new mongoose.model('apistrack' ,apiTrack)
 