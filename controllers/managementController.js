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
  res.render('./inventory/add-inventory', {
    title: 'Add New Vehicle',
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Classification
 * *************************************** */
async function addClassificationToFile(req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const claResult = await inventoryModel.addClassificationToFile(
    classification_name
  );

  if (claResult) {
    req.flash(
      'notice',
      `Congratulations, you added a classification ${classification_name}. Please add a new vehicle.`
    );
    res.status(201).render('./inventory/add-inventory', {
      title: 'Add New Vehicle',
      nav,
    });
  } else {
    req.flash('notice', 'Sorry, adding the classification failed.');
    res.status(501).render('inventory/add-classification', {
      title: 'Add New Classification',
      nav,
    });
  }
}

module.exports = {
  vehicleManagement,
  addClassification,
  addInventory,
  addClassificationToFile,
};
