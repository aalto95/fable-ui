const express = require("express");
const itemController = require("../controllers/itemController");
const validateItem = require("../validators/itemValidator");

const router = express.Router();

router.post("/save", validateItem, itemController.saveItem);

module.exports = router;
