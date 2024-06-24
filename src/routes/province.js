const express = require("express");
const router = express.Router();

const provinceController = require("../app/controllers/ProvinceController");

router.post("/create", provinceController.create);
router.put("/update/:id", provinceController.update);
router.post("/delete", provinceController.delete);
router.get("/getById/:id", provinceController.getById);
router.get("/getAll", provinceController.getAll);

module.exports = router;
