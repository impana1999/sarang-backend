
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const aboutSchema = new Schema({
    type: {
        type: String,
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    }
});
module.exports = mongoose.model('aboutUs', aboutSchema);
