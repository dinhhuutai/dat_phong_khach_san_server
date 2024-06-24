const express = require("express");
const router = express.Router();

const pageController = require("../app/controllers/PageController");

router.post("/home", pageController.home);
router.get("/history/:id", pageController.history);
router.get("/favourite/:id", pageController.favourite);

module.exports = router;
