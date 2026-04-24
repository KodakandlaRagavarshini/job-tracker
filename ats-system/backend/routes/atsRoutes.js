const express = require('express');
const router = express.Router();
const atsController = require('../controllers/atsController');
const upload = require('../middleware/upload'); // Ensure this is available or we can use generic multer

router.post('/analyze', upload.single('resume'), atsController.analyzeResume);

module.exports = router;
