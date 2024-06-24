const District = require("../models/District");
const asyncHandle = require("express-async-handler");

class DistrictController {
    // [POST] /api/v1/district/create
    create = asyncHandle(async (req, res, next) => {
        const district = new District({
            ...req.body,
            createDate: Date.now(),
        });

        await district.save();

        res.status(200).json({
            success: true,
            district,
        });
    });

    // [PUT] /api/v1/district/update/:id
    update = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const district = await District.findByIdAndUpdate(
            id,
            {
                ...req.body,
                updateDate: Date.now(),
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            district,
        });
    });

    // [POST] /api/v1/district/delete
    delete = asyncHandle(async (req, res, next) => {
        const { listId } = req.body;

        listId.map(async (id) => {
            await District.findByIdAndDelete(id);
        });

        return res.status(200).json({
            success: true,
        });
    });

    // [GET] /api/v1/district/getById/:id
    getById = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const district = await District.findById(id);

        return res.status(200).json({
            success: true,
            district,
        });
    });

    // [POST] /api/v1/district/getByProvince
    getByProvince = asyncHandle(async (req, res, next) => {
        const { idProvince } = req.body;

        const districts = await District.find({ province: idProvince });

        return res.status(200).json({
            success: true,
            districts,
        });
    });
}

module.exports = new DistrictController();
