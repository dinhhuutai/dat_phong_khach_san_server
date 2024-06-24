const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DistrictSchema = new Schema({
    name: {
        type: String,
    },
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "provinces",
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    updateDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("districts", DistrictSchema);
