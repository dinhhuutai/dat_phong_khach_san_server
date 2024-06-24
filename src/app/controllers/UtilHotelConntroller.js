const UtilHotel = require("../models/UtilHotel");
const asyncHandle = require("express-async-handler");

class UtilHotelController {
    // [POST] /api/v1/utilHotel/create
    create = asyncHandle(async (req, res, next) => {
        const utilHotel = new UtilHotel({
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
            createDate: Date.now(),
        });

        await utilHotel.save();

        res.status(200).json({
            success: true,
            utilHotel,
        });
    });

    // [PUT] /api/v1/utilHotel/update/:id
    update = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const utilHotel = await UtilHotel.findByIdAndUpdate(
            id,
            {
                ...req.body,
                updateDate: Date.now(),
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            utilHotel,
        });
    });

    // [POST] /api/v1/utilHotel/delete
    delete = asyncHandle(async (req, res, next) => {
        const { listId } = req.body;

        listId.map(async (id) => {
            await UtilHotel.findByIdAndDelete(id);
        });

        return res.status(200).json({
            success: true,
        });
    });

    // [GET] /api/v1/utilHotel/getById/:id
    getById = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const utilHotel = await UtilHotel.findById(id);

        return res.status(200).json({
            success: true,
            utilHotel,
        });
    });

    // [GET] /api/v1/utilHotel/getAll
    getAll = asyncHandle(async (req, res, next) => {
        const utilHotels = await UtilHotel.find();

        return res.status(200).json({
            success: true,
            data: utilHotels,
        });
    });
}

module.exports = new UtilHotelController();
