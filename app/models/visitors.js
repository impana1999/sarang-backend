const mongoose =  require ('mongoose')
const Schema = mongoose.Schema;

const visitors = Schema({
user_id:{
    type : mongoose.Types.ObjectId,
  },
visiter_id:{
    type : mongoose.Types.ObjectId,
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

visitors.pre('save', function (next) {
  if (this.isNew) {
      this.createdAt = Date.now();
      this.updatedAt = Date.now();
  } else {
      this.updatedAt = Date.now();
  }
  next();
});
var visitor = new mongoose.model('visitors' ,visitors)
module.exports = visitor;