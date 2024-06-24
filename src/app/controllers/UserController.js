const User = require("../models/User");
const Hotel = require("../models/Hotel");
const asyncHandle = require("express-async-handler");

class UserController {
    // [POST] /api/v1/user/create
    create = asyncHandle(async (req, res, next) => {
        const user = new User({
            ...req.body,
            createDate: Date.now(),
        });

        await user.save();

        res.status(200).json({
            success: true,
            user,
        });
    });

    // [PUT] /api/v1/user/update/:id
    update = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const user = await User.findByIdAndUpdate(
            id,
            {
                ...req.body,
                updateDate: Date.now(),
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            user,
        });
    });

    // [POST] /api/v1/user/delete
    delete = asyncHandle(async (req, res, next) => {
        const { listId } = req.body;

        listId.map(async (id) => {
            await User.findByIdAndDelete(id);
        });

        return res.status(200).json({
            success: true,
        });
    });

    // [GET] /api/v1/user/getById/:id
    getById = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const user = await User.findById(id);

        return res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                avatar: user.avatar,
                isVerification: user.isVerification,
                isAdmin: user.isAdmin,
                payments: user.payments,
                createDate: user.createDate,
            },
        });
    });

    // [GET] /api/v1/user/getListLike/:id
    getListLike = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const user = await User.findById(id);

        return res.status(200).json({
            success: true,
            data: user.favouriteHotel,
        });
    });

    // [PUT] /api/v1/user/likeHotel
    likeHotel = asyncHandle(async (req, res, next) => {
        const { idUser, idHotel, statusLike } = req.body;

        const key = statusLike ? "$push" : "$pull";

        const user = await User.findByIdAndUpdate(
            idUser,
            { [key]: { favouriteHotel: idHotel } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: user.favouriteHotel,
        });
    });

    // [POST] /api/v1/user/addPayment/:id
    addPayment = asyncHandle(async (req, res, next) => {
        const { name, numCard, exp, cvv } = req.body;
        const id = req.params.id;

        const date = new Date(exp.year + 2000, exp.month, 1);

        // Tìm người dùng dựa trên userId
        let user = await User.findById(id);

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            throw new Error("User not found");
        }

        if (user.payments.length >= 3) {
            throw new Error(
                "Maximum number of payments reached (3). Cannot add more."
            );
        }

        // Thêm thanh toán mới vào mảng payments
        user.payments.unshift({
            numCard,
            name,
            exp: date,
            cvv,
        });

        // Lưu thông tin người dùng với thanh toán mới
        await user.save();

        user = await User.findById(id);

        return res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                avatar: user.avatar,
                isVerification: user.isVerification,
                isAdmin: user.isAdmin,
                payments: user.payments,
                createDate: user.createDate,
            },
        });
    });

    // [POST] /api/v1/user/findPartner
    findPartner = asyncHandle(async (req, res, next) => {
        const limit = req.query.limit;
        const skip = req.query.skip;
        const search = req?.query?.search;

        const name = Number(req?.query?.sortName);
        const releaseDate = Number(req?.query?.sortCreateDate);

        let sort = {};
        if (name === 1 || name === -1) {
            sort = { name: name };
        } else if (releaseDate === 1 || releaseDate === -1) {
            sort = { createDate: releaseDate };
        }

        try {
            const partner = await User.find({
                role: 2,
                $or: [{ name: { $regex: new RegExp(search, "i") } }],
            })
                .sort(sort)
                .limit(limit)
                .skip(skip);

            const totalPartner = await User.find({
                role: 2,
                $or: [{ name: { $regex: new RegExp(search, "i") } }],
            }).count();

            return res.status(200).json({
                success: true,
                data: {
                    partner,
                    totalPartner,
                },
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    });

    // [POST] /api/v1/user/deletePartner
    deletePartner = asyncHandle(async (req, res, next) => {
        try {
            console.log(req.body);
            const { listId } = req.body;

            listId.map(async (id) => {
                const resDelete = await User.findByIdAndUpdate(
                    id,
                    { status: 0 },
                    { new: true }
                );

                // if (resDelete) {
                //     const filename = await stringImage(resDelete.image);
                //     await cloudinary.uploader.destroy(filename);
                // }
            });

            return res.status(200).json({
                success: true,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    });

    // [POST] /api/v1/user/findDetailPartner/:idPartner
    findDetailPartner = asyncHandle(async (req, res, next) => {
        const idPartner = req.params.idPartner;

        try {
            const partner = await User.findById(idPartner);
            const hotel = await Hotel.findOne({ idPartner: idPartner });

            return res.status(200).json({
                success: true,
                data: {
                    partner,
                    hotel,
                },
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    });

    // [POST] /api/v1/user/activePartner/:idPartner
    activePartner = asyncHandle(async (req, res, next) => {
        try {
            const idPartner = req.params.idPartner;

            const res = await User.findByIdAndUpdate(
                idPartner,
                { status: 1 },
                { new: true }
            );

            return res.status(200).json({
                success: true,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    });
}

module.exports = new UserController();
