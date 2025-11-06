/**
 * Example CMS Controllers
 * Demonstrates how to use the CMS schemas for CRUD operations
 * Follow these patterns for your own CMS modules
 */

const {
  Page,
  Post,
  Category,
  MediaLibrary,
  Navigation,
  Settings,
  Form,
  FormSubmission,
  FAQ,
  Testimonial,
  Slider,
  Notification
} = require("./CMSSchemas");

// ============================================
// PAGE CONTROLLER EXAMPLE
// ============================================

/**
 * Create a new page
 */
const createPage = async (req, res) => {
  try {
    const pageData = req.body;

    // Create new page
    const page = new Page(pageData);
    await page.save();

    return res.status(201).json({
      success: true,
      message: "Page created successfully",
      data: page
    });
  } catch (error) {
    console.error("Error creating page:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create page",
      error: error.message
    });
  }
};

/**
 * Get all active pages with pagination
 */
const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find({ isActive: true, status: "published" })
      .populate("author", "name email")
      .sort({ orderIndex: 1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: pages.length,
      data: pages
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pages",
      error: error.message
    });
  }
};

/**
 * Get page by slug (for frontend)
 */
const getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { language = "en" } = req.query;

    const page = await Page.findOne({
      slug,
      language,
      isActive: true,
      status: "published"
    })
      .populate("author", "name email")
      .lean();

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found"
      });
    }

    // Increment view count
    await Page.findByIdAndUpdate(page._id, { $inc: { viewCount: 1 } });

    return res.status(200).json({
      success: true,
      data: page
    });
  } catch (error) {
    console.error("Error fetching page:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch page",
      error: error.message
    });
  }
};

/**
 * Update page
 */
const updatePage = async (req, res) => {
  try {
    const { pageId } = req.params;
    const updateData = req.body;

    const page = await Page.findByIdAndUpdate(
      pageId,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Page updated successfully",
      data: page
    });
  } catch (error) {
    console.error("Error updating page:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update page",
      error: error.message
    });
  }
};

/**
 * Delete page (soft delete)
 */
const deletePage = async (req, res) => {
  try {
    const { pageId } = req.params;

    const page = await Page.findByIdAndUpdate(
      pageId,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Page deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting page:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete page",
      error: error.message
    });
  }
};

/**
 * Advanced page listing with filters and pagination
 */
const listPagesByParams = async (req, res) => {
  try {
    const {
      search = "",
      pageType = "",
      status = "",
      language = "en",
      page = 1,
      limit = 50,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.body;

    const skip = (page - 1) * limit;

    // Build match conditions
    const matchConditions = { isActive: true, language };

    if (search) {
      matchConditions.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (pageType) {
      matchConditions.pageType = pageType;
    }

    if (status) {
      matchConditions.status = status;
    }

    // Aggregation pipeline
    const pipeline = [
      { $match: matchConditions },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorDetails"
              }
            },
            {
              $project: {
                title: 1,
                slug: 1,
                description: 1,
                excerpt: 1,
                pageType: 1,
                status: 1,
                publishedAt: 1,
                featuredImage: 1,
                viewCount: 1,
                orderIndex: 1,
                createdAt: 1,
                updatedAt: 1,
                "authorDetails.name": 1,
                "authorDetails.email": 1
              }
            }
          ]
        }
      }
    ];

    const result = await Page.aggregate(pipeline);

    const total = result[0].metadata[0]?.total || 0;
    const pages = result[0].data;

    return res.status(200).json({
      success: true,
      data: pages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error listing pages:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to list pages",
      error: error.message
    });
  }
};

// ============================================
// POST CONTROLLER EXAMPLE
// ============================================

/**
 * Create a new post
 */
const createPost = async (req, res) => {
  try {
    const postData = req.body;
    postData.author = req.user._id; // From auth middleware

    const post = new Post(postData);
    await post.save();

    // Update category item count
    if (postData.category) {
      await Category.findByIdAndUpdate(postData.category, {
        $inc: { itemCount: 1 }
      });
    }

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message
    });
  }
};

/**
 * Get published posts with pagination
 */
const getPublishedPosts = async (req, res) => {
  try {
    const {
      category = "",
      tag = "",
      page = 1,
      limit = 10,
      language = "en"
    } = req.query;

    const skip = (page - 1) * limit;

    const query = {
      isActive: true,
      status: "published",
      language,
      publishedAt: { $lte: new Date() }
    };

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate("author", "name email")
        .populate("category", "name slug")
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Post.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message
    });
  }
};

/**
 * Get single post by slug
 */
const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { language = "en" } = req.query;

    const post = await Post.findOne({
      slug,
      language,
      isActive: true,
      status: "published"
    })
      .populate("author", "name email")
      .populate("category", "name slug")
      .populate("relatedPosts")
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Increment view count
    await Post.findByIdAndUpdate(post._id, { $inc: { viewCount: 1 } });

    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: error.message
    });
  }
};

