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
  console.log(className);
  res.render('./inventory/classification', {
    title: className + ' vehicles',
    nav,
    grid,
  });
};


module.exports = invCont
