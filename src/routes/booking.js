const express = require("express");
const router = express.Router();

const bookingController = require("../app/controllers/BookingController");

router.post("/create", bookingController.create);
router.put("/update/:id", bookingController.update);
router.post("/delete", bookingController.delete);
router.post("/cancel/:id", bookingController.cancel);
router.get("/getById/:id", bookingController.getById);
router.get("/getByIdUser/:id/:status", bookingController.getByIdUser);
router.post("/analytics", bookingController.analytics);
router.post("/findBookingsByDateAndStatus", bookingController.findBookingsByDateAndStatus);
router.post("/changeStatus", bookingController.changeStatus);
router.post("/revenue", bookingController.revenue);

module.exports = router;
