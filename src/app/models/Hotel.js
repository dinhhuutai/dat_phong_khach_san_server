const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HotelSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter user fullName"],
        trim: true,
        maxLength: [100, "User fullName cannot exceed 100 characters"],
    },
    code: {
        type: String,
    },
    address: {
        type: String,
    },
    idPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "provinces",
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "districts",
    },
    communes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "communes",
    },
    photo: [
        {
            url: { type: String },
        },
    ],
    discount: {
        type: Number,
    },
    maxPeople: {
        type: Number,
    },
    priceMin: {
        type: Number,
    },
    priceMax: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    locationX: {
        type: Number,
    },
    locationY: {
        type: Number,
    },
    utils: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "utilHotels",
        },
    ],
    totalBookings: {
        type: Number,
    },
    totalComments: {
        type: Number,
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

module.exports = mongoose.model("hotels", HotelSchema);
