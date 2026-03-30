const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

let otpStore = {};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const signupValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name required")
    .isLength({ min: 3 })
    .withMessage("Name must be 3+ chars"),

  body("email")
    .isEmail()
    .withMessage("Invalid email"),

  body("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone must be 10 digits"),
];

const phoneValidation = [
  body("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Invalid phone number"),
];

const otpValidation = [
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
];

router.post("/signup", signupValidation, validate, async (req, res) => {
  const { phone, name, email } = req.body;

  try {
    let user = await User.findOne({ phone });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ phone, name, email });
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/send-otp", phoneValidation, validate, async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: "Please register first" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[phone] = otp;

    console.log("OTP:", otp);

    res.json({ success: true, message: "OTP sent (check console)" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OTP failed" });
  }
});

router.post("/verify-otp", otpValidation, validate, async (req, res) => {
  const { phone, otp } = req.body;

  try {
    if (otpStore[phone] == otp) {
      delete otpStore[phone];

      const user = await User.findOne({ phone });

      return res.json({ success: true, user });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;