const express = require("express");
const router = express.Router();

const PaymentController = require("../app/controllers/PaymentController");

router.post("/paypal", PaymentController.paypal);
router.get("/paypal-success", PaymentController.paypalSuccess);

module.exports = router;
