// Needed Resources
const express = require('express');
const router = new express.Router();
const invCont = require('../controllers/invController')

// Route to build individual classification view
router.get(
  '/inv/type/:classificationId/detail/:individualId',
  invCont.buildByItemId
);

router.post(
  '/inv/type/:classificationId/detail/:individualId',
  invCont.inPageReviewData
);

module.exports = router;
