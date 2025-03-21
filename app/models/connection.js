const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    from_user: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    to_user: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    createdAt: {
        type: Number,
        default: Date.now()
    },
    updatedAt: {
        type: Number,
        default: Date.now()
    }
});

connectionSchema.pre('save', function (next) {
    const currentDate = Date.now();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

module.exports = mongoose.model('Connection', connectionSchema);
