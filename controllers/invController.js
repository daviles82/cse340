const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

async function getData(classification_id) {
  return await invModel.getInventoryByClassificationId(classification_id);
}
/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await getData(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  const header = await utilities.getHeader();
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render('./inventory/classification', {
    title: className + ' vehicles',
    header,
    nav,
    grid,
  });
};

/* ****************************************
 * Deliver the Vehicle Mangagement page
 * Unit 4,
 * *************************************** */
invCont.vehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const header = await utilities.getHeader();
  const classificationSelect = await utilities.buildClassificationList()
  res.render('inventory/management', {
    title: 'Vehicle Management',
    header,
    nav,
    errors: null,
    classificationSelect,
  });
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInvItemView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const header = await utilities.getHeader();
  const itemData = await invModel.getInventoryById(inv_id);
  // console.log(itemData.inv_description);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    header,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInvItemView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const header = await utilities.getHeader();
  let nav = await utilities.getNav()
  let dropDown = await utilities.buildClassificationList();
  const itemData = await invModel.getInventoryById(inv_id);
  console.log(itemData.inv_description);
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    header,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    dropDown
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  const header = await utilities.getHeader();
  let nav = await utilities.getNav();
  const {
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
    classification_id,
  } = req.body
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

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    header,
    nav,
    classificationSelect: classificationSelect,
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

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  // let nav = await utilities.getNav()
  const {
    inv_id,
  } = req.body
  const deleteResult = await invModel.deleteInvModel(
    inv_id,
  )
  if (deleteResult) {
    req.flash("notice", `The delete was successfull.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", `The delete was unsuccessful.`)
    res.redirect("/inv/delete/" + parseInt(inv_id))
  }
}

module.exports = invCont
