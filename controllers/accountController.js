/* ***********************************
 * Account Controller
 * Unit 4, deliver login view activity
 * ******************************** */
// Needed Resources
const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* ****************************************
 * Deliver login view
 * Unit 4, deliver login view activity
 * *************************************** */
async function buildLogin(req, res, next) {
  const header = await utilities.getHeader();
  let nav = await utilities.getNav();
  res.render('./account/login', {
    title: 'Login',
    header,
    nav,
    errors: null,
  });
}

/* ****************************************
 * Deliver accounts view
 * Unit 5,
 * *************************************** */
async function accountView(req, res, next) {
  const Access = res.locals.access === undefined ? '' : res.locals.access;
  const updateAccountlink = await
  res.locals.linkaccount === undefined ? '' : res.locals.linkaccount;
  const greeting = `Welcome ${res.locals.accountData.account_firstname}`
  const header = await utilities.getHeader();
  let nav = await utilities.getNav();
  res.render('./account/loggedAccount', {
    title: 'Account Management',
    greeting,
    updateAccountlink,
    header,
    Access,
    nav,
    errors: null,
  });
}

/* ****************************************
 * Deliver registration view
 * Unit 4, deliver register view activity
 * *************************************** */
async function buildRegister(req, res, next) {
  const header = await utilities.getHeader();
  let nav = await utilities.getNav();
  res.render('account/register', {
    title: 'Register',
    header,
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  const header = await utilities.getHeader();
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      'notice',
      'Sorry, there was an error processing the registration.'
    );
    res.status(500).render('account/register', {
      title: 'Registration',
      header,
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      'notice',
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render('account/login', {
      header,
      title: 'Login',
      nav,
      errors: null,
    });
  } else {
    req.flash('notice', 'Sorry, the registration failed.');
    res.status(501).render('account/register', {
      title: 'Registration',
      header,
      nav,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  const header = await utilities.getHeader();
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash('notice', 'Please check your credentials and try again.');
    res.status(400).render('account/login', {
      title: 'Login',
      header,
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === 'development') {
        res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie('jwt', accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      // Check this route
      return res.redirect('/account/loggedAccount');
    }
  } catch (error) {
    return new Error('Access Forbidden');
  }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  res.cookie('jwt', '', { httpOnly: true, maxAge: 1 });
  global.data2 = 0;
  res.redirect('/');
}

/* ****************************************
 * Deliver account edit view
 * Unit 5,
 * *************************************** */
async function accountEditView(req, res, next) {
  const account_id = res.locals.accountData.account_id;
  const accountData = await accountModel.getAccountByAccountId(account_id);
  const { account_firstname, account_lastname, account_email } = accountData;
  const header = await utilities.getHeader();
  let nav = await utilities.getNav();
  res.render('account/updateAccount', {
    title: 'Edit Account',
    header,
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Account Update
 * *************************************** */
async function editAccount(req, res, next) {
  const header = await utilities.getHeader();
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );

  if (updateResult) {
    req.flash(
      'notice',
      `Congratulations, you\'re updated your profile ${account_firstname}.`
    );
    res.status(201).redirect('/account/loggedAccount');
  } else {
    req.flash('notice', 'Sorry, the update failed.');
    res.status(501).render('account/loggedAccount', {
      title: 'Account Management',
      header,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process Password update
 * *************************************** */
async function updatePassword(req, res) {
  const header = await utilities.getHeader();
  let nav = await utilities.getNav();
  const {
    account_password,
    account_id
  } = req.body;
  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      'notice',
      'Sorry, there was an error processing the registration.'
    );
    res.status(500).render('account/updatePassword', {
      title: 'Edit Password',
      header,
      nav,
      errors: null,
    });
  }

  const updatePasswordResult = await accountModel.updatePasswordData(
    hashedPassword,
    account_id
  );

  const accountData = await accountModel.getAccountByAccountId(
    account_id
  );
  const {account_firstname } = accountData;

  if (updatePasswordResult) {
    req.flash(
      'notice',
      `Congratulations, you\'re updated your password ${account_firstname}.`
      );
    res.status(201).redirect('/account/loggedAccount');
  } else {
    req.flash('notice', `Sorry, the password update failed at ${account_id}.`);
    res.status(501).render('account/updateAccount', {
      title: 'Registration',
      header,
      nav,
      errors: null,
    });
  }
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  accountView,
  accountLogout,
  accountEditView,
  editAccount,
  updatePassword
};
