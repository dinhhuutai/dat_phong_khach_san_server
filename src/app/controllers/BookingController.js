const Booking = require("../models/Booking");
const asyncHandle = require("express-async-handler");
const shortid = require("shortid");
const Room = require("../models/Room");

class BookingController {
    // [POST] /api/v1/booking/create
    create = asyncHandle(async (req, res, next) => {
        const booking = new Booking({
            ...req.body,
            encodeId: shortid.generate(),
            createDate: Date.now(),
        });

        await booking.save();

        const bookingMyUser = await Booking.find({ idUser: req.body.idUser });

        res.status(200).json({
            success: true,
            data: bookingMyUser,
        });
    });

    // [PUT] /api/v1/booking/update/:id
    update = asyncHandle(async (req, res, next) => {
        const statusContent = req.body?.statusContent;
        const id = req.params.id;

        const booking = await Booking.findByIdAndUpdate(
            id,
            {
                ...req.body,
                statusContent,
                updateDate: Date.now(),
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            booking,
        });
    });

    // [POST] /api/v1/booking/delete
    delete = asyncHandle(async (req, res, next) => {
        const { listId } = req.body;

        listId.map(async (id) => {
            await Booking.findByIdAndDelete(id);
        });

        return res.status(200).json({
            success: true,
        });
    });

    // [GET] /api/v1/booking/getById/:id
    getById = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const booking = await Booking.findById(id)
            .populate("idHotel")
            .populate("idRoom")
            .populate("idUser")
            .populate({
                path: "idHotel",
                populate: {
                    path: "province",
                    model: "provinces", // Tên của model của tỉnh (province)
                },
            })
            .populate({
                path: "idHotel",
                populate: {
                    path: "district",
                    model: "districts", // Tên của model của tỉnh (province)
                },
            })
            .populate({
                path: "idHotel",
                populate: {
                    path: "communes",
                    model: "communes", // Tên của model của tỉnh (province)
                },
            });

