const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    idHotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hotels",
    },
    typeRoom: {
        type: String,
    },
    price: {
        type: Number,
    },
    maxPeople: {
        type: Number,
    },
    name: {
        type: String,
    },
    photo: [
        {
            url: { type: String },
        },
    ],
    status: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    desc: {
        type: String,
    },
    utils: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "utilHotels",
        },
    ],
    facilities: {
        bed: { type: Number },
        bath: { type: Number },
        guest: { type: Number },
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    updateDate: {
        type: Date,
        default: Date.now,
    },
    delete: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("rooms", RoomSchema);
