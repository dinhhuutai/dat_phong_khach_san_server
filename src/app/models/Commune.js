const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommuneSchema = new Schema({
    name: {
        type: String,
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "districts",
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

module.exports = mongoose.model("communes", CommuneSchema);
