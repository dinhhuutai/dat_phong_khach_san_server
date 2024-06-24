const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    rating: {
        type: Number,
    },
    content: {
        type: String,
    },
    idHotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hotels",
    },
    idRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rooms",
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

module.exports = mongoose.model("comment", CommentSchema);
