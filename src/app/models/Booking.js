const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    encodeId: {
        type: String,
        require: [true, "encodeId artist no underfined"],
        unique: true,
    },
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    },
    phone: {
        type: String,
    },
    price: {
        type: Number,
    },
    idHotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hotels",
    },
    idRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rooms",
    },
    promotion: {
        type: String,
    },
    methodPayment: {
        type: String,
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    people: {
        adult: { type: Number },
        kid: { type: Number },
    },
    status: {
        type: Number,
    },
    statusContent: {
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

module.exports = mongoose.model("bookings", BookingSchema);
