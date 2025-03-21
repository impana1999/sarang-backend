const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
  },
  other_id: {
    type: Schema.Types.ObjectId,
  },
  type: String,
  message: String,
  createdAt:{
    type : Number,
    default: Date.now()
},
updatedAt:{
    type : Number,
    default: Date.now()
},
},{timestamps:false})

    notificationSchema.pre('save', function (next) {
        const currentDate = Date.now();
        this.updatedAt = currentDate;
        if (!this.createdAt) {
            this.createdAt = currentDate;
        }
        next();
    });
    
module.exports=new mongoose.model('notification' ,notificationSchema)
 