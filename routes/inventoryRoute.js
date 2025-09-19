const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
// const checkAccountType = require("../utilities/checkAccountType")
// const addValidate = require("../utilities/add-validation")

// Public Routes
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByItemId))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Inventory Management (Admin/Employee)
// router.get("/", checkAccountType, utilities.handleErrors(invController.buildManagementView))

// // Add Classification
// router.get("/add-classification", checkAccountType, utilities.handleErrors(invController.buildAddClassView))
// router.post("/add-classification",
//   checkAccountType,
//   addValidate.addClassRules(),
//   addValidate.checkAddClassData,
//   utilities.handleErrors(invController.addClassification)
// )

// Add Inventory
// router.get("/add-inventory", checkAccountType, utilities.handleErrors(invController.buildAddInvView))
// router.post("/add-inventory",
//   checkAccountType,
//   addValidate.addInvRules(),
//   addValidate.checkAddInvData,
//   utilities.handleErrors(invController.addInventory)
// )

// Edit Inventory
// router.get("/edit-inventory/:inv_id",
//   checkAccountType,
//   utilities.handleErrors(invController.buildEditInventory)
// )
// router.post("/update/",
//   checkAccountType,
//   addValidate.addInvRules(),
//   addValidate.checkUpdateData, // Make sure this exists in add-validation.js
//   utilities.handleErrors(invController.updateInventory)
// )

// // Delete Inventory
// router.get("/delete-confirm/:inv_id",
//   checkAccountType,
//   utilities.handleErrors(invController.buildDeleteConfirmationView)
// )
// router.post("/delete/",
//   checkAccountType,
//   utilities.handleErrors(invController.deleteConfirmation)
// )

module.exports = router
