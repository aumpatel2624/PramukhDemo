const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authMiddleware } = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter,
});

// Upload single image
router.post(
    "/auth/upload/image",
    authMiddleware(["ADMIN", "EMPLOYEE"]),
    upload.single("image"),
    (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    isOk: false,
                    message: "No file uploaded",
                });
            }

            const imageUrl = `/uploads/${req.file.filename}`;

            res.status(200).json({
                isOk: true,
                message: "Image uploaded successfully",
                data: {
                    filename: req.file.filename,
                    path: imageUrl,
                    url: imageUrl,
                },
            });
        } catch (error) {
            console.error("Upload error:", error);
            res.status(500).json({
                isOk: false,
                message: "Error uploading image",
                error: error.message,
            });
        }
    }
);

// Delete image
router.delete(
    "/auth/delete/image/:filename",
    authMiddleware(["ADMIN", "EMPLOYEE"]),
    (req, res) => {
        try {
            const { filename } = req.params;
            const filePath = path.join(uploadDir, filename);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                res.status(200).json({
                    isOk: true,
                    message: "Image deleted successfully",
                });
            } else {
                res.status(404).json({
                    isOk: false,
                    message: "Image not found",
                });
            }
        } catch (error) {
            console.error("Delete error:", error);
            res.status(500).json({
                isOk: false,
                message: "Error deleting image",
                error: error.message,
            });
        }
    }
);

module.exports = router;
