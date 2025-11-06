const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CMSMasterSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image1: {
        type: String,
        required: true
    },
    image2: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    // SEO Fields
    metaTitle: {
        type: String,
        required: false,
        maxlength: 60
    },
    metaDescription: {
        type: String,
        required: false,
        maxlength: 160
    },
    metaKeywords: {
        type: [String],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('CMSMaster', CMSMasterSchema);
