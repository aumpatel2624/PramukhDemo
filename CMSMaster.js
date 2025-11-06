const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CMSMasterSchema = new Schema({
    // Page Identification
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    pageType: {
        type: String,
        enum: ['home', 'about', 'services', 'products', 'contact', 'blog', 'custom'],
        default: 'custom'
    },

    // Headings
    heading1: {
        type: String,
        required: true,
        trim: true
    },
    heading2: {
        type: String,
        required: false,
        trim: true
    },
    heading3: {
        type: String,
        required: false,
        trim: true
    },

    // Descriptions
    description1: {
        type: String,
        required: false
    },
    description2: {
        type: String,
        required: false
    },
    description3: {
        type: String,
        required: false
    },

    // Content Points/Features
    points: {
        type: [
            {
                subHeading: {
                    type: String,
                    required: false,
                    trim: true
                },
                description: {
                    type: String,
                    required: false
                },
                icon: {
                    type: String,
                    required: false
                },
                image: {
                    type: String,
                    required: false
                },
                orderIndex: {
                    type: Number,
                    default: 0
                }
            }
        ],
        default: []
    },

    // Media
    image: {
        type: String,
        required: false
    },
    backgroundImage: {
        type: String,
        required: false
    },
    videoUrl: {
        type: String,
        required: false
    },
    gallery: {
        type: [String],
        default: []
    },

    // Call to Actions
    cta: {
        type: {
            buttonText: {
                type: String,
                required: false
            },
            buttonLink: {
                type: String,
                required: false
            },
            buttonStyle: {
                type: String,
                enum: ['primary', 'secondary', 'outline', 'text'],
                default: 'primary'
            },
            target: {
                type: String,
                enum: ['_self', '_blank'],
                default: '_self'
            }
        },
        required: false
    },

    secondaryCta: {
        type: {
            buttonText: {
                type: String,
                required: false
            },
            buttonLink: {
                type: String,
                required: false
            },
            buttonStyle: {
                type: String,
                enum: ['primary', 'secondary', 'outline', 'text'],
                default: 'secondary'
            },
            target: {
                type: String,
                enum: ['_self', '_blank'],
                default: '_self'
            }
        },
        required: false
    },

    // SEO
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

    // Organization
    category: {
        type: String,
        required: false
    },
    tags: {
        type: [String],
        default: []
    },
    orderIndex: {
        type: Number,
        default: 0
    },

    // Display Settings
    layout: {
        type: String,
        enum: ['default', 'full-width', 'sidebar-left', 'sidebar-right', 'two-column', 'three-column'],
        default: 'default'
    },
    backgroundColor: {
        type: String,
        required: false
    },
    textColor: {
        type: String,
        required: false
    },

    // Localization
    language: {
        type: String,
        default: 'en'
    },

    // Custom Fields (for flexibility)
    customData: {
        type: Schema.Types.Mixed,
        default: {}
    },

    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

// Indexes for better query performance
CMSMasterSchema.index({ slug: 1, language: 1 });
CMSMasterSchema.index({ pageType: 1, isActive: 1 });
CMSMasterSchema.index({ category: 1 });
CMSMasterSchema.index({ orderIndex: 1 });

module.exports = mongoose.model('CMSMaster', CMSMasterSchema);
