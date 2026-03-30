const express = require('express');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken'); 

const router = express.Router();

// Add firm
router.post('/add-firm', verifyToken, firmController.addFirm);

// Delete firm
router.delete('/:firmId', firmController.deleteFirmById);

module.exports = router;