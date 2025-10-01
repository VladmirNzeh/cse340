const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* **********************
 * Build inventory by classification view
 * ******************** */
invCont.buildByClassificationId = async function(req, res, next) {
    const classification_id = req.params.classificationId
    console.log(`this is the classification ${classification_id}`)
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    const intError = "<a href= /error >Error link</a>"
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        intError,
    })
}

/* **********************
 * Build inventory by details view
 * ******************** */

invCont.buildByItemId = async function(req, res, next) {
    const inventory_Id = req.params.inventoryId
    console.log(`this is the item Id ${inventory_Id}`)
    const data = await invModel.getDetailsByInventoryId(inventory_Id)
    console.log(data)
    const grid = await utilities.buildInventoryGrid(data)
    let nav = await utilities.getNav()
    const year = data[0].inv_year
    const make = data[0].inv_make
    const model = data[0].inv_model
    const intError = "<a href= /error >Error link</a>"
    res.render("./inventory/detail", {
        title: `${year }${make }${model}`,
        nav,
        grid,
        intError,
    })

}

/* **********************
 * Management  view
 * ******************** */

invCont.buildManagementView = async function(req, res, next) {
    let nav = await utilities.getNav()
    const intError = "<a href= /error >Error link</a>"
    const newClass = "<a id= vmanagec href= /inv/add-classification >Add new Classification</a>"
    const newVehi = "<a id= vmanage href= /inv/add-inventory >Add new Vehicle</a>"
    const classificationSelect = await utilities.dropDownClassList()
    res.render("./inventory/", {
        title: "Vehicle management",
        nav,
        newClass,
        newVehi,
        classificationSelect,
        intError,
        errors: null,
    })
}

/* **********************
 * Add classification view
 * ******************** */

invCont.buildAddClassView = async function(req, res, next) {
    let nav = await utilities.getNav()
    const intError = "<a href= /error >Error link</a>"
    res.render("./inventory/add-classification", {
        title: "Add new classification",
        nav,
        intError,
        errors: null,
    })
}

/* **********************
 * Add vehicle view
 * ******************** */
invCont.buildAddInvView = async function(req, res, next) {
    let optionsList = await utilities.dropDownClassList()    
    let nav = await utilities.getNav()    
    const intError = "<a href= /error >Error link</a>"
    res.render("./inventory/add-inventory", {
        title: "Add new vehicle",
        nav,
        optionsList,
        intError,
        errors: null,
        classificationSelect: optionsList
    })
}

/* **********************
 * Process add classification
 * ******************** */

invCont.addClassification= async function(req,res) {
    
    const {classification_name,} = req.body

    const addingResult = await invModel.addClassification(classification_name)

    if(addingResult) {
        req.flash(
            "notice",
            `The ${classification_name} classification was succesfully added.`
        )
        let nav = await utilities.getNav()
        const classificationSelect = await utilities.dropDownClassList()
        res.status(201).render("inventory/",{
            title: "Vehicle management",
            nav,
            newClass: "<a id= vmanagec href= /inv/add-classification >Add new Classification</a>",
            newVehi: "<a id= vmanage href= /inv/add-inventory >Add new Vehicle</a>",
            intError: "<a href= /error >Error link</a>",
            errors: null,
            classificationSelect

        })
    } else {
        req.flash("notice", "Sorry, the process to add classification failed.")
        let nav = await utilities.getNav()
        res.status(501).render("inventory/add-classification", {
            title: "Add new classification",
            nav,
            intError: "<a href= /error >Error link</a>",
            errors: null,
        })
    }
}


/* **********************
 * Process add inventory
 * ******************** */

