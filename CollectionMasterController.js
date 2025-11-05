const CollectionMaster = require("../models/CollectionMaster");

exports.createCollection = async (req, res) => {
    try {
        const { title, image, description, isActive } = req.body;
        console.log("Creating collection:", req.body);

        const collection = await CollectionMaster.create({
            title,
            image,
            description,
            isActive
        });

        res.status(201).json({
            isOk: true,
            message: "Collection created successfully",
            data: collection
        });
    } catch (error) {
        console.log("Error creating collection:", error);
        res.status(500).json({
            isOk: false,
            message: "Error creating collection",
            error: error.message
        });
    }
}

exports.getAllCollections = async (req, res) => {
    try {
        const collections = await CollectionMaster.find({ isActive: true });

        res.status(200).json({
            isOk: true,
            message: "Collections fetched successfully",
            data: collections
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            isOk: false,
            message: "Error fetching collections",
            error: error.message
        });
    }
}

exports.getCollectionById = async (req, res) => {
    try {
        const { collectionId } = req.params;

        const collection = await CollectionMaster.findById(collectionId);

        res.status(200).json({
            isOk: true,
            message: "Collection fetched successfully",
            data: collection
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            isOk: false,
            message: "Error fetching collection",
            error: error.message
        });
    }
}

exports.updateCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { title, image, description, isActive } = req.body;
        console.log("Updating collection:", req.body);

        const collection = await CollectionMaster.findByIdAndUpdate(
            collectionId,
            {
                title,
                image,
                description,
                isActive
            },
            { new: true }
        );

        res.status(200).json({
            isOk: true,
            message: "Collection updated successfully",
            data: collection
        });
    } catch (error) {
        console.log("Error updating collection:", error);
        res.status(500).json({
            isOk: false,
            message: "Error updating collection",
            error: error.message
        });
    }
}

exports.deleteCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;

        const collection = await CollectionMaster.findByIdAndUpdate(collectionId, { isActive: false }, { new: true });

        res.status(200).json({
            isOk: true,
            message: "Collection deleted successfully",
            data: collection
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            isOk: false,
            message: "Error deleting collection",
            error: error.message
        });
    }
}

exports.listCollectionByParams = async (req, res) => {
    try {
        let { skip, per_page, sorton, sortdir, match, isActive } = req.body;

        let query = [
            {
                $match: { isActive: isActive },
            },
            {
                $facet: {
                    stage1: [
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    stage2: [{ $skip: skip }, { $limit: per_page }],
                },
            },
            {
                $unwind: "$stage1",
            },
            {
                $project: {
                    count: "$stage1.count",
                    data: "$stage2",
                },
            },
        ];

        if (match) {
            query = [
                {
                    $match: {
                        $or: [
                            {
                                title: {
                                    $regex: match,
                                    $options: "i",
                                },
                            },
                        ],
                    },
                },
            ].concat(query);
        }

        // Add sorting
        if (sorton && sortdir) {
            let sort = {};
            sort[sorton] = sortdir === "desc" ? -1 : 1;
            query = [{ $sort: sort }].concat(query);
        } else {
            query = [{ $sort: { createdAt: -1 } }].concat(query);
        }

        const list = await CollectionMaster.aggregate(query);

        return res.status(200).json({
            isOk: true,
            data: list,
            status: 200,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            isOk: false,
            message: error.message,
            status: 500,
        });
    }
}
