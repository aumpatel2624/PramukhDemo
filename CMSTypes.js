/**
 * CMS Type Definitions for Frontend
 * JavaScript/TypeScript interfaces matching the backend schemas
 * Use these types in your React components
 */

// ============================================
// COMMON EMBEDDED TYPES
// ============================================

/**
 * @typedef {Object} SEOMeta
 * @property {string} [metaTitle] - Max 60 characters
 * @property {string} [metaDescription] - Max 160 characters
 * @property {string[]} [metaKeywords]
 * @property {string} [ogTitle]
 * @property {string} [ogDescription]
 * @property {string} [ogImage]
 * @property {string} [canonicalUrl]
 * @property {boolean} [noIndex]
 * @property {boolean} [noFollow]
 */

/**
 * @typedef {Object} MediaAsset
 * @property {string} url - Required
 * @property {string} [title]
 * @property {string} [altText]
 * @property {string} [caption]
 * @property {'image'|'video'|'audio'|'document'|'other'} mediaType - Required
 * @property {string} [mimeType]
 * @property {number} [fileSize] - In bytes
 * @property {Object} [dimensions]
 * @property {number} [dimensions.width]
 * @property {number} [dimensions.height]
 * @property {string} [thumbnail]
 */

/**
 * @typedef {Object} CTA
 * @property {string} label - Required
 * @property {string} [url]
 * @property {'_self'|'_blank'} [target]
 * @property {'primary'|'secondary'|'outline'|'text'} [style]
 * @property {string} [icon]
 */

/**
 * @typedef {Object} ContentBlock
 * @property {'text'|'html'|'markdown'|'image'|'video'|'gallery'|'quote'|'code'|'custom'} blockType - Required
 * @property {string} [title]
 * @property {string} [content]
 * @property {MediaAsset} [media]
 * @property {MediaAsset[]} [gallery]
 * @property {any} [customData]
 * @property {number} [orderIndex]
 */

/**
 * @typedef {Object} Localization
 * @property {string} language - Required, default 'en'
 * @property {Object} fields - Flexible object for translated fields
 */

// ============================================
// MAIN CMS TYPES
// ============================================

