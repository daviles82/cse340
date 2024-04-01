/* ***********************************
 * Account routes
 * Unit 4, deliver login view activity
 * ******************************** */
// Needed Resources
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');
const regValidate = require('../utilities/account-validation');
const validate = require('../utilities/account-validation');

/* ***********************************
 * Deliver Login View
 * Unit 4, deliver login view activity
 * ******************************** */
router.get('/login', utilities.handleErrors(accountController.buildLogin));

/* ***********************************
 * Deliver accounts View
 * Unit 5, 
 * ******************************** */
router.get('/loggedAccount', utilities.checkLogin, utilities.handleErrors(accountController.accountView));

/* ***********************************
 * Deliver Registration View
 * Unit 4, deliver registration view activity
 * ******************************** */
router.get(
  '/register',
  utilities.handleErrors(accountController.buildRegister)
);

/* ***********************************
 * Process Registration
 * Unit 4, process registration activity
 * ******************************** */
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);


// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the logout request
router.get(
  "/logout",
  accountController.accountLogout,
)

module.exports = router;
