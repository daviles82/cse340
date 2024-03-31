// Needed Resources
const express = require('express');
const router = new express.Router();
const invCont = require('../controllers/invController');
const utilities = require('../utilities/');
const inventoryValidate = require('../utilities/inventory-validation');




// Route to build inventory by classification view
router.get('/inv/type/:classificationId/', invCont.buildByClassificationId);

/* ***********************************
 * Deliver Vehicle Management View
 * Unit 4, deliver vehicle managment landing page
 * ******************************** */
router.get('/inv', utilities.handleErrors(invCont.vehicleManagement));


/* ***********************************
 * Get inventory for AJAX Route
 * Unit 5, Select inv item activity
 * ******************************** */
router.get("/inv/getInventory/:classification_id", utilities.handleErrors(invCont.getInventoryJSON))

/* ***********************************
 * Get edit form to modify
 * Unit 5, Select inv item to edit
 * ******************************** */
router.get("/inv/edit/:inv_id", utilities.handleErrors(invCont.editInvItemView))

/* ***********************************
 * Get delete form
 * Unit 5, Select inv item to delete
 * ******************************** */
router.get("/inv/delete/:inv_id", utilities.handleErrors(invCont.deleteInvItemView))

router.post("/inv/update/", 
inventoryValidate.inventoryRules(),
inventoryValidate.checkUpdateData,
utilities.handleErrors(invCont.updateInventory))

router.post("/inv/delete/", 
inventoryValidate.inventoryRules(),
// inventoryValidate.checkUpdateData,
utilities.handleErrors(invCont.deleteInventory))

module.exports = router;
