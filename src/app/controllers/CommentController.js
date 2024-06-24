const Comment = require("../models/Comment");
const asyncHandle = require("express-async-handler");
const Room = require("../models/Room");
const Hotel = require("../models/Hotel");
const mongoose = require("mongoose");

class CommentController {
    // [POST] /api/v1/comment/create
    create = asyncHandle(async (req, res, next) => {
        const comment = new Comment({
            ...req.body,
            createDate: Date.now(),
        });

        await comment.save();

        const result = await Comment.aggregate([
            {
                $match: {
                    idHotel: new mongoose.Types.ObjectId(req.body.idHotel),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                },
            },
        ]);

        const averageRating = result.length > 0 ? result[0].averageRating : 0;

        await Hotel.findByIdAndUpdate(req.body.idHotel, {
            rating: Math.round(averageRating * 10) / 10,
        });

        res.status(200).json({
            success: true,
            comment,
        });
    });

    // [PUT] /api/v1/comment/update/:id
    update = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const comment = await Comment.findByIdAndUpdate(
            id,
            {
                ...req.body,
                updateDate: Date.now(),
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            comment,
        });
    });

    // [POST] /api/v1/comment/delete
    delete = asyncHandle(async (req, res, next) => {
        const { listId } = req.body;

        listId.map(async (id) => {
            await Comment.findByIdAndDelete(id);
        });

        return res.status(200).json({
            success: true,
        });
    });

    // [GET] /api/v1/comment/getById/:id
    getById = asyncHandle(async (req, res, next) => {
        const id = req.params.id;

        const comment = await Comment.findById(id);

        return res.status(200).json({
            success: true,
            comment,
        });
    });

    // [POST] /api/v1/comment/getByIdHotelandIdRoom
    getByIdHotelandIdRoom = asyncHandle(async (req, res, next) => {
        const { idHotel, idRoom, limit } = req.body;

        const allRoomTemp = await Room.find({ idHotel });
        const allRoom = allRoomTemp.map((room) => ({
            _id: room._id,
            name: room.name,
        }));

        const query = {};
        if (idRoom !== 0 && idRoom !== "0") {
            query.idRoom = idRoom;
        }

        const comments = await Comment.find({ idHotel, ...query })
            .populate("idRoom", "name")
            .populate("idUser", "name")
            .limit(limit);

        res.status(200).json({
            success: true,
            data: {
                allRoom,
                comments,
            },
        });
    });
}

module.exports = new CommentController();
