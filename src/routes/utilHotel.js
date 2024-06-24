const express = require("express");
const router = express.Router();

const utilHotelController = require("../app/controllers/UtilHotelConntroller");

router.post("/create", utilHotelController.create);
router.put("/update/:id", utilHotelController.update);
router.post("/delete", utilHotelController.delete);
router.get("/getById/:id", utilHotelController.getById);
router.get("/getAll", utilHotelController.getAll);

module.exports = router;
