const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

// Route to trigger an intentional error
router.get('/trigger-error', errorController.triggerError);

module.exports = router;