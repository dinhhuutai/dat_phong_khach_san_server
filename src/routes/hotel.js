const express = require("express");
const router = express.Router();

const hotelController = require("../app/controllers/HotelController");

router.post("/create", hotelController.create);
router.put("/update/:id", hotelController.update);
router.post("/delete", hotelController.delete);
router.get("/getById/:id", hotelController.getById);
router.post("/searchByName", hotelController.searchByName);
router.post("/getAllRoom", hotelController.getAllRoom);
router.post("/search", hotelController.search);
router.post(
    "/getHistoryBookingByUser",
    hotelController.getHistoryBookingByUser
);
router.post("/getNewHotel", hotelController.getNewHotel);
router.post("/getOutstandingHotel", hotelController.getOutstandingHotel);
router.post("/addImageHotel", hotelController.addImageHotel);
router.post("/deleteImageHotel", hotelController.deleteImageHotel);
router.get("/getByIdPartner/:idPartner", hotelController.getByIdPartner);

module.exports = router;
