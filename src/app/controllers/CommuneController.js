const Commune = require("../models/Commune");
const asyncHandle = require("express-async-handler");

class CommuneController {
    // [POST] /api/v1/commune/create
    create = asyncHandle(async (req, res, next) => {
        const commune = new Commune({
            ...req.body,
            createDate: Date.now(),
        });

        await commune.save();

        res.status(200).json({
            success: true,
            commune,
        });
    });

    // [PUT] /api/v1/commune/update/:id
    update = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const commune = await Commune.findByIdAndUpdate(
            id,
            {
                ...req.body,
                updateDate: Date.now(),
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            commune,
        });
    });

    // [POST] /api/v1/commune/delete
    delete = asyncHandle(async (req, res, next) => {
        const { listId } = req.body;

        listId.map(async (id) => {
            await Commune.findByIdAndDelete(id);
        });

        return res.status(200).json({
            success: true,
        });
    });

    // [GET] /api/v1/commune/getById/:id
    getById = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const commune = await Commune.findById(id);

        return res.status(200).json({
            success: true,
            commune,
        });
    });

    // [POST] /api/v1/commune/getByDistrict
    getByDistrict = asyncHandle(async (req, res, next) => {
        const { idDistrict } = req.body;

        const communes = await Commune.find({ district: idDistrict });

        return res.status(200).json({
            success: true,
            communes,
        });
    });
}

module.exports = new CommuneController();
