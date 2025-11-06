const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestimonialMasterSchema = new Schema({
    testimonialTitle: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Index for better query performance
TestimonialMasterSchema.index({ slug: 1 });
TestimonialMasterSchema.index({ isActive: 1 });

module.exports = mongoose.model('TestimonialMaster', TestimonialMasterSchema);
