const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware.js");
const {
    createBanner,
    getAllBanners,
    updateBanner,
    deleteBanner,
    listBannerByParams,
    getBannerById,
} = require("../controllers/BannerMasterController.js");

const router = express.Router();

router.post(
    "/auth/create/banner",
    authMiddleware(["ADMIN", "EMPLOYEE"]),
    createBanner
);

router.get(
    "/auth/get/banner",
    authMiddleware(["ADMIN", "EMPLOYEE"]),
    getAllBanners
);

router.put(
    "/auth/update/banner/:bannerId",
    authMiddleware(["ADMIN", "EMPLOYEE"]),
    updateBanner
);

router.delete(
    "/auth/delete/banner/:bannerId",
    authMiddleware(["ADMIN", "EMPLOYEE"]),
    deleteBanner
);

router.post(
    "/auth/listbyparams/banner",
    authMiddleware(["ADMIN", "EMPLOYEE"]),
    listBannerByParams
);

router.get(
    "/auth/get/banner/:bannerId",
    authMiddleware(["ADMIN", "EMPLOYEE"]),
    getBannerById
);

module.exports = router;
