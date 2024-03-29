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
  // console.log(data);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render('./inventory/classification', {
    title: className + ' vehicles',
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
  const classificationSelect = await utilities.buildClassificationList()
  res.render('inventory/management', {
    title: 'Vehicle Management',
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


module.exports = invCont
