const express = require("express");
const router = express.Router();

const notificationController = require("../app/controllers/NotificationController");

router.post("/create", notificationController.create);
router.get("/getByIdUser/:id", notificationController.getByIdUser);
router.post("/viewed/:id", notificationController.viewed);

module.exports = router;
