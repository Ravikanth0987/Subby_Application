const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path'); 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });
const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;
    const image = req.file ? req.file.filename : null;
    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

 
    if (vendor.firm.length > 0) {
      return res.status(400).json({ message: "vendor can have only one firm" });
    }

 
    const firm = new Firm({
      firmName,
      area,
      category: Array.isArray(category) ? category : [category],
      region: Array.isArray(region) ? region : [region],
      offer,
      image,
      vendor: vendor._id
    });

    const savedFirm = await firm.save();

  
    vendor.firm.push(savedFirm._id);
    await vendor.save();

    res.status(200).json({
      message: "Firm added successfully",
      firmId: savedFirm._id
    });

  } catch (error) {
    console.error("Error adding firm:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    const deletedFirm = await Firm.findByIdAndDelete(firmId);

    if (!deletedFirm) {
      return res.status(404).json({ message: "Firm not found" });
    }

    res.status(200).json({ message: "Firm deleted successfully" });
  } catch (error) {
    console.error("Error deleting firm:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addFirm: [upload.single('image'), addFirm],
  deleteFirmById
};