/**
 * @typedef {Object} Page
 * @property {string} _id
 * @property {string} title - Required
 * @property {string} slug - Required, unique
 * @property {string} [description]
 * @property {string} [content] - Main content HTML/Markdown
 * @property {ContentBlock[]} [contentBlocks]
 * @property {string} [excerpt] - Max 300 characters
 * @property {MediaAsset} [featuredImage]
 * @property {'home'|'about'|'service'|'product'|'blog'|'contact'|'custom'} [pageType]
 * @property {string} [template]
 * @property {string} [parentPage] - Reference to parent Page._id
 * @property {SEOMeta} [seo]
 * @property {'draft'|'published'|'scheduled'|'archived'} [status]
 * @property {Date} [publishedAt]
 * @property {Date} [scheduledAt]
 * @property {boolean} [isPublic]
 * @property {string} [requiredRole]
 * @property {string} [language]
 * @property {Localization[]} [translations]
 * @property {string} [author] - Reference to User._id
 * @property {number} [viewCount]
 * @property {number} [orderIndex]
 * @property {any} [customFields]
 * @property {boolean} [isActive]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Post
 * @property {string} _id
 * @property {string} title - Required
 * @property {string} slug - Required, unique
 * @property {string} content - Required
 * @property {string} [excerpt] - Max 300 characters
 * @property {ContentBlock[]} [contentBlocks]
 * @property {MediaAsset} [featuredImage]
 * @property {MediaAsset[]} [gallery]
 * @property {string} category - Required, reference to Category._id
 * @property {string[]} [tags]
 * @property {string} author - Required, reference to User._id
 * @property {string[]} [coAuthors] - References to User._id
 * @property {SEOMeta} [seo]
 * @property {'draft'|'published'|'scheduled'|'archived'} [status]
 * @property {Date} [publishedAt]
 * @property {Date} [scheduledAt]
 * @property {number} [viewCount]
 * @property {number} [likeCount]
 * @property {number} [commentCount]
 * @property {number} [shareCount]
 * @property {boolean} [isFeatured]
 * @property {boolean} [isPinned]
 * @property {boolean} [allowComments]
 * @property {string} [language]
 * @property {Localization[]} [translations]
 * @property {string[]} [relatedPosts] - References to Post._id
 * @property {any} [customFields]
 * @property {boolean} [isActive]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Category
 * @property {string} _id
 * @property {string} name - Required
 * @property {string} slug - Required, unique
 * @property {string} [description]
 * @property {string} [parentCategory] - Reference to Category._id
 * @property {number} [level]
 * @property {MediaAsset} [image]
 * @property {string} [icon]
 * @property {SEOMeta} [seo]
 * @property {string} [color]
 * @property {number} [orderIndex]
 * @property {'post'|'product'|'service'|'portfolio'|'generic'} [contentType]
 * @property {number} [itemCount]
 * @property {string} [language]
 * @property {Localization[]} [translations]
 * @property {boolean} [isActive]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} MediaLibrary
 * @property {string} _id
 * @property {string} fileName - Required
 * @property {string} originalName - Required
 * @property {string} url - Required
 * @property {'image'|'video'|'audio'|'document'|'archive'|'other'} mediaType - Required
 * @property {string} mimeType - Required
 * @property {number} fileSize - Required, in bytes
 * @property {Object} [dimensions]
 * @property {number} [dimensions.width]
 * @property {number} [dimensions.height]
 * @property {string} [dimensions.aspectRatio]
 * @property {number} [duration] - For video/audio in seconds
 * @property {Object[]} [variants]
 * @property {string} [variants[].size]
 * @property {string} [variants[].url]
 * @property {number} [variants[].width]
 * @property {number} [variants[].height]
 * @property {string} [title]
 * @property {string} [altText]
 * @property {string} [caption]
 * @property {string} [description]
 * @property {string} [folder]
 * @property {string[]} [tags]
 * @property {'local'|'s3'|'cloudinary'|'gcs'|'azure'} [storageProvider]
 * @property {string} [storagePath]
 * @property {string} [uploadedBy] - Reference to User._id
 * @property {string} [copyright]
 * @property {string} [license]
 * @property {number} [usageCount]
 * @property {Object[]} [usedIn]
 * @property {string} [usedIn[].contentType]
 * @property {string} [usedIn[].contentId]
 * @property {boolean} [isActive]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} NavigationItem
 * @property {string} label - Required
 * @property {string} [url]
 * @property {'internal'|'external'|'page'|'post'|'category'|'custom'} [type]
 * @property {'_self'|'_blank'} [target]
 * @property {string} [pageRef] - Reference to Page._id
 * @property {string} [postRef] - Reference to Post._id
 * @property {string} [categoryRef] - Reference to Category._id
 * @property {string} [icon]
 * @property {string} [badge]
 * @property {string} [parentId]
 * @property {number} [orderIndex]
 * @property {string} [requiredRole]
 * @property {boolean} [isPublic]
 * @property {any} [children]
 */

/**
 * @typedef {Object} Navigation
 * @property {string} _id
 * @property {string} name - Required
 * @property {'header'|'footer'|'sidebar'|'mobile'|'custom'} location - Required
 * @property {NavigationItem[]} items
 * @property {string} [language]
 * @property {boolean} [isActive]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Settings
 * @property {string} _id
 * @property {string} key - Required, unique
 * @property {any} value - Required
 * @property {string} [label]
 * @property {string} [description]
 * @property {'string'|'number'|'boolean'|'object'|'array'|'json'} [dataType]
 * @property {'general'|'seo'|'social'|'email'|'analytics'|'payment'|'shipping'|'custom'} [group]
 * @property {string} [category]
 * @property {boolean} [isRequired]
 * @property {any} [validationRules]
 * @property {boolean} [isPublic]
 * @property {boolean} [isEditable]
 * @property {boolean} [isActive]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} FormField
 * @property {string} fieldId - Required
 * @property {string} label - Required
 * @property {'text'|'email'|'tel'|'number'|'textarea'|'select'|'radio'|'checkbox'|'file'|'date'|'time'} type - Required
 * @property {string} [placeholder]
 * @property {any} [defaultValue]
 * @property {Object[]} [options]
 * @property {string} [options[].label]
 * @property {string} [options[].value]
 * @property {boolean} [isRequired]
 * @property {any} [validationRules]
 * @property {string} [errorMessage]
 * @property {number} [orderIndex]
 * @property {'full'|'half'|'third'|'quarter'} [width]
 * @property {string} [helpText]
 */

