const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* **********************
 * Build inventory by classification view
 * ******************** */
invCont.buildByClassificationId = async function(req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    if (!data || data.length === 0) {
      const nav = await utilities.getNav();
      const intError = "<a href='/error'>Error link</a>";
      return res.status(404).render("errors/error", {
        title: "Not Found",
        nav,
        message: "No vehicles found for this classification.",
        intError
      });
    }

    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0].classification_name;
    const intError = "<a href='/error'>Error link</a>";

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
      intError
    });
  } catch (error) {
    console.error("Controller error:", error.message);
    next(error);
  }
};

/* **********************
 * Build inventory by details view
 * ******************** */
invCont.buildByItemId = async function(req, res, next) {
  try {
    const inventory_Id = req.params.inventoryId;
    const data = await invModel.getDetailsByInventoryId(inventory_Id);

    if (!data || !data.inv_id) {
      const nav = await utilities.getNav();
      const intError = "<a href='/error'>Error link</a>";
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        nav,
        message: "Vehicle details not found.",
        intError
      });
    }

    const nav = await utilities.getNav();
    const intError = "<a href='/error'>Error link</a>";

    res.render("inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      vehicle: data,
      intError
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
