const invModel = require('../models/inventory-model');
const Util = {};
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* *************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<ul>';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li>';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      '</a>';
    list += '</li>';
  });
  list += '</ul>';
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li>';
      grid +=
        '<a href="./' +
        vehicle.classification_id +
        '/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid +=
        '<a href="./' +
        vehicle.classification_id +
        '/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        '</a>';
      grid += '</h2>';
      grid +=
        '<span>$' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
        '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the individual view HTML
 * ************************************ */
Util.buildIndividualGrid = async function (data) {
  let vehAmount = [data];
  let vehicle = data;
  let grid;
  if (vehAmount.length === 1) {
    let link = './' + vehicle.inv_id;
    grid = '<div id="individual-display">';
    // grid += '<li>';
    grid +=
      '<a href="' +
      link +
      '" title="View ' +
      vehicle.inv_make +
      ' ' +
      vehicle.inv_model +
      ' details"><img src="' +
      vehicle.inv_image +
      '" alt="Image of ' +
      vehicle.inv_make +
      ' ' +
      vehicle.inv_model +
      ' on CSE Motors" /></a>';
    grid += '<div class="itemDetails">';
    grid += '<h2>';
    grid +=
      '<a href="' +
      link +
      '" title="View ' +
      vehicle.inv_make +
      ' ' +
      vehicle.inv_model +
      ' details">' +
      vehicle.inv_make +
      ' ' +
      vehicle.inv_model +
      ' Details</a>';
    grid += '</h2>';
    grid +=
      '<h3><span class="descText">Price:</span> $' +
      new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
      '</h3>';
    grid +=
      '<p><span class="descText">Description: </span>' +
      vehicle.inv_description +
      '</p>';
    grid +=
      '<h4><span class="descText">Color: </span>' + vehicle.inv_color + '</h4>';
    grid +=
      '<h5><span class="descText">Miles: </span>' + vehicle.inv_miles.toLocaleString() + '</h5>';
    grid += '</div>';
    // grid += '</li>';
    grid += '</div>';
  } else {
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>';
  }
  return grid;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "required value='<%= locals.inv_description %>'</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in #utilities index line 176")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
