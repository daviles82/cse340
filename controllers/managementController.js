const utilities = require('../utilities');
const inventoryModel = require('../models/inventory-model');

/* ****************************************
 * Deliver the Vehicle Mangagement page
 * Unit 4,
 * *************************************** */
async function vehicleManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render('inventory/management', {
    title: 'Vehicle Management',
    nav,
    errors: null,
  });
}

/* ****************************************
 * Deliver Add Classification view
 * Unit 4, deliver add classification view
 * *************************************** */
async function addClassification(req, res, next) {
  let nav = await utilities.getNav();
  res.render('./inventory/add-classification', {
    title: 'Add New Classification',
    nav,
    errors: null,
  });
}

/* ****************************************
 * Deliver add vehicle view
 * Unit 4, deliver add classification view
 * *************************************** */
async function addInventory(req, res, next) {
  let nav = await utilities.getNav();
  let dropDown = await utilities.buildClassificationList();
  res.render('./inventory/add-inventory', {
    title: 'Add New Vehicle',
    nav,
    dropDown,
    errors: null,
  });
}

/* ****************************************
 *  Process Classification
 * *************************************** */
async function addClassificationToFile(req, res) {
  let nav = await utilities.getNav();
  let dropDown = await utilities.buildClassificationList();
  const { classification_name } = req.body;
  const claResult = await inventoryModel.addClassificationToFile(
    classification_name
  );
  if (claResult) {
    req.flash(
      'notice',
      `Congratulations, you added a classification ${classification_name}. Please add a new vehicle.`
    );
    res.status(201).redirect('add-inventory');
  } else {
    req.flash('notice', 'Sorry, adding the classification failed.');
    res.status(501).render('./inventory/add-classification', {
      title: 'Add New Classification',
      nav,
    });
  }
}

/* ****************************************
 *  Process Add Inventory
 * *************************************** */
async function addInventoryToFile(req, res) {
  let nav = await utilities.getNav();
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
  } = req.body;

  const regResult = await inventoryModel.addInventoryToFile(
    classification_id,
    inv_make,
    inv_model,
    'inv_description',
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );

  if (regResult) {
    // console.log(regResult); // Testing errors with error in query
    req.flash(
      'notice',
      `Congratulations, you added a ${inv_year} ${inv_make} ${inv_model} to the database.`
    );
    res.status(201).redirect('/inv');
  } else {
    req.flash('notice', 'Sorry, adding the inventory failed.');
    res.status(501).render('inventory/add-inventory', {
      title: 'Add New Vehicle',
      nav,
      dropdown

    });
  }
}

module.exports = {
  vehicleManagement,
  addClassification,
  addInventory,
  addClassificationToFile,
  addInventoryToFile,
};