/**
 * @typedef {Object} Form
 * @property {string} _id
 * @property {string} name - Required
 * @property {string} slug - Required, unique
 * @property {string} [description]
 * @property {FormField[]} fields
 * @property {string} [submitButtonText]
 * @property {string} [successMessage]
 * @property {string} [redirectUrl]
 * @property {boolean} [sendEmailNotification]
 * @property {string} [notificationEmail]
 * @property {string} [emailSubject]
 * @property {boolean} [autoReplyEmail]
 * @property {string} [autoReplySubject]
 * @property {string} [autoReplyMessage]
 * @property {string} [webhookUrl]
 * @property {any} [integrations]
 * @property {number} [submissionCount]
 * @property {boolean} [allowMultipleSubmissions]
 * @property {boolean} [requireAuthentication]
 * @property {boolean} [isActive]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} FormSubmission
 * @property {string} _id
 * @property {string} formId - Required, reference to Form._id
 * @property {string} formName - Required
 * @property {any} data - Required, submitted form data
 * @property {string} [submittedBy] - Reference to User._id
 * @property {string} [ipAddress]
 * @property {string} [userAgent]
 * @property {'new'|'read'|'processed'|'archived'|'spam'} [status]
 * @property {string} [notes]
 * @property {MediaAsset[]} [files]
 * @property {boolean} [isActive]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} FAQ
 * @property {string} _id
 * @property {string} question - Required
 * @property {string} answer - Required
 * @property {string} [category] - Reference to Category._id
 * @property {string[]} [tags]
 * @property {number} [orderIndex]
 * @property {boolean} [isFeatured]
 * @property {number} [viewCount]
 * @property {number} [helpfulCount]
 * @property {number} [notHelpfulCount]
 * @property {string} [language]
 * @property {Localization[]} [translations]
 * @property {boolean} [isActive]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Testimonial
 * @property {string} _id
 * @property {string} customerName - Required
 * @property {string} [customerTitle]
 * @property {string} [customerCompany]
 * @property {MediaAsset} [customerPhoto]
 * @property {string} [customerEmail]
 * @property {number} rating - Required, 1-5
 * @property {string} [title]
 * @property {string} content - Required
 * @property {MediaAsset[]} [images]
 * @property {string} [videoUrl]
 * @property {boolean} [isVerified]
 * @property {string} [verificationMethod]
 * @property {Date} [purchaseDate]
 * @property {'pending'|'approved'|'rejected'} [status]
 * @property {boolean} [isFeatured]
 * @property {number} [orderIndex]
 * @property {string} [productRef] - Reference to Product._id
 * @property {string} [serviceRef] - Reference to Service._id
 * @property {boolean} [isActive]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Slide
 * @property {string} [title]
 * @property {string} [subtitle]
 * @property {string} [description]
 * @property {MediaAsset} [image]
 * @property {string} [videoUrl]
 * @property {'image'|'video'|'color'} [backgroundType]
 * @property {string} [backgroundColor]
 * @property {CTA} [primaryCTA]
 * @property {CTA} [secondaryCTA]
 * @property {'left'|'center'|'right'|'top'|'bottom'} [textPosition]
 * @property {string} [textColor]
 * @property {number} [overlayOpacity] - 0-1
 * @property {number} [orderIndex]
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} Slider
 * @property {string} _id
 * @property {string} name - Required
 * @property {'homepage'|'about'|'services'|'products'|'custom'} [location]
 * @property {Slide[]} slides
 * @property {boolean} [autoPlay]
 * @property {number} [autoPlaySpeed] - Milliseconds
 * @property {number} [transitionSpeed] - Milliseconds
 * @property {boolean} [showArrows]
 * @property {boolean} [showDots]
 * @property {boolean} [loop]
 * @property {boolean} [isActive]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Notification
 * @property {string} _id
 * @property {'info'|'success'|'warning'|'error'|'announcement'} [type]
 * @property {string} title - Required
 * @property {string} message - Required
 * @property {string} [icon]
 * @property {'all'|'role'|'user'|'group'} [targetType]
 * @property {string[]} [targetRoles]
 * @property {string[]} [targetUsers] - References to User._id
 * @property {string} [actionUrl]
 * @property {string} [actionLabel]
 * @property {'toast'|'banner'|'modal'|'badge'} [displayLocation]
 * @property {'low'|'medium'|'high'|'critical'} [priority]
 * @property {Date} [publishAt]
 * @property {Date} [expiresAt]
 * @property {string[]} [readBy] - References to User._id
 * @property {string[]} [dismissedBy] - References to User._id
 * @property {boolean} [isActive]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

// ============================================
// INITIAL STATE HELPERS
// ============================================

/**
 * Initial state for Page form
 */
