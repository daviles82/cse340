// Needed Resources
const express = require('express');
const router = new express.Router();
const invCont = require('../controllers/invController');
const utilities = require('../utilities/');
const inventoryValidate = require('../utilities/inventory-validation');
const accessValidation = require('../utilities/account-validation');




// Route to build inventory by classification view
router.get('/inv/type/:classificationId/', invCont.buildByClassificationId);

/* ***********************************
 * Deliver Vehicle Management View
 * Unit 4, deliver vehicle managment landing page
 * ******************************** */
router.get('/inv', accessValidation.accountType, utilities.handleErrors(invCont.vehicleManagement));


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

/* ***********************************
 * Get review update form
 * Unit 6
 * ******************************** */
router.get("/inventory/edit-review.ejs/:review_id", utilities.handleErrors(invCont.updateReview));

/* ***********************************
 * Get delete verification form
 * Unit 6
 * ******************************** */
router.get("/inventory/delete-review.ejs/:review_id", utilities.handleErrors(invCont.deleteReview));

/* ***********************************
 * Process review update
 * Unit 6
 * ******************************** */
router.post("/account/loggedAccount", utilities.handleErrors(invCont.updateReviewData));

/* ***********************************
 * Process review deletion
 * Unit 6
 * ******************************** */
router.post("/account", utilities.handleErrors(invCont.deleteReviewData));

module.exports = router;
