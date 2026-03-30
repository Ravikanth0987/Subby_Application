const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const path = require("path");

router.post("/add-product/:firmId", productController.addProduct);

router.get("/:firmId/products", productController.getProductByFirm);

router.delete("/:productId", productController.deleteProductById);

module.exports = router;