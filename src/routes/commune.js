const express = require("express");
const router = express.Router();

const communeController = require("../app/controllers/CommuneController");

router.post("/create", communeController.create);
router.put("/update/:id", communeController.update);
router.post("/delete", communeController.delete);
router.get("/getById/:id", communeController.getById);
router.post("/getByDistrict", communeController.getByDistrict);

module.exports = router;
