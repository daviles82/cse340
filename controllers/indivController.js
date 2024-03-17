const invModel = require('../models/inventory-model'); // change this code
const utilities = require('../utilities/');

const indivCont = {};

/* ***************************
 *  Build by individual view
 * ************************** */
indivCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const individualId = req.params.individualId * 1;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const findObjectByInvId = (arr, invId) => {
    return arr.find(obj => obj.inv_id === invId);
  };
  const foundObject = findObjectByInvId(data, individualId);
  const grid = await utilities.buildIndividualGrid(foundObject);
  // console.log(foundObject); // change this code
  let nav = await utilities.getNav();
  const className = data[0].classification_name; // change this code
  // res.send(`Individual ID: ${individualId}`); // change this code
  res.render('./inventory/individual', {
    title: className + ' vehicles', // change this code
    nav,
    grid,
  });
};

module.exports = indivCont;