// ============================================
// CATEGORY CONTROLLER EXAMPLE
// ============================================

/**
 * Create a new category
 */
const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;

    // Calculate level based on parent
    if (categoryData.parentCategory) {
      const parent = await Category.findById(categoryData.parentCategory);
      categoryData.level = parent ? parent.level + 1 : 0;
    }

    const category = new Category(categoryData);
    await category.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message
    });
  }
};

/**
 * Get category hierarchy (tree structure)
 */
const getCategoryTree = async (req, res) => {
  try {
    const { contentType = "", language = "en" } = req.query;

    const query = { isActive: true, language };
    if (contentType) {
      query.contentType = contentType;
    }

    const categories = await Category.find(query)
      .sort({ orderIndex: 1, name: 1 })
      .lean();

    // Build tree structure
    const categoryMap = {};
    const tree = [];

    // Create map
    categories.forEach(cat => {
      categoryMap[cat._id] = { ...cat, children: [] };
    });

    // Build tree
    categories.forEach(cat => {
      if (cat.parentCategory) {
        const parent = categoryMap[cat.parentCategory];
        if (parent) {
          parent.children.push(categoryMap[cat._id]);
        }
      } else {
        tree.push(categoryMap[cat._id]);
      }
    });

    return res.status(200).json({
      success: true,
      data: tree
    });
  } catch (error) {
    console.error("Error fetching category tree:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category tree",
      error: error.message
    });
  }
};

// ============================================
// SETTINGS CONTROLLER EXAMPLE
// ============================================

/**
 * Get settings by group
 */
const getSettingsByGroup = async (req, res) => {
  try {
    const { group } = req.params;

    const settings = await Settings.find({
      group,
      isActive: true
    }).lean();

    // Convert to key-value object
    const settingsObject = {};
    settings.forEach(setting => {
      settingsObject[setting.key] = setting.value;
    });

    return res.status(200).json({
      success: true,
      data: settingsObject
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message
    });
  }
};

/**
 * Update or create a setting
 */
const upsertSetting = async (req, res) => {
  try {
    const { key, value, label, description, dataType, group, category } = req.body;

    const setting = await Settings.findOneAndUpdate(
      { key },
      {
        key,
        value,
        label,
        description,
        dataType,
        group,
        category,
        updatedAt: Date.now()
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Setting saved successfully",
      data: setting
    });
  } catch (error) {
    console.error("Error saving setting:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save setting",
      error: error.message
    });
  }
};

/**
 * Get public settings (for frontend)
 */
const getPublicSettings = async (req, res) => {
  try {
    const settings = await Settings.find({
      isPublic: true,
      isActive: true
    }).lean();

    const settingsObject = {};
    settings.forEach(setting => {
      settingsObject[setting.key] = setting.value;
    });

    return res.status(200).json({
      success: true,
      data: settingsObject
    });
  } catch (error) {
    console.error("Error fetching public settings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch public settings",
      error: error.message
    });
  }
};

// ============================================
// FORM SUBMISSION CONTROLLER EXAMPLE
// ============================================

/**
 * Submit a form
 */
const submitForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const submissionData = req.body;

    // Get form details
    const form = await Form.findById(formId);

    if (!form || !form.isActive) {
      return res.status(404).json({
        success: false,
        message: "Form not found"
      });
    }

    // Create submission
    const submission = new FormSubmission({
      formId: form._id,
      formName: form.name,
      data: submissionData,
      submittedBy: req.user?._id,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    await submission.save();

    // Update form submission count
    await Form.findByIdAndUpdate(formId, { $inc: { submissionCount: 1 } });

    // TODO: Send email notification if configured
    // TODO: Trigger webhook if configured

    return res.status(201).json({
      success: true,
      message: form.successMessage || "Form submitted successfully",
      redirectUrl: form.redirectUrl
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit form",
      error: error.message
    });
  }
};

// ============================================
// FAQ CONTROLLER EXAMPLE
// ============================================

/**
 * Get FAQs with optional filtering
 */
const getFAQs = async (req, res) => {
  try {
    const { category = "", tag = "", featured = "", language = "en" } = req.query;

    const query = { isActive: true, language };

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    const faqs = await FAQ.find(query)
      .populate("category", "name slug")
      .sort({ orderIndex: 1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
      error: error.message
    });
  }
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Page
  createPage,
  getAllPages,
  getPageBySlug,
  updatePage,
  deletePage,
  listPagesByParams,

  // Post
  createPost,
  getPublishedPosts,
  getPostBySlug,

  // Category
  createCategory,
  getCategoryTree,

  // Settings
  getSettingsByGroup,
  upsertSetting,
  getPublicSettings,

  // Form Submission
  submitForm,

  // FAQ
  getFAQs
};
