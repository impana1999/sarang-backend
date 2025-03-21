const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const socialMSchema = new Schema({
    
    instagram: {
        type: String,
        default: ''
    },
    facebook: {
        type: String,
        default: ''
    },
    youtube: {
        type: String,
        default: ''
    },
    linkedin: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: false });

socialMSchema.pre('save', function(next) {
    const now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now;
    next();
});

module.exports = mongoose.model('socialMedia', socialMSchema);
