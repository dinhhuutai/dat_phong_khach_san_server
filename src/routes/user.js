const express = require("express");
const router = express.Router();

const userController = require("../app/controllers/UserController");

router.post("/create", userController.create);
router.put("/update/:id", userController.update);
router.post("/delete", userController.delete);
router.get("/getById/:id", userController.getById);
router.get("/getListLike/:id", userController.getListLike);
router.put("/likeHotel", userController.likeHotel);
router.post("/addPayment/:id", userController.addPayment);
router.post("/findPartner", userController.findPartner);
router.post("/findDetailPartner/:idPartner", userController.findDetailPartner);
router.post("/activePartner/:idPartner", userController.activePartner);
router.post("/deletePartner", userController.deletePartner);

module.exports = router;
