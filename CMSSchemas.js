/**
 * Comprehensive CMS Data Structures
 * General-purpose schemas that can be used across the entire website
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ============================================
// COMMON EMBEDDED SCHEMAS (Reusable Components)
// ============================================

/**
 * SEO Metadata - Can be embedded in any content type
 */
const SEOMetaSchema = new Schema({
  metaTitle: { type: String, maxlength: 60 },
  metaDescription: { type: String, maxlength: 160 },
  metaKeywords: [{ type: String }],
  ogTitle: { type: String },
  ogDescription: { type: String },
  ogImage: { type: String },
  canonicalUrl: { type: String },
  noIndex: { type: Boolean, default: false },
  noFollow: { type: Boolean, default: false }
}, { _id: false });

/**
 * Media Asset - For images, videos, documents
 */
const MediaAssetSchema = new Schema({
  url: { type: String, required: true },
  title: { type: String },
  altText: { type: String },
  caption: { type: String },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'audio', 'document', 'other'],
    required: true
  },
  mimeType: { type: String },
  fileSize: { type: Number }, // in bytes
  dimensions: {
    width: { type: Number },
    height: { type: Number }
  },
  thumbnail: { type: String }
}, { _id: false });

/**
 * Call to Action (CTA) - Reusable button/link component
 */
const CTASchema = new Schema({
  label: { type: String, required: true },
  url: { type: String },
  target: { type: String, enum: ['_self', '_blank'], default: '_self' },
  style: { type: String, enum: ['primary', 'secondary', 'outline', 'text'], default: 'primary' },
  icon: { type: String }
}, { _id: false });

/**
 * Content Block - Generic content section
 */
const ContentBlockSchema = new Schema({
  blockType: {
    type: String,
    enum: ['text', 'html', 'markdown', 'image', 'video', 'gallery', 'quote', 'code', 'custom'],
    required: true
  },
  title: { type: String },
  content: { type: String },
  media: MediaAssetSchema,
  gallery: [MediaAssetSchema],
  customData: { type: Schema.Types.Mixed },
  orderIndex: { type: Number, default: 0 }
}, { _id: false });

/**
 * Localization - Multi-language support
 */
const LocalizationSchema = new Schema({
  language: { type: String, required: true, default: 'en' },
  fields: { type: Schema.Types.Mixed } // Flexible object for any translated fields
}, { _id: false });

// ============================================
// MAIN CMS SCHEMAS
// ============================================

/**
 * 1. PAGE SCHEMA
 * For managing website pages
 */
const PageSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },

  // Content
  description: { type: String },
  content: { type: String }, // Main content (HTML/Markdown)
  contentBlocks: [ContentBlockSchema], // Flexible content sections
  excerpt: { type: String, maxlength: 300 },

  // Media
  featuredImage: MediaAssetSchema,

  // Organization
  pageType: {
    type: String,
    enum: ['home', 'about', 'service', 'product', 'blog', 'contact', 'custom'],
    default: 'custom'
  },
  template: { type: String, default: 'default' }, // Template to use for rendering
  parentPage: { type: Schema.Types.ObjectId, ref: 'Page' }, // For nested pages

  // SEO
  seo: SEOMetaSchema,

  // Publishing
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'archived'],
    default: 'draft'
  },
  publishedAt: { type: Date },
  scheduledAt: { type: Date },

  // Access Control
  isPublic: { type: Boolean, default: true },
  requiredRole: { type: String }, // Role needed to view (if not public)

  // Localization
  language: { type: String, default: 'en' },
  translations: [LocalizationSchema],

  // Metadata
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  viewCount: { type: Number, default: 0 },
  orderIndex: { type: Number, default: 0 }, // For sorting
  customFields: { type: Schema.Types.Mixed }, // Flexible additional data

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
PageSchema.index({ slug: 1, language: 1 });
PageSchema.index({ status: 1, isActive: 1 });
PageSchema.index({ pageType: 1 });

/**
 * 2. POST/ARTICLE SCHEMA
 * For blog posts, news, articles
 */
const PostSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },

  // Content
  content: { type: String, required: true },
  excerpt: { type: String, maxlength: 300 },
  contentBlocks: [ContentBlockSchema],

  // Media
  featuredImage: MediaAssetSchema,
  gallery: [MediaAssetSchema],

  // Categorization
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  tags: [{ type: String, trim: true }],

  // Author & Attribution
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coAuthors: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  // SEO
  seo: SEOMetaSchema,

  // Publishing
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'archived'],
    default: 'draft'
  },
  publishedAt: { type: Date },
  scheduledAt: { type: Date },

  // Engagement
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  shareCount: { type: Number, default: 0 },

  // Features
  isFeatured: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  allowComments: { type: Boolean, default: true },

  // Localization
  language: { type: String, default: 'en' },
  translations: [LocalizationSchema],

  // Related Content
  relatedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],

  customFields: { type: Schema.Types.Mixed },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

PostSchema.index({ slug: 1, language: 1 });
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ category: 1, status: 1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ author: 1 });

/**
 * 3. CATEGORY SCHEMA
 * For organizing content (posts, products, etc.)
 */
const CategorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String },

  // Hierarchy
  parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
  level: { type: Number, default: 0 },

  // Media
  image: MediaAssetSchema,
  icon: { type: String },

  // SEO
  seo: SEOMetaSchema,

  // Display
  color: { type: String }, // For UI theming
  orderIndex: { type: Number, default: 0 },

  // Content Type
  contentType: {
    type: String,
    enum: ['post', 'product', 'service', 'portfolio', 'generic'],
    default: 'generic'
  },

  // Stats
  itemCount: { type: Number, default: 0 },

  // Localization
  language: { type: String, default: 'en' },
  translations: [LocalizationSchema],

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

CategorySchema.index({ slug: 1, language: 1 });
CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ contentType: 1 });

/**
 * 4. MEDIA LIBRARY SCHEMA
 * For managing all media assets
 */
