const express = require("express");
const router = express.Router();

const authController = require("../app/controllers/AuthController");

router.post("/register", authController.register);
router.post("/createPartner", authController.createPartner);
router.post("/login", authController.login);
router.post("/verification", authController.verification);
router.post("/findOtp", authController.findOtp);
router.post("/changePasswordNew", authController.changePasswordNew);


module.exports = router;