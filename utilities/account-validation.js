const utilities = require('.');
const { body, validationResult } = require('express-validator');
const accountModel = require('../models/account-model');



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
    const header = await utilities.getHeader();
    let nav = await utilities.getNav();
    res.render('account/register', {
      errors,
      title: 'Registration',
      header,
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
        }
        
      }),

  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body;
  let errors = [];
  errors = validationResult(req);
  const header = await utilities.getHeader();
  let nav = await utilities.getNav();
  if (!errors.isEmpty()) {
    res.render('account/login', {
      errors,
      title: 'Login',
      header,
      nav,
      account_email,
      account_password,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return account type
 * ***************************** */
validate.accountType = async (req, res, next) => {
  const account_type = (res.locals && res.locals.accountData && res.locals.accountData.account_type !== undefined) ? res.locals.accountData.account_type : 0;
  if (account_type === "Employee" || account_type === "Admin") {
    res.locals.linkaccount = '/account/updateAccount'
    res.locals.access = "Access"
    res.locals.accountData
    req.flash("notice", 'Access Granted')
    next()
  } else if (account_type === "Client") {
    res.locals.linkaccount = '/account/updateAccount'
    res.locals.accountData
    req.flash("notice", 'Limited Access Granted')
    next()
  }
  else {
    req.flash("notice", 'Access Denied, please log in.')
    res.redirect('/account/login')
  }
}

/*  **********************************
 *  Account Update Data Validation Rules
 * ********************************* */
validate.accountUpdateRules = () => {
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
      .isLength({ min: 1 })
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
        if (emailExists && body.account_email !== body.account_email) {
          throw new Error('Email exists. Please log in or use different email');
        }
      }),
  ];
};


validate.passwordUpdateRules = () => {
  return [
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
    ]
}

/* ******************************
 * Check data and return errors or continue to update account
 * ***************************** */
validate.checkAccountUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  const header = await utilities.getHeader();
  let nav = await utilities.getNav();
  if (!errors.isEmpty()) {
    res.render('account/updateAccount', {
      errors,
      title: 'Edit Account',
      header,
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* ******************************
 * Check update password rules
 * ***************************** */
validate.checkPasswordUpdate = async (req, res, next) => {
  const { account_password, account_type} = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const header = await utilities.getHeader();
    let nav = await utilities.getNav();
    res.render('account/updateAccount', {
      errors,
      title: 'Edit Account',
      header,
      nav,
      account_password,
      account_type
    });
    return;
  }
  next();
};

module.exports = validate;
