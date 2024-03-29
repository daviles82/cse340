// Needed Resources
const express = require('express');
const router = new express.Router();
const invCont = require('../controllers/invController');
const utilities = require('../utilities/');



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

module.exports = router;
