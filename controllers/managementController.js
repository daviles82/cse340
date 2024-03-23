const utilities = require('../utilities');

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

module.exports = { vehicleManagement, addClassification, addInventory };
