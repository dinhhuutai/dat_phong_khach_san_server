const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter user fullName"],
        trim: true,
        maxLength: [100, "User fullName cannot exceed 100 characters"],
    },
    role: {
        type: Number,
        required: [true, "Please enter role"],
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Please enter user email"],
    },
    password: {
        type: String,
        required: [true, "Please enter user password"],
    },
    avatar: {
        type: String,
        default:
            "https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.9.87/static/media/user-default.3ff115bb.png",
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isVerification: {
        type: Boolean,
        default: false,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    updateDate: {
        type: Date,
        default: Date.now,
    },
    refreshToken: {
        type: String,
    },
    codeVerification: {
        type: String,
    },
    codeVerificationChangedAt: {
        type: String,
    },
    codeVerificationExpires: {
        type: String,
    },
    historyBooking: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "hotels",
        },
    ],
    favouriteHotel: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "hotels",
        },
    ],
    payments: [
        {
            numCard: { type: String },
            name: { type: String },
            exp: { type: Date },
            cvv: { type: Number },
            typeCard: { type: String },
        },
    ],
    status: {
        type: Number,
    },
});

UserSchema.pre("save", function (next) {
    if (this.payments.length > 3) {
        const error = new Error(
            "Maximum number of payments reached (3). Cannot add more."
        );
        return next(error);
    }
    next();
});

module.exports = mongoose.model("users", UserSchema);
