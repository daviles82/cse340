// Needed Resources
const express = require('express');
const router = new express.Router();
const invCont = require('../controllers/invController');

// Route to build inventory by classification view
router.get('/inv/type/:classificationId/', invCont.buildByClassificationId);


module.exports = router;
