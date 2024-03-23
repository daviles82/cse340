// Needed Resources
const express = require('express');
const router = new express.Router();
const utilities = require('../utilities');
const invManCont = require('../controllers/managementController');

/* ***********************************
 * Deliver Vehicle Management View
 * Unit 4, deliver vehicle managment landing page
 * ******************************** */
router.get('/', utilities.handleErrors(invManCont.vehicleManagement));


router.get('/inv/add', utilities.handleErrors(invManCont.addClassification));

router.get('/inv/vehicle', utilities.handleErrors(invManCont.addInventory));

module.exports = router