export const initialPageState = {
  title: "",
  slug: "",
  description: "",
  content: "",
  contentBlocks: [],
  featuredImage: null,
  pageType: "custom",
  template: "default",
  parentPage: null,
  seo: {
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    canonicalUrl: "",
    noIndex: false,
    noFollow: false
  },
  status: "draft",
  publishedAt: null,
  scheduledAt: null,
  isPublic: true,
  requiredRole: "",
  language: "en",
  translations: [],
  author: null,
  viewCount: 0,
  orderIndex: 0,
  customFields: {},
  isActive: true
};

/**
 * Initial state for Post form
 */
export const initialPostState = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  contentBlocks: [],
  featuredImage: null,
  gallery: [],
  category: null,
  tags: [],
  author: null,
  coAuthors: [],
  seo: {
    metaTitle: "",
    metaDescription: "",
    metaKeywords: []
  },
  status: "draft",
  publishedAt: null,
  scheduledAt: null,
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  shareCount: 0,
  isFeatured: false,
  isPinned: false,
  allowComments: true,
  language: "en",
  translations: [],
  relatedPosts: [],
  customFields: {},
  isActive: true
};

/**
 * Initial state for Category form
 */
export const initialCategoryState = {
  name: "",
  slug: "",
  description: "",
  parentCategory: null,
  level: 0,
  image: null,
  icon: "",
  seo: {
    metaTitle: "",
    metaDescription: ""
  },
  color: "",
  orderIndex: 0,
  contentType: "generic",
  itemCount: 0,
  language: "en",
  translations: [],
  isActive: true
};

/**
 * Initial state for FAQ form
 */
export const initialFAQState = {
  question: "",
  answer: "",
  category: null,
  tags: [],
  orderIndex: 0,
  isFeatured: false,
  viewCount: 0,
  helpfulCount: 0,
  notHelpfulCount: 0,
  language: "en",
  translations: [],
  isActive: true
};

/**
 * Initial state for Testimonial form
 */
export const initialTestimonialState = {
  customerName: "",
  customerTitle: "",
  customerCompany: "",
  customerPhoto: null,
  customerEmail: "",
  rating: 5,
  title: "",
  content: "",
  images: [],
  videoUrl: "",
  isVerified: false,
  verificationMethod: "",
  purchaseDate: null,
  status: "pending",
  isFeatured: false,
  orderIndex: 0,
  productRef: null,
  serviceRef: null,
  isActive: true
};

/**
 * Initial state for Settings form
 */
export const initialSettingsState = {
  key: "",
  value: "",
  label: "",
  description: "",
  dataType: "string",
  group: "general",
  category: "",
  isRequired: false,
  validationRules: {},
  isPublic: false,
  isEditable: true,
  isActive: true
};

// ============================================
// EXPORT ALL TYPES
// ============================================

// For TypeScript projects, you can convert these JSDoc comments to actual TypeScript interfaces
// For JavaScript projects, these JSDoc types provide intellisense in modern IDEs

export default {
  // Initial States
  initialPageState,
  initialPostState,
  initialCategoryState,
  initialFAQState,
  initialTestimonialState,
  initialSettingsState
};
