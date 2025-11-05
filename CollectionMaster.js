const mongoose = require("mongoose")

const CollectionMaster = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        isActive: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true}
);

module.exports = mongoose.model("CollectionMaster", CollectionMaster);
