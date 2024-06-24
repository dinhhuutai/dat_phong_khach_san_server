const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationsSchema = new Schema({
    status: {
        type: Number,
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    statusNotice: {
        type: Number,
    },
    statusBooking: {
        type: Number,
    },
    title: {
        type: String,
    },
    content: {
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

module.exports = mongoose.model("notifications", NotificationsSchema);