invCont.addInventory= async function(req,res) {
    
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body

    const addingResult = await invModel.addInventory(
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
    )

    if(addingResult) {
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} was succesfully added.`
        )
        let nav = await utilities.getNav()
        const classificationSelect = await utilities.dropDownClassList()
        res.status(201).render("inventory/",{
            title: "Vehicle management",
            nav,
            newClass: "<a id= vmanagec href= /inv/add-classification >Add new Classification</a>",
            newVehi: "<a id= vmanage href= /inv/add-inventory >Add new Vehicle</a>",
            intError: "<a href= /error >Error link</a>",
            errors: null,
            classificationSelect
            
        })
    } else {
        req.flash("notice", "Sorry, the process to add vehicle failed.")
        let nav = await utilities.getNav()
        let optionsList = await utilities.dropDownClassList()       
        const intError = "<a href= /error >Error link</a>"
        res.status(501).render("inventory/add-inventory", {
            title: "Add new vehicle",
            nav,
            optionsList,
            intError,
            errors: null,
        })
    }
}

/* **********************
 * return Inventory by Classification As JSON   
 * ******************** */

invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* **********************
 * Build the edit inventory view   
 * ******************** */

invCont.buildEditInventory= async function(req,res, next) {
    const inv_id = parseInt(req.params.inv_id);
    console.log(inv_id)    
    let nav = await utilities.getNav()
    const itemData = await invModel.getDetailsByInventoryId(inv_id)
    console.log(itemData)
    const classificationSelect = await utilities.dropDownClassList(itemData[0].classification_id)
    const itemName = ` ${itemData[0].inv_make} ${ itemData[0].inv_model}`
    const intError = "<a href= /error >Error link</a>"
    res.render("inventory/edit-inventory",{
        title: "Edit" + itemName,
        nav,
        optionsList: classificationSelect,
        errors: null,
        inv_id: itemData[0].inv_id,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_year: itemData[0].inv_year,
        inv_description: itemData[0].inv_description,
        inv_image: itemData[0].inv_image,
        inv_thumbnail: itemData[0].inv_thumbnail,
        inv_price: itemData[0].inv_price,
        inv_miles: itemData[0].inv_miles,
        inv_color: itemData[0].inv_color,
        classification_id: itemData[0].classification_id,
        intError

    })
}


/* **********************
 * Process update inventory
 * ******************** */

invCont.updateInventory= async function(req,res, next) {
    let nav = await utilities.getNav()    
    const {inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id} = req.body

    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )



    if(updateResult) {
        const itemName = updateResult.inv_make + "" + updateResult.inv_model
        req.flash(
            "notice",
            `The ${itemName} was succesfully updated.`
        )
        
        res.redirect("/inv/")
    } else {
        req.flash("notice", "Sorry, the insert failed.")
        const itemName = `${inv_make} ${inv_model}`
        let classificationSelect = await utilities.dropDownClassList(classification_id)       
        const intError = "<a href= /error >Error link</a>"
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit" + itemName,
            nav,
            optionsList: classificationSelect,
            intError,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}


/* **********************
 * Build the delete confirmation view   
 * ******************** */

invCont.buildDeleteConfirmationView = async function(req,res, next) {
    const inv_id = parseInt(req.params.inv_id);
    console.log(inv_id)    
    let nav = await utilities.getNav()
    const itemData = await invModel.getDetailsByInventoryId(inv_id)
    console.log(itemData)
    const itemName = ` ${itemData[0].inv_make} ${ itemData[0].inv_model}`
    const intError = "<a href= /error >Error link</a>"
    res.render("inventory/delete-confirm",{
        title: "Edit" + itemName,
        nav,
        errors: null,
        inv_id: itemData[0].inv_id,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_year: itemData[0].inv_year,
        inv_price: itemData[0].inv_price,
        intError

    })
}


/* **********************
 * Process delete confirmation
 * ******************** */

invCont.deleteConfirmation = async function(req,res, next) {
    let nav = await utilities.getNav()    
    const {inv_id} = req.body

    const deleteResult = await invModel.deleteConfirmation(inv_id)

    if(deleteResult) {
        req.flash(
            "notice",
            `The inventory item was succesfully deleted.`
        )
        
        res.redirect("/inv/")
    } else {
        req.flash("notice", "Sorry, the delete failed.")
        
        res.redirect("inventory/delete-confirm")
    }
}


/* **********************
 * Build purchase view
 * ******************** */

invCont.buildPurchaseView = async function(req, res, next) {
    const inv_id = req.params.inv_id
    console.log(`this is the item Id ${inv_id}`)
    const data = await invModel.getDetailsByInventoryId(inv_id)
    console.log(data)
    const grid = await utilities.buildPurchaseGrid(data)
    let nav = await utilities.getNav()
    const year = data[0].inv_year
    const make = data[0].inv_make
    const model = data[0].inv_model
    const intError = "<a href= /error >Error link</a>"
    res.render("inventory/purchase", {
        title: `${year }${make }${model}`,
        nav,
        grid,
        intError,
    })

}


module.exports = invCont

