const Hotel = require("../models/Hotel");
const asyncHandle = require("express-async-handler");
const User = require("../models/User");

class PageController {
    // [POST] /api/v1/page/home
    home = asyncHandle(async (req, res, next) => {
        const { idUser } = req.body;

        const user = await User.findById(idUser);

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        // Lấy tất cả khách sạn mà người dùng đã đặt
        const bookedHotels = await Hotel.find({
            _id: { $in: user.historyBooking },
        })
            .populate("province")
            .populate("district")
            .limit(5);

        const newHotels = await Hotel.find({})
            .populate("province")
            .populate("district")
            .sort({ createDate: -1 }) // Sắp xếp theo createDate giảm dần (mới nhất đầu danh sách)
            .limit(5);

        const outstandingHotels = await Hotel.find({})
            .populate("province")
            .populate("district")
            .sort({ totalBookings: -1, rating: -1 }) // Sắp xếp các khách sạn theo số lượng người đặt giảm dần và rating giảm dần
            .limit(5);

        const nearHotels = [];

        res.status(200).json({
            success: true,
            data: {
                bookedHotels,
                newHotels,
                outstandingHotels,
                nearHotels,
            },
        });
    });

    // [GET] /api/v1/page/history/:id
    history = asyncHandle(async (req, res, next) => {
        const idUser = req.params.id;

        const user = await User.findById(idUser);

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        // Lấy tất cả khách sạn mà người dùng đã đặt
        const bookedHotels = await Hotel.find({
            _id: { $in: user.historyBooking },
        })
            .populate("utils")
            .populate("province")
            .populate("district");

        res.status(200).json({
            success: true,
            data: bookedHotels,
        });
    });

    // [GET] /api/v1/page/favourite/:id
    favourite = asyncHandle(async (req, res, next) => {
        const idUser = req.params.id;

        const user = await User.findById(idUser);

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        // Lấy tất cả khách sạn mà người dùng đã like
        const favouriteHotels = await Hotel.find({
            _id: { $in: user.favouriteHotel },
        })
            .populate("utils")
            .populate("province")
            .populate("district");

        res.status(200).json({
            success: true,
            data: favouriteHotels,
        });
    });
}

module.exports = new PageController();
