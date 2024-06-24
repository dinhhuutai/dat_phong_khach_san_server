const Hotel = require("../models/Hotel");
const asyncHandle = require("express-async-handler");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const Comment = require("../models/Comment");
const User = require("../models/User");
const mongoose = require("mongoose");

class HotelController {
    // [POST] /api/v1/hotel/create
    create = asyncHandle(async (req, res, next) => {
        const hotel = new Hotel({
            ...req.body,
            code: req.body.name
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[đĐ]/g, "d")
                .replace(/[ơƠ]/g, "o")
                .replace(/[ôÔ]/g, "o")
                .replace(/[ăĂ]/g, "o")
                .replace(/[âÂ]/g, "o")
                .replace(/[êÊ]/g, "o")
                .replace(/[ưƯ]/g, "o")
                .toLowerCase(),
            maxPeople: 0,
            priceMin: 0,
            priceMax: 0,
            createDate: Date.now(),
        });

        await hotel.save();

        res.status(200).json({
            success: true,
            data: hotel,
        });
    });

    // [PUT] /api/v1/hotel/update/:id
    update = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const hotel = await Hotel.findByIdAndUpdate(
            id,
            {
                ...req.body,
                updateDate: Date.now(),
            },
            { new: true }
        )
            .populate("utils")
            .populate("province")
            .populate("district")
            .populate("communes");

        return res.status(200).json({
            success: true,
            data: hotel,
        });
    });

    // [POST] /api/v1/hotel/delete
    delete = asyncHandle(async (req, res, next) => {
        const { listId } = req.body;

        listId.map(async (id) => {
            await Hotel.findByIdAndDelete(id);
        });

        return res.status(200).json({
            success: true,
        });
    });

    // [GET] /api/v1/hotel/getById/:id
    getById = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const hotel = await Hotel.findById(id)
            .populate("utils")
            .populate("province")
            .populate("district");

        const topTwoComments = await Comment.find({ idHotel: id })
            .populate("idRoom")
            .populate("idUser", "name")
            .sort({ rating: -1 })
            .limit(2);

        const commentAllByIdHotel = await Comment.find({ idHotel: id });

        return res.status(200).json({
            success: true,
            data: {
                hotel,
                topTwoComments,
                commentLength: commentAllByIdHotel.length,
            },
        });
    });

    // [POST] /api/v1/hotel/searchByName
    searchByName = asyncHandle(async (req, res, next) => {
        const { name } = req.body;

        const hotels = await Hotel.find({
            $or: [
                { name: { $regex: new RegExp(name, "i") } },
                { code: { $regex: new RegExp(name, "i") } },
            ],
        });

        return res.status(200).json({
            success: true,
            hotels,
        });
    });

    // [GET] /api/v1/hotel/getAllRoom/:id
    getAllRoom = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const allRoomTemp = await Room.find({ idHotel: id });

        return res.status(200).json({
            success: true,
            data: {
                rooms: allRoomTemp,
            },
        });
    });

    // [POST] /api/v1/hotel/search
    search = asyncHandle(async (req, res, next) => {
        const {
            address,
            date,
            name,
            quantityPeople,
            price,
            rating,
            utils,
            numSort,
            limit,
        } = req.body;

        let queryUtil = {};

        if (Array.isArray(utils) && utils.length > 0) {
            queryUtil.utils = {
                $in: utils,
            };
        }

        let sort = {};

        if (numSort === 1) {
            sort.rating = -1;
        } else if (numSort === 2) {
            sort.priceMin = 1;
        } else if (numSort === 3) {
            sort.priceMin = -1;
        }

        let hotels = await Hotel.find({
            $and: [
                {
                    province:
                        address.province !== ""
                            ? address.province
                            : { $exists: true },
                },
                {
                    district:
                        address.district !== ""
                            ? address.district
                            : { $exists: true },
                },
                {
                    communes:
                        address.communes !== ""
                            ? address.communes
                            : { $exists: true },
                },
            ],
            $or: [
                {
                    name:
                        name !== ""
                            ? { $regex: new RegExp(name, "i") }
                            : { $exists: true },
                },
                {
                    code:
                        name !== ""
                            ? { $regex: new RegExp(name, "i") }
                            : { $exists: true },
                },
            ],
            maxPeople: {
                $gte: quantityPeople.adult * 1 + quantityPeople.kid * 1,
            },
            $or: [
                { priceMin: { $gte: price.min, $lte: price.max } },
                { priceMax: { $gte: price.min, $lte: price.max } },
            ],
            rating: {
                $gte: rating,
            },
            ...queryUtil,
        })
            .populate("utils")
            .populate("province")
            .populate("district")
            .sort(sort);

        const hotelIds = hotels.map((h) => h._id); // Lấy danh sách các _id của khách sạn từ mảng hotel

        const bookings = await Booking.find({
            checkOut: { $gte: new Date() }, // Lọc các đặt phòng có checkOut lớn hơn hiện tại
            idHotel: { $in: hotelIds }, // Lọc các đặt phòng có idHotel nằm trong danh sách các _id của khách sạn
            $or: [
                { checkOut: { $lte: date.checkIn } }, // Ngày check-out của tìm kiếm nhỏ hơn hoặc bằng ngày check-in của đặt phòng
                { checkIn: { $gte: date.checkOut } }, // Ngày check-in của tìm kiếm lớn hơn hoặc bằng ngày check-out của đặt phòng
            ],
        });

        const hotelIdsInBookings = bookings.map((booking) => booking.idHotel);

        if (hotelIdsInBookings.length > 0) {
            hotels = hotels.filter((h) => hotelIdsInBookings.includes(h._id));
        }

        return res.status(200).json({
            success: true,
            data: hotels.slice(0, limit),
        });
    });

    // [POST] /api/v1/hotel/getHistoryBookingByUser
    getHistoryBookingByUser = asyncHandle(async (req, res, next) => {
        const { idUser } = req.body;

        const user = await User.findById(idUser);

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        const bookedHotels = await Hotel.find({
            _id: { $in: user.historyBooking },
        })
            .populate("utils")
            .populate("province")
            .populate("district");

        return res.status(200).json({
            success: true,
            data: bookedHotels,
        });
    });

    // [POST] /api/v1/hotel/getNewHotel
    getNewHotel = asyncHandle(async (req, res, next) => {
        const newHotels = await Hotel.find({})
            .populate("utils")
            .populate("province")
            .populate("district")
            .sort({ createDate: -1 })
            .limit(20);

        return res.status(200).json({
            success: true,
            data: newHotels,
        });
    });

    // [POST] /api/v1/hotel/getOutstandingHotel
    getOutstandingHotel = asyncHandle(async (req, res, next) => {
        const outstandingHotels = await Hotel.find({})
            .populate("utils")
            .populate("province")
            .populate("district")
            .sort({ totalBookings: -1, rating: -1 })
            .limit(20);

        return res.status(200).json({
            success: true,
            data: outstandingHotels,
        });
    });

    // [POST] /api/v1/hotel/addImageHotel
    addImageHotel = asyncHandle(async (req, res, next) => {
        const idHotel = req.body.idHotel;
        const linkImg = req.body.linkImg;

        const hotel = await Hotel.findByIdAndUpdate(
            idHotel,
            { $push: { photo: { url: linkImg } } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: hotel,
        });
    });

    // [POST] /api/v1/hotel/deleteImageHotel
    deleteImageHotel = asyncHandle(async (req, res, next) => {
        const idHotel = req.body.idHotel;
        const idPhoto = req.body.idPhoto;

        const hotel = await Hotel.findByIdAndUpdate(
            idHotel,
            { $pull: { photo: { _id: idPhoto } } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: hotel,
        });
    });

    // [GET] /api/v1/hotel/getByIdPartner/:idPartner
    getByIdPartner = asyncHandle(async (req, res, next) => {
        const idPartner = req.params.idPartner;

        const hotel = await Hotel.findOne({
            idPartner: idPartner,
        })
            .populate("utils")
            .populate("province")
            .populate("district")
            .populate("communes");

        return res.status(200).json({
            success: true,
            data: hotel,
        });
    });
}

module.exports = new HotelController();
