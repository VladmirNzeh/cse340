const utilities = require("../utilities")
// Needed Resources
const express = require("express") // brings Express into the scope of the file.
const router = new express.Router() // uses Express to create a new Router object. Remember in lesson 2 that using separate router files for specific elements of the application would keep the server.js file smaller and more manageable? That's what we're doing.
const invController = require("../controllers/invController") // brings the inventory controller into this router document's scope to be used. 

const addValidate = require("../utilities/add-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build inventory by item id view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByItemId));

// Route to management view
router.get("/",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagementView)
);

// Route to add classification view

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassView));

// Route to add inventory view

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInvView));

// Process the add classification

router.post("/add-classification",
    addValidate.addClassRules(),
    addValidate.checkAddClassData,    
    utilities.handleErrors(invController.addClassification));

// Process the add inventory
router.post("/add-inventory",
    addValidate.addInvRules(),
    addValidate.checkAddInvData,   
    utilities.handleErrors(invController.addInventory)
);

// This route works with the URL in the inventory.js fil in js folder in public

router.get("/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
)

// Route to the edit view

router.get("/edit-inventory/:inv_id",
    utilities.handleErrors(invController.buildEditInventory)
)

// Process the edit inventory

router.post("/update/",
    addValidate.addInvRules(),
    addValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Route to the delete view

router.get("/delete-confirm/:inv_id",
    utilities.handleErrors(invController.buildDeleteConfirmationView)
)

// Process to delete inventory

router.post("/delete/",
    utilities.handleErrors(invController.deleteConfirmation)
)

router.get("/purchase/:inv_id",
    utilities.handleErrors(invController.buildPurchaseView)
)

module.exports = router;

