const express = require("express");
const router = express.Router();

const roomController = require("../app/controllers/RoomController");

router.post("/create", roomController.create);
router.put("/update/:id", roomController.update);
router.post("/delete", roomController.delete);
router.get("/getById/:id", roomController.getById);
router.post("/getByHotel", roomController.getByHotel);
router.post(
    "/getByDateAndQuantityPeople",
    roomController.getByDateAndQuantityPeople
);
router.delete("/deleteRoom", roomController.deleteRoom);
router.post("/changeStatus", roomController.changeStatus);
router.post("/addImageRoom", roomController.addImageRoom);
router.post("/deleteImageRoom", roomController.deleteImageRoom);

module.exports = router;
