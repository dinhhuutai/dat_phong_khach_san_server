const authRouter = require("./auth");
const bookingRouter = require("./booking");
const communeRouter = require("./commune");
const districtRouter = require("./district");
const hotelRouter = require("./hotel");
const provinceRouter = require("./province");
const roomRouter = require("./room");
const userRouter = require("./user");
const utilHotelRouter = require("./utilHotel");
const pageRouter = require("./page");
const commentRouter = require("./comment");
const paymentRouter = require("./payment");
const notificationRouter = require("./notification");

function routes(app) {
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/booking", bookingRouter);
    app.use("/api/v1/commune", communeRouter);
    app.use("/api/v1/district", districtRouter);
    app.use("/api/v1/hotel", hotelRouter);
    app.use("/api/v1/province", provinceRouter);
    app.use("/api/v1/room", roomRouter);
    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/utilHotel", utilHotelRouter);
    app.use("/api/v1/page", pageRouter);
    app.use("/api/v1/comment", commentRouter);
    app.use("/api/v1/payment", paymentRouter);
    app.use("/api/v1/notification", notificationRouter);
}

module.exports = routes;
