const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Adding classification Validation Rules
  * ********************************* */

validate.addClassRules = () => {
    return [
        //classification name is required and must be a string
        body("classification_name")
          .trim()
          .escape()
          .notEmpty()
          .isLength({ min: 1})
          .withMessage("Please provide a classification name")
          .matches(/^\S*$/)
          .withMessage("Classification name cannot contain spaces")
    ]
}

/* ******************************
 * Check data and return errors or continue adding classification
 * ***************************** */

validate.checkAddClassData =async (req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add new classification",
            nav,
            classification_name,
            intError: "<a href= /error >Error link</a>",
        })
        return
    }
    next()
}

/*  **********************************
  *  Adding inventory Validation Rules
  * ********************************* */

validate.addInvRules = () =>{
    return [
        // classification_id is required
        body("classification_id")
          .trim()
          .escape()
          .notEmpty().withMessage("Select an option"),

        // inv_make is required with at least 3 character
        body("inv_make")
          .trim()
          .notEmpty().withMessage("Make is required")
          .isLength({
            min: 3,
          }).withMessage("Make must be at least 3 character long"),

        // Model is required with at least 3 character
        body("inv_model")
          .trim()
          .notEmpty().withMessage("Model is required")
          .isLength({
            min: 3,
          }).withMessage("Model must be at least 3 character long"),

        // Description is required
        body("inv_description")
          .trim()
          .notEmpty().withMessage("Description is required"),

        // Image path required

        body("inv_image")
          .trim()
          .escape()
          .notEmpty().withMessage("Image path is required"),

        // Thumbnail Image path required

        body("inv_thumbnail")
          .trim()
          .escape()
          .notEmpty().withMessage("Thumbnail path is required"),
        
        // Price is required

        body("inv_price")
          .trim()
          .escape()
          .notEmpty().withMessage("Price is required")
          .isFloat().withMessage("Price must be a valid number, integer or decimal"),
        
        // Year is required

        body("inv_year")
          .trim()
          .escape()
          .notEmpty().withMessage("Year is required")
          .isLength({min:4, max:4}).withMessage("Year must be 4 digits"),
        
        // Miles is required

        body("inv_miles")
          .trim()
          .escape()
          .notEmpty().withMessage("Miles is required")
          .matches(/^\d+$/).withMessage("Must contain only digits (0-9)"),

        // Color is required

        body("inv_color")
          .trim()
          .escape()
          .notEmpty().withMessage("Color is required")
                  
    ]
}

validate.checkAddInvData = async (req, res, next) => {
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
    let errors = []

    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let optionsList = await utilities.dropDownClassList(classification_id)    
        let nav = await utilities.getNav()    
        const intError = "<a href= /error >Error link</a>"
        res.render("./inventory/add-inventory", {
            errors,
            title: "Add new vehicle",
            nav,
            optionsList,
            classification_id, 
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_year, 
            inv_miles, 
            inv_color,
            intError,
        })
        return
    }
    next()
}



validate.checkUpdateData = async (req, res, next) => {
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id} = req.body
    let errors = []

    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let optionsList = await utilities.dropDownClassList(classification_id)    
        let nav = await utilities.getNav()    
        const intError = "<a href= /error >Error link</a>"
        res.render("./inventory/edit-inventory", {
            errors,
            title: `Edit ${inv_make} ${inv_model}`,
            nav,
            optionsList,
            classification_id, 
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_year, 
            inv_miles, 
            inv_color,
            inv_id,
            intError,
        })
        return
    }
    next()
}
module.exports = validate