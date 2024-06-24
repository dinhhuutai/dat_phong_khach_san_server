const Notification = require("../models/Notification");
const asyncHandle = require("express-async-handler");

class NotificationController {
    // [POST] /api/v1/notification/create
    create = asyncHandle(async (req, res, next) => {
        const notification = new Notification({
            ...req.body,
            title:
                req.body.statusBooking === 1
                    ? "Đã đặt phòng"
                    : req.body.statusBooking === 4
                    ? "Đặt phòng thành công"
                    : req.body.statusBooking === 3
                    ? "Đặt phòng đã hủy"
                    : req.body.statusBooking === 5
                    ? "Đặt phòng đã hủy"
                    : req.body.statusBooking === 2
                    ? "Cảm ơn bạn đã đặt phòng"
                    : "",
            content:
                req.body.statusBooking === 1
                    ? `Bạn đã đặt phòng khách sạn ${req.body.nameHotel}. Vui lòng chờ xác nhận.`
                    : req.body.statusBooking === 4
                    ? `Bạn đã đặt phòng khách sạn ${req.body.nameHotel} thành công.`
                    : req.body.statusBooking === 3
                    ? `Đặt phòng khách sạn ${req.body.nameHotel} đã bị hủy.`
                    : req.body.statusBooking === 5
                    ? `Đặt phòng khách sạn ${req.body.nameHotel} đã bị hủy. Do bạn không tới nhận phòng.`
                    : req.body.statusBooking === 2
                    ? `Mã khuyến mãi của khách sạn ${req.body.nameHotel}: 123`
                    : "",
            createDate: Date.now(),
        });

        await notification.save();

        const notiCount = await Notification.find({
            idUser: req.body.idUser,
            status: 0,
        });

        res.status(200).json({
            success: true,
            data: notiCount.length,
        });
    });

    // [GET] /api/v1/notification/getByIdUser/:id
    getByIdUser = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const notification = await Notification.find({ idUser: id }).sort({
            createDate: -1,
        });

        return res.status(200).json({
            success: true,
            data: notification,
        });
    });

    // [POST] /api/v1/notification/viewed/:id
    viewed = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const notification = await Notification.updateMany(
            { idUser: id },
            { $set: { status: 1 } }
        );

        const notiCount = await Notification.find({
            idUser: id,
            status: 0,
        });

        return res.status(200).json({
            success: true,
            data: notiCount.length,
        });
    });
}

module.exports = new NotificationController();
