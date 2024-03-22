const utilities = require('.');
const { body, validationResult } = require('express-validator');
const accountModel = require('../models/account-model'); // Part of team task

const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body('account_firstname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a first name.'), // on error this message is sent.

    // lastname is required and must be string
    body('account_lastname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('Please provide a last name.'), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    // Part of team task
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage('A valid email is required.')
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error('Email exists. Please log in or use different email');
        }
      }),

    // password is required and must be strong password
    body('account_password')
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements.'),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/register', {
      errors,
      title: 'Registration',
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the database
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage('A valid email is required.')
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (!emailExists) {
          console.log('does not exist');
          throw new Error(
            'Email does not exists. Please register or use different email'
          ); // Current
        } else {
          console.log('Success, email is correct!');
        }
      }),

    body('account_password').custom(async (account_password) => {
      const passwordCorrect = await accountModel.checkPassword(
        account_password
      );
      if (!passwordCorrect) {
        throw new Error(
          'Password is incorrect. Please click on "SHOW PASSWORD" for accuracy.'
        );
      } else {
        console.log('Success, password is correct!');
      }
    }),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
// Current
validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/login', {
      errors,
      title: 'Login',
      nav,
      account_email,
      account_password,
    });
    return;
  }
  next();
};

module.exports = validate;
