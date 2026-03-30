const { body } = require("express-validator");

exports.productValidation = [
  body("productName").notEmpty().withMessage("Product name required"),
  body("price").isNumeric().withMessage("Price must be number"),
  body("description")
    .isLength({ min: 5 })
    .withMessage("Description too short"),
];