const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();
const secretKey = process.env.WhatIsYourname;

const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("📥 Received Data:", req.body);

  try {
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = new Vendor({ username, email, password: hashedPassword });
    await newVendor.save();

    res.status(201).json({ message: "Vendor registered successfully" });
    console.log('Vendor registered:', email);
  } catch (err) {
    console.error("❌ Error in vendorRegister:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ Vendor_Id: vendor._id }, secretKey, { expiresIn: "1h" });

    res.status(200).json({
      success: "Login successful",
      token: token,
      vendorId: vendor._id
    });

    console.log(email, "Token generated:", token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('firm');
    res.json({ vendors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getVendorById = async (req, res) => {
  const vendorId = req.params.id;
  console.log("Fetching vendor with ID:", vendorId);

  try {
    const vendor = await Vendor.findById(vendorId).populate('firm');
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.status(200).json({ vendor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  vendorRegister,
  vendorLogin,
  getAllVendors,
  getVendorById
};