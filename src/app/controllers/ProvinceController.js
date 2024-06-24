const Province = require("../models/Province");
const asyncHandle = require("express-async-handler");

class ProvinceController {
    // [POST] /api/v1/province/create
    create = asyncHandle(async (req, res, next) => {
        const province = new Province({
            ...req.body,
            createDate: Date.now(),
        });

        await province.save();

        res.status(200).json({
            success: true,
            province,
        });
    });

    // [PUT] /api/v1/province/update/:id
    update = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const province = await Province.findByIdAndUpdate(
            id,
            {
                ...req.body,
                updateDate: Date.now(),
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            province,
        });
    });

    // [POST] /api/v1/province/delete
    delete = asyncHandle(async (req, res, next) => {
        const { listId } = req.body;

        listId.map(async (id) => {
            await Province.findByIdAndDelete(id);
        });

        return res.status(200).json({
            success: true,
        });
    });

    // [GET] /api/v1/province/getById/:id
    getById = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const province = await Province.findById(id);

        return res.status(200).json({
            success: true,
            province,
        });
    });

    // [GET] /api/v1/province/getAll
    getAll = asyncHandle(async (req, res, next) => {
        const provinces = await Province.find();

        return res.status(200).json({
            success: true,
            provinces,
        });
    });
}

module.exports = new ProvinceController();
