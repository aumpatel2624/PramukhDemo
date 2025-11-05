const mongoose = require("mongoose")

const BannerMaster = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        buttontitle: {
            type: String,
            required: true,
        },
        buttonLink: {
            type: String,
            required: true,
        },
        imageURL: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true}
);

module.exports = mongoose.model("BannerMaster", BannerMaster);
