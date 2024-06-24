const express = require("express");
const router = express.Router();

const commentController = require("../app/controllers/CommentController");

router.post("/create", commentController.create);
router.put("/update/:id", commentController.update);
router.post("/delete", commentController.delete);
router.get("/getById/:id", commentController.getById);
router.post("/getByIdHotelandIdRoom", commentController.getByIdHotelandIdRoom);

module.exports = router;
