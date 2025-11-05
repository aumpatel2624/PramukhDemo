const BannerMaster = require("../models/BannerMaster");

exports.createBanner = async (req, res) => {
    try {
        const { title, buttontitle, buttonLink, isActive } = req.body;
        console.log("Creating banner:", req.body);

        const banner = await BannerMaster.create({
            title,
            buttontitle,
            buttonLink,
            isActive
        });

        res.status(201).json({
            isOk: true,
            message: "Banner created successfully",
            data: banner
        });
    } catch (error) {
        console.log("Error creating banner:", error);
        res.status(500).json({
            isOk: false,
            message: "Error creating banner",
            error: error.message
        });
    }
}

exports.getAllBanners = async (req, res) => {
    try {
        const banners = await BannerMaster.find({ isActive: true });

        res.status(200).json({
            isOk: true,
            message: "Banners fetched successfully",
            data: banners
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            isOk: false,
            message: "Error fetching banners",
            error: error.message
        });
    }
}

exports.getBannerById = async (req, res) => {
    try {
        const { bannerId } = req.params;

        const banner = await BannerMaster.findById(bannerId);

        res.status(200).json({
            isOk: true,
            message: "Banner fetched successfully",
            data: banner
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            isOk: false,
            message: "Error fetching banner",
            error: error.message
        });
    }
}

exports.updateBanner = async (req, res) => {
    try {
        const { bannerId } = req.params;
        const { title, buttontitle, buttonLink, isActive } = req.body;
        console.log("Updating banner:", req.body);

        const banner = await BannerMaster.findByIdAndUpdate(
            bannerId,
            {
                title,
                buttontitle,
                buttonLink,
                isActive
            },
            { new: true }
        );

        res.status(200).json({
            isOk: true,
            message: "Banner updated successfully",
            data: banner
        });
    } catch (error) {
        console.log("Error updating banner:", error);
        res.status(500).json({
            isOk: false,
            message: "Error updating banner",
            error: error.message
        });
    }
}

exports.deleteBanner = async (req, res) => {
    try {
        const { bannerId } = req.params;

        const banner = await BannerMaster.findByIdAndUpdate(bannerId, { isActive: false }, { new: true });

        res.status(200).json({
            isOk: true,
            message: "Banner deleted successfully",
            data: banner
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            isOk: false,
            message: "Error deleting banner",
            error: error.message
        });
    }
}

exports.listBannerByParams = async (req, res) => {
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

        const list = await BannerMaster.aggregate(query);

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
