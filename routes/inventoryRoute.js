// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/');

// Route to build inventory by classification view
router.get(
  '/type/:classification_id',
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory item detail view
router.get(
  '/detail/:inv_id',
  utilities.handleErrors(invController.buildByInvId)
);

module.exports = router;
