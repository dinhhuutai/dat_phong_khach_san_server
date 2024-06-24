const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UtilHotelSchema = new Schema({
    name: {
        type: String,
    },
    code: {
        type: String,
    },
    icon: {
        type: String,
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

module.exports = mongoose.model("utilHotels", UtilHotelSchema);
