// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to deliver a specific inventory item detail view
router.get("/detail/:inventoryId", invController.getVehicleDetail)

// Route to deliver the inventory management view
router.get("/management", invController.buildManagementView);

// Route to add classification form
router.get("/add-classification", invController.buildAddClassificationView);

// Process classification form submission
router.post("/add-classification", invController.addClassification)

// Route add inventory form
router.get("/add-inventory", invController.buildAddInventoryView);

// Process inventory form submission
router.post("/add-inventory", invController.addInventory);

// New Route to work with the JavaScript file created
router.get("/inv/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

 
module.exports = router;