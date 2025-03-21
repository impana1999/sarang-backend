const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    type: {
        type: String,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image:{
        type:Array,
        default:[]  
    }
});

module.exports = mongoose.model('Service', serviceSchema);
