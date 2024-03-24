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

/* ***********************************
 * Deliver Add New Classification View
 * Unit 4, 
 * ******************************** */
router.get('/add-classification', utilities.handleErrors(invManCont.addClassification));

/* ***********************************
 * Deliver Add New Vehicle View
 * Unit 4, 
 * ******************************** */
router.get('/add-inventory', utilities.handleErrors(invManCont.addInventory));

/* ***********************************
 * Process Add New Classification
 * Unit 4, 
 * ******************************** */
router.post('/add-classification', utilities.handleErrors(invManCont.addClassificationToFile));

module.exports = router