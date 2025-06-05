// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

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

module.exports = router;