const MediaLibrarySchema = new Schema({
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  url: { type: String, required: true },

  // Media Details
  mediaType: {
    type: String,
    enum: ['image', 'video', 'audio', 'document', 'archive', 'other'],
    required: true
  },
  mimeType: { type: String, required: true },
  fileSize: { type: Number, required: true }, // in bytes

  // Image/Video specific
  dimensions: {
    width: { type: Number },
    height: { type: Number },
    aspectRatio: { type: String }
  },
  duration: { type: Number }, // for video/audio in seconds

  // Variants (for responsive images)
  variants: [{
    size: { type: String }, // 'thumbnail', 'small', 'medium', 'large'
    url: { type: String },
    width: { type: Number },
    height: { type: Number }
  }],

  // Metadata
  title: { type: String },
  altText: { type: String },
  caption: { type: String },
  description: { type: String },

  // Organization
  folder: { type: String, default: 'uncategorized' },
  tags: [{ type: String, trim: true }],

  // Storage
  storageProvider: {
    type: String,
    enum: ['local', 's3', 'cloudinary', 'gcs', 'azure'],
    default: 'local'
  },
  storagePath: { type: String },

  // Attribution
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  copyright: { type: String },
  license: { type: String },

  // Usage
  usageCount: { type: Number, default: 0 },
  usedIn: [{
    contentType: { type: String },
    contentId: { type: Schema.Types.ObjectId }
  }],

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

MediaLibrarySchema.index({ mediaType: 1, isActive: 1 });
MediaLibrarySchema.index({ folder: 1 });
MediaLibrarySchema.index({ tags: 1 });
MediaLibrarySchema.index({ uploadedBy: 1 });

/**
 * 5. NAVIGATION/MENU SCHEMA
 * For managing site navigation
 */
const NavigationSchema = new Schema({
  name: { type: String, required: true, trim: true },
  location: {
    type: String,
    enum: ['header', 'footer', 'sidebar', 'mobile', 'custom'],
    required: true
  },

  // Menu Items
  items: [{
    label: { type: String, required: true },
    url: { type: String },
    type: {
      type: String,
      enum: ['internal', 'external', 'page', 'post', 'category', 'custom'],
      default: 'custom'
    },
    target: { type: String, enum: ['_self', '_blank'], default: '_self' },

    // Reference to content
    pageRef: { type: Schema.Types.ObjectId, ref: 'Page' },
    postRef: { type: Schema.Types.ObjectId, ref: 'Post' },
    categoryRef: { type: Schema.Types.ObjectId, ref: 'Category' },

    // Icon & Badge
    icon: { type: String },
    badge: { type: String },

    // Hierarchy
    parentId: { type: String },
    orderIndex: { type: Number, default: 0 },

    // Access Control
    requiredRole: { type: String },
    isPublic: { type: Boolean, default: true },

    // Nested items
    children: { type: Schema.Types.Mixed }
  }],

  // Localization
  language: { type: String, default: 'en' },

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

NavigationSchema.index({ location: 1, language: 1, isActive: 1 });

/**
 * 6. SETTINGS/CONFIGURATION SCHEMA
 * For global site settings
 */
const SettingsSchema = new Schema({
  key: { type: String, required: true, unique: true, trim: true },
  value: { type: Schema.Types.Mixed, required: true },

  // Metadata
  label: { type: String },
  description: { type: String },

  // Data Type
  dataType: {
    type: String,
    enum: ['string', 'number', 'boolean', 'object', 'array', 'json'],
    default: 'string'
  },

  // Grouping
  group: {
    type: String,
    enum: ['general', 'seo', 'social', 'email', 'analytics', 'payment', 'shipping', 'custom'],
    default: 'general'
  },
  category: { type: String },

  // Validation
  isRequired: { type: Boolean, default: false },
  validationRules: { type: Schema.Types.Mixed },

  // Access
  isPublic: { type: Boolean, default: false }, // Can be exposed to frontend
  isEditable: { type: Boolean, default: true },

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

SettingsSchema.index({ key: 1 });
SettingsSchema.index({ group: 1, category: 1 });

/**
 * 7. FORM SCHEMA
 * For managing dynamic forms and submissions
 */
const FormSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String },

  // Form Fields
  fields: [{
    fieldId: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'email', 'tel', 'number', 'textarea', 'select', 'radio', 'checkbox', 'file', 'date', 'time'],
      required: true
    },
    placeholder: { type: String },
    defaultValue: { type: Schema.Types.Mixed },

    // Options for select/radio/checkbox
    options: [{
      label: { type: String },
      value: { type: String }
    }],

    // Validation
    isRequired: { type: Boolean, default: false },
    validationRules: { type: Schema.Types.Mixed },
    errorMessage: { type: String },

    // Display
    orderIndex: { type: Number, default: 0 },
    width: { type: String, enum: ['full', 'half', 'third', 'quarter'], default: 'full' },
    helpText: { type: String }
  }],

  // Submission Settings
  submitButtonText: { type: String, default: 'Submit' },
  successMessage: { type: String, default: 'Form submitted successfully!' },
  redirectUrl: { type: String },

  // Email Notifications
  sendEmailNotification: { type: Boolean, default: false },
  notificationEmail: { type: String },
  emailSubject: { type: String },
  autoReplyEmail: { type: Boolean, default: false },
  autoReplySubject: { type: String },
  autoReplyMessage: { type: String },

  // Integration
  webhookUrl: { type: String },
  integrations: { type: Schema.Types.Mixed },

  // Stats
  submissionCount: { type: Number, default: 0 },

  // Settings
  allowMultipleSubmissions: { type: Boolean, default: true },
  requireAuthentication: { type: Boolean, default: false },

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

FormSchema.index({ slug: 1 });

/**
 * 8. FORM SUBMISSION SCHEMA
 * For storing form submissions
 */
const FormSubmissionSchema = new Schema({
  formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
  formName: { type: String, required: true },

  // Submitted Data
  data: { type: Schema.Types.Mixed, required: true },

  // User Info
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  ipAddress: { type: String },
  userAgent: { type: String },

  // Status
  status: {
    type: String,
    enum: ['new', 'read', 'processed', 'archived', 'spam'],
    default: 'new'
  },

  // Notes
  notes: { type: String },

  // Files (if uploaded)
  files: [MediaAssetSchema],

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

FormSubmissionSchema.index({ formId: 1, status: 1 });
FormSubmissionSchema.index({ createdAt: -1 });

/**
 * 9. FAQ SCHEMA
 * For frequently asked questions
 */
const FAQSchema = new Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true },

  // Categorization
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  tags: [{ type: String, trim: true }],

  // Display
  orderIndex: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },

  // Stats
  viewCount: { type: Number, default: 0 },
  helpfulCount: { type: Number, default: 0 },
  notHelpfulCount: { type: Number, default: 0 },

  // Localization
  language: { type: String, default: 'en' },
  translations: [LocalizationSchema],

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

FAQSchema.index({ category: 1, isActive: 1 });
FAQSchema.index({ tags: 1 });

/**
 * 10. TESTIMONIAL/REVIEW SCHEMA
 * For customer testimonials and reviews
 */
const TestimonialSchema = new Schema({
  // Customer Info
  customerName: { type: String, required: true, trim: true },
  customerTitle: { type: String }, // Job title, role
  customerCompany: { type: String },
  customerPhoto: MediaAssetSchema,
  customerEmail: { type: String },

  // Review Content
  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String },
  content: { type: String, required: true },

  // Media
  images: [MediaAssetSchema],
  videoUrl: { type: String },

  // Verification
  isVerified: { type: Boolean, default: false },
  verificationMethod: { type: String },
  purchaseDate: { type: Date },

  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  // Display
  isFeatured: { type: Boolean, default: false },
  orderIndex: { type: Number, default: 0 },

  // Related Content
  productRef: { type: Schema.Types.ObjectId, ref: 'Product' },
  serviceRef: { type: Schema.Types.ObjectId, ref: 'Service' },

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

TestimonialSchema.index({ status: 1, rating: -1 });
TestimonialSchema.index({ isFeatured: 1, isActive: 1 });

/**
 * 11. SLIDER/CAROUSEL SCHEMA
 * For homepage sliders and carousels
 */
const SliderSchema = new Schema({
  name: { type: String, required: true, trim: true },
  location: {
    type: String,
    enum: ['homepage', 'about', 'services', 'products', 'custom'],
    default: 'homepage'
  },

  // Slides
  slides: [{
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },

    // Media
    image: MediaAssetSchema,
    videoUrl: { type: String },
    backgroundType: { type: String, enum: ['image', 'video', 'color'], default: 'image' },
    backgroundColor: { type: String },

    // CTA
    primaryCTA: CTASchema,
    secondaryCTA: CTASchema,

    // Display
    textPosition: {
      type: String,
      enum: ['left', 'center', 'right', 'top', 'bottom'],
      default: 'left'
    },
    textColor: { type: String, default: '#ffffff' },
    overlayOpacity: { type: Number, min: 0, max: 1, default: 0.3 },

    orderIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  }],

  // Slider Settings
  autoPlay: { type: Boolean, default: true },
  autoPlaySpeed: { type: Number, default: 5000 }, // milliseconds
  transitionSpeed: { type: Number, default: 500 },
  showArrows: { type: Boolean, default: true },
  showDots: { type: Boolean, default: true },
  loop: { type: Boolean, default: true },

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

SliderSchema.index({ location: 1, isActive: 1 });

/**
 * 12. NOTIFICATION SCHEMA
 * For system notifications and announcements
 */
const NotificationSchema = new Schema({
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'announcement'],
    default: 'info'
  },

  // Content
  title: { type: String, required: true },
  message: { type: String, required: true },
  icon: { type: String },

  // Targeting
  targetType: {
    type: String,
    enum: ['all', 'role', 'user', 'group'],
    default: 'all'
  },
  targetRoles: [{ type: String }],
  targetUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  // Action
  actionUrl: { type: String },
  actionLabel: { type: String },

  // Display
  displayLocation: {
    type: String,
    enum: ['toast', 'banner', 'modal', 'badge'],
    default: 'toast'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  // Scheduling
  publishAt: { type: Date },
  expiresAt: { type: Date },

  // Tracking
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  dismissedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

NotificationSchema.index({ targetType: 1, isActive: 1 });
NotificationSchema.index({ publishAt: 1, expiresAt: 1 });

// ============================================
// EXPORT ALL SCHEMAS
// ============================================

module.exports = {
  // Embedded Schemas (for reuse)
  SEOMetaSchema,
  MediaAssetSchema,
  CTASchema,
  ContentBlockSchema,
  LocalizationSchema,

  // Main Models
  Page: mongoose.model("Page", PageSchema),
  Post: mongoose.model("Post", PostSchema),
  Category: mongoose.model("Category", CategorySchema),
  MediaLibrary: mongoose.model("MediaLibrary", MediaLibrarySchema),
  Navigation: mongoose.model("Navigation", NavigationSchema),
  Settings: mongoose.model("Settings", SettingsSchema),
  Form: mongoose.model("Form", FormSchema),
  FormSubmission: mongoose.model("FormSubmission", FormSubmissionSchema),
  FAQ: mongoose.model("FAQ", FAQSchema),
  Testimonial: mongoose.model("Testimonial", TestimonialSchema),
  Slider: mongoose.model("Slider", SliderSchema),
  Notification: mongoose.model("Notification", NotificationSchema)
};
