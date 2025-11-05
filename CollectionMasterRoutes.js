const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware.js");
const {
    createCollection,
    getAllCollections,
    updateCollection,
    deleteCollection,
    listCollectionByParams,
    getCollectionById,
} = require("../controllers/CollectionMasterController.js");

const router = express.Router();

router.post(
    "/auth/create/collection",
    authMiddleware(["ADMIN", "EMPLOYEE"]),
    createCollection
);

router.get(
    "/auth/get/collection",
    authMiddleware(["ADMIN", "EMPLOYEE"]),
    getAllCollections
);

router.put(
    "/auth/update/collection/:collectionId",
    authMiddleware(["ADMIN", "EMPLOYEE"]),
    updateCollection
);

router.delete(
    "/auth/delete/collection/:collectionId",
    authMiddleware(["ADMIN", "EMPLOYEE"]),
    deleteCollection
);

router.post(
    "/auth/listbyparams/collection",
    authMiddleware(["ADMIN", "EMPLOYEE"]),
    listCollectionByParams
);

router.get(
    "/auth/get/collection/:collectionId",
    authMiddleware(["ADMIN", "EMPLOYEE"]),
    getCollectionById
);

module.exports = router;