        return res.status(200).json({
            success: true,
            data: booking,
        });
    });

    // [GET] /api/v1/booking/getByIdUser/:id/:status
    getByIdUser = asyncHandle(async (req, res, next) => {
        const id = req.params.id;
        const status = req.params.status;

        const booking = await Booking.find({ idUser: id, status })
            .populate("idHotel")
            .populate("idRoom")
            .populate({
                path: "idHotel",
                populate: {
                    path: "province",
                    model: "provinces", // Tên của model của tỉnh (province)
                },
            })
            .populate({
                path: "idHotel",
                populate: {
                    path: "district",
                    model: "districts", // Tên của model của tỉnh (province)
                },
            })
            .populate({
                path: "idHotel",
                populate: {
                    path: "communes",
                    model: "communes", // Tên của model của tỉnh (province)
                },
            })
            .sort({
                createDate: -1,
            });

        return res.status(200).json({
            success: true,
            data: booking,
        });
    });

    // [POST] /api/v1/booking/cancel/:id
    cancel = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const booking = await Booking.findByIdAndUpdate(
            id,
            {
                ...req.body,
                status: 3,
                updateDate: Date.now(),
            },
            { new: true }
        ).populate("idHotel");

        return res.status(200).json({
            success: true,
            data: booking,
        });
    });

    // [POST] /api/v1/booking/analytics
    analytics = asyncHandle(async (req, res, next) => {
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const idHotel = req.body.idHotel;

        const booking = await Booking.find({
            idHotel: idHotel, // Lọc theo idHotel
            createDate: {
                $gte: new Date(startDate.y, startDate.m, startDate.d),
                $lte: new Date(endDate.y, endDate.m, endDate.d + 1),
            },
        });

        const bookingPlaced = await Booking.find({
            idHotel: idHotel, // Lọc theo idHotel
            createDate: {
                $gte: new Date(startDate.y, startDate.m, startDate.d),
                $lte: new Date(endDate.y, endDate.m, endDate.d + 1),
            },
            $or: [{ status: 1 }, { status: 4 }],
        });

        const bookingReceived = await Booking.find({
            idHotel: idHotel, // Lọc theo idHotel
            createDate: {
                $gte: new Date(startDate.y, startDate.m, startDate.d),
                $lte: new Date(endDate.y, endDate.m, endDate.d + 1),
            },
            status: 2,
        });

        const bookingNotReceived = await Booking.find({
            idHotel: idHotel, // Lọc theo idHotel
            createDate: {
                $gte: new Date(startDate.y, startDate.m, startDate.d),
                $lte: new Date(endDate.y, endDate.m, endDate.d + 1),
            },
            status: 5,
        });

        const bookingCancelled = await Booking.find({
            idHotel: idHotel, // Lọc theo idHotel
            createDate: {
                $gte: new Date(startDate.y, startDate.m, startDate.d),
                $lte: new Date(endDate.y, endDate.m, endDate.d + 1),
            },
            status: 3,
        });

        const data = {
            total: {
                num: booking.length,
                percent: 100,
            },
            booked: {
                num: bookingPlaced.length,
                percent:
                    (bookingPlaced.length / booking.length).toFixed(2) * 100,
            },
            received: {
                num: bookingReceived.length,
                percent:
                    (bookingReceived.length / booking.length).toFixed(2) * 100,
            },
            notReceived: {
                num: bookingNotReceived.length,
                percent:
                    (bookingNotReceived.length / booking.length).toFixed(2) *
                    100,
            },
            canceled: {
                num: bookingCancelled.length,
                percent:
                    (bookingCancelled.length / booking.length).toFixed(2) * 100,
            },
        };

        return res.status(200).json({
            success: true,
            data,
        });
    });

    // [POST] /api/v1/booking/findBookingsByDateAndStatus
    findBookingsByDateAndStatus = asyncHandle(async (req, res, next) => {
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const idHotel = req.body.idHotel;
        const status = req.body.status;

        let query = {
            idHotel: idHotel, // Lọc theo idHotel
            createDate: {
                $gte: new Date(startDate.y, startDate.m, startDate.d),
                $lte: new Date(endDate.y, endDate.m, endDate.d + 1),
            },
        };

        if (status !== 0) {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate("idUser")
            .populate("idRoom");

        return res.status(200).json({
            success: true,
            data: bookings,
        });
    });

    // [POST] /api/v1/booking/changeStatus
    changeStatus = asyncHandle(async (req, res, next) => {
        const idBooking = req.body.idBooking;
        const status = req.body.status;

        const booking = await Booking.findByIdAndUpdate(
            idBooking,
            { status: status },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: booking,
        });
    });

    // [POST] /api/v1/booking/revenue
    revenue = asyncHandle(async (req, res, next) => {
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const idHotel = req.body.idHotel;

        const quantityBookingHotel = await Booking.find({
            idHotel: idHotel,
            createDate: {
                $gte: new Date(startDate.y, startDate.m, startDate.d),
                $lte: new Date(endDate.y, endDate.m, endDate.d + 1),
            },
        });

        const totalBookingHotelPrice = quantityBookingHotel.reduce(
            (total, booking) => {
                return total + booking.price;
            },
            0
        );

        const sliceColor = [
            "#fbd203",
            "#ffb300",
            "#ff9100",
            "#ff6c00",
            "#ff3c00",
            "#9900FF",
            "#990033",
            "#990066",
            "#3300CC",
            "#00CC00",
            "#00FF00",
            "#FF9900",
            "#CC9966",
        ];
        const rooms = await Room.find({ idHotel });

        const revenuePromises = rooms.map(async (room, index) => {
            const quantityBooking = await Booking.find({
                idRoom: room._id,
                createDate: {
                    $gte: new Date(startDate.y, startDate.m, startDate.d),
                    $lte: new Date(endDate.y, endDate.m, endDate.d + 1),
                },
            });

            const totalBookingPrice = quantityBooking.reduce(
                (total, booking) => {
                    return total + booking.price;
                },
                0
            );

            let percent = 0;

            if (totalBookingHotelPrice !== 0) {
                percent =
                    (totalBookingPrice / totalBookingHotelPrice).toFixed(2) *
                    100;
            }

            const data = {
                _id: room._id,
                name: room.name,
                percent: percent,
                revenue: totalBookingPrice,
                quantityBooking: quantityBooking.length,
                color: sliceColor[index],
            };

            return data;
        });

        const revenue = await Promise.all(revenuePromises);
        //console.log(revenue);

        return res.status(200).json({
            success: true,
            data: revenue,
        });
    });
}

module.exports = new BookingController();
