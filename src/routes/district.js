const express = require("express");
const router = express.Router();

const districtController = require("../app/controllers/DistrictController");

router.post("/create", districtController.create);
router.put("/update/:id", districtController.update);
router.post("/delete", districtController.delete);
router.get("/getById/:id", districtController.getById);
router.post("/getByProvince", districtController.getByProvince);


module.exports = router;