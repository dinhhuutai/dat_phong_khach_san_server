const Room = require("../models/Room");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const asyncHandle = require("express-async-handler");

class RoomController {
    // [POST] /api/v1/room/create
    create = asyncHandle(async (req, res, next) => {
        const room = new Room({
            ...req.body,
            status: 1,
            createDate: Date.now(),
        });

        let hotel = await Hotel.findById(req.body.idHotel);
        if (req.body.maxPeople > hotel.maxPeople) {
            hotel.maxPeople = req.body.maxPeople;
            await hotel.save();
        }
        if (req.body.price > hotel.priceMax || hotel.priceMax === 0) {
            hotel.priceMax = req.body.price;
            await hotel.save();
        }
        if (req.body.price < hotel.priceMin || hotel.priceMin === 0) {
            hotel.priceMin = req.body.price;
            await hotel.save();
        }

        await room.save();

        res.status(200).json({
            success: true,
            data: room,
        });
    });

    // [PUT] /api/v1/room/update/:id
    update = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const room = await Room.findByIdAndUpdate(
            id,
            {
                ...req.body,
                updateDate: Date.now(),
            },
            { new: true }
        ).populate("utils");

        return res.status(200).json({
            success: true,
            data: room,
        });
    });

    // [POST] /api/v1/room/delete
    delete = asyncHandle(async (req, res, next) => {
        const { listId } = req.body;

        listId.map(async (id) => {
            await Room.findByIdAndDelete(id);
        });

        return res.status(200).json({
            success: true,
        });
    });

    // [GET] /api/v1/room/getById/:id
    getById = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const room = await Room.findById(id)
            .populate("utils")
            .populate("idHotel")
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
            data: room,
        });
    });

    // [POST] /api/v1/room/getByHotel
    getByHotel = asyncHandle(async (req, res, next) => {
        const { idHotel } = req.body;

        console.log(idHotel);

        const rooms = await Room.find({ idHotel }).populate({
            path: "idHotel",
            select: "address", // Chỉ lấy trường address của khách sạn
        });

        console.log("123:::::", rooms);

        return res.status(200).json({
            success: true,
            data: rooms,
        });
    });

    // [POST] /api/v1/room/getByDateAndQuantityPeople
    getByDateAndQuantityPeople = asyncHandle(async (req, res, next) => {
        const { idHotel, date, quantityPeople, limit } = req.body;

        let rooms = await Room.find({
            idHotel,
            maxPeople: {
                $gte: quantityPeople.adult * 1 + quantityPeople.kid * 1,
            },
        });

        const roomIds = rooms.map((h) => h._id);

        const bookings = await Booking.find({
            checkOut: { $gte: new Date() }, // Lọc các đặt phòng có checkOut lớn hơn hiện tại
            idRoom: { $in: roomIds }, // Lọc các đặt phòng có idRoom nằm trong danh sách các _id của phòng
            $or: [
                { checkOut: { $lte: date.checkIn } }, // Ngày check-out của tìm kiếm nhỏ hơn hoặc bằng ngày check-in của đặt phòng
                { checkIn: { $gte: date.checkOut } }, // Ngày check-in của tìm kiếm lớn hơn hoặc bằng ngày check-out của đặt phòng
            ],
        });

        const roomIdsInBookings = bookings.map((booking) => booking.idRoom);

        if (roomIdsInBookings.length > 0) {
            rooms = rooms.filter((h) => roomIdsInBookings.includes(h._id));
        }

        return res.status(200).json({
            success: true,
            data: rooms.slice(0, limit),
        });
    });

    // [DELETE] /api/v1/room/deleteRoom
    deleteRoom = asyncHandle(async (req, res, next) => {
        const { idRoom } = req.body;

        const rooms = await Room.deleteOne({ _id: idRoom });

        return res.status(200).json({
            success: true,
        });
    });

    // [POST] /api/v1/room/changeStatus
    changeStatus = asyncHandle(async (req, res, next) => {
        const { idRoom, status } = req.body;

        const room = await Room.findByIdAndUpdate(
            idRoom,
            {
                status: status,
            },
            { new: true }
        )
            .populate("utils")
            .populate("idHotel")
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
            data: room,
        });
    });

    // [POST] /api/v1/room/addImageRoom
    addImageRoom = asyncHandle(async (req, res, next) => {
        const idRoom = req.body.idRoom;
        const linkImg = req.body.linkImg;

        console.log(idRoom);
        console.log(linkImg);

        const room = await Room.findByIdAndUpdate(
            idRoom,
            { $push: { photo: { url: linkImg } } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: room,
        });
    });

    // [POST] /api/v1/room/deleteImageRoom
    deleteImageRoom = asyncHandle(async (req, res, next) => {
        const idRoom = req.body.idRoom;
        const idPhoto = req.body.idPhoto;

        const room = await Room.findByIdAndUpdate(
            idRoom,
            { $pull: { photo: { _id: idPhoto } } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: room,
        });
    });
}

module.exports = new RoomController();
