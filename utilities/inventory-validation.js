const utilities = require(".")
const { body, validationResult } = require("express-validator");
const inventoryModel = require("../models/inventory-model")



const validate = {}



/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
  return [
    // classification is required and must be selected
    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification within the dropdown."),

    // make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a make."), // on error this message is sent.

    // model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a model."), // on error this message is sent.

    // description is required and must be string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a description."), // on error this message is sent.

    // image is required and must be path
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide an image or an empty path."), // on error this message is sent.

    // image thumbnail is required and must be path
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide an image thumbnail or an empty path."), // on error this message is sent.

    // price is required and must be an integer
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isInt()
      .withMessage("Please provide a price."), // on error this message is sent.

    // year is required and must be a 4 digit integer
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4 })
      .isInt()
      .withMessage("Please provide a four digit year."), // on error this message is sent.

    // miles is required and must be an integer
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isInt()
      .withMessage("Please provide mileage."), // on error this message is sent.

    // color is required and must be string
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."), // on error this message is sent.
  ]
}

/* ******************************
 * Check data and return errors or continue inventory input
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {     
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let dropDown = await utilities.buildClassificationList();
    const header = await utilities.getHeader();
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      dropDown,
      header,
      nav,
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
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue edit input
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {     
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
    inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let dropDown = await utilities.buildClassificationList();
    const header = await utilities.getHeader();
    let nav = await utilities.getNav()
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      dropDown,
      header,
      nav,
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
      inv_id
    })
    return
  }
  next()
}

/*  **********************************
  *  Classification Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    // classification is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlpha()
      .isLength({ min: 1, max: 9 })
      .withMessage("Please provide a classification name with a max of 9 alpha characters.") 
      .custom(async (classification_name) => {
        const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification exists. Please use that classification or create a new one.")
        }
}),
  ]
}

/* ******************************
 * Check data and return errors or continue inventory input
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const {     
    classification_name
 } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const header = await utilities.getHeader();
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      header,
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate