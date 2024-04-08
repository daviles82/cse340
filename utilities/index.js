const invModel = require('../models/inventory-model');
const Util = {};
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

/* *************************
 * Constructs the header HTML
 ************************** */
Util.getHeader = async function (req, res, next) {
  if (global.data2 === 1) {
    var data3 = `logout">Logout`;
    global.data4;
    var managementView = `<div id="tools"><a title="Click to log in" href="/account/loggedAccount">Welcome ${global.data4}</a></div>`;
  } else {
    var data3 = `login">My Account`;
    managementView = '';
  }
  let list = `<header id="top-header">
  <span class="siteName">
    <a href="/" title="Return to home page">CSE Motors</a>
  </span>
  <div id="tools">`;
  list += `<a title="Click to log in" href="/account/`;
  list += data3;
  list += `</a></div>`;
  list += managementView;
  list += `</header>`;
  return list;
};

/* *************************
 * Constructs the Review HTML
 ************************** */
Util.buildReviewList = async function (req, res, next) {
  var invReviewData = await invModel.getReviewByInvId(req);
  let list = '<p id="reviewHeader">Customer Reviews</p><ul>';
  let reviewers = invReviewData.map(obj => obj.account_id);
  if (global.data2 === 1) {
    if (invReviewData.length === 0) {
      var reviewView =
        `<div id="firstReview"><span>Be the first to write a review.</span></div><div id="addReview"><span>Add Your Own Review</div>` +
        (await Util.builtInReviewForm(req));
      // console.log(`index.js line 65 ${invReviewData}`);
    } else {
      if(reviewers.includes(global.data5.account_id)) {
        reviewView = `<div id="reviewing"><a title="Click to edit review" href="/account/loggedAccount">Edit your review.</a></div>`;
      } else {
        reviewView = `<div id="reviewing"><a title="Click to edit review" href="/account/loggedAccount">Write your own review.</a></div>` + 
        (await Util.builtInReviewForm(req));
      }
    }
  } else {
    if (invReviewData.length > 0) {
      reviewView =
        '<div id="reviewing"><span>You must <a title="Log in to review" href="/account/login">login</a> to write a review.</span></div>';
    } else {
      reviewView =
        '<div id="firstReview"><span>Be the first to write a review.</span></div><div id="reviewing"><span>You must <a title="Log in to review" href="/account/login">login</a> to write a review.</span></div>';
    }
  }
  invReviewData.forEach((item) => {
    let oneReview = item.account_firstname.charAt(0) + item.account_lastname;
    list += '<li>';
    list +=
      `<div> ${oneReview} wrote on ` +
      `<span class="date" > ${item.review_date}</span>` +
      '<hr>' +
      item.review_text +
      '</div>';
    list += '</li><br>';
  });
  list += '</ul>';
  list += reviewView;
  return list;
};

/* **************************************
 * Build user view review list
 * ************************************ */
Util.userViewReviewList = async function (req, res, next) {
  var userReviews = await invModel.getUserReviews(req);
  userReviews.sort((a, b) => new Date(a.review_date) - new Date(b.review_date));
  var edit = edit
  let list = `<ul id="userReviews">`;
  if (userReviews){
    userReviews.forEach( (review, i) => {
      i += 1
      list +=
      `<li><span> ${i}. Reviewed the ${review.inv_year} ${review.inv_make} ${review.inv_model} on </span><span class="review_date">${review.review_date}</span> |<a href="/inventory/edit-review.ejs/${review.review_id}"> Edit</a> |<a href="/inventory/delete-review.ejs/${review.review_id}"> Delete</a></li>`;
      list += `<input hidden></input>`
    })
    list += `</ul>`
  } else {
    list = ' '
  }
  return list;
}


/* **************************************
 * Built in review form
 * ************************************ */
Util.builtInReviewForm = async function (req, res, next) {
  var inv_id = req;
    var oneReview =
      global.data5.account_firstname.charAt(0) + global.data5.account_lastname;
    var form = ` <form id="inPageReview" action="" method="post">
    <fieldset>
    <div>
      <label class="inForm" for="account_id">Screen Name</label><br>
      <input type="text" id="account_id" class="string" name="account_id" title="" readonly value="${oneReview}" disabled>
    </div>
    <div>
      <label class="inForm" for="review_text">Review:</label><br>
      <textarea id="review_text" name="review_text" rows="4" cols="50" required value="<%= locals.review_text %>"></textarea><br>
    </div>
    <button id="submit_button" type="submit" value="submitReview" disabled>Submit Review</button>
    <input type="hidden" name="account_id" value="${global.data5.account_id}">
    <input type="hidden" name="inv_id" value="${inv_id}">
    <input type="hidden" id="review_date" name="review_date" value="">
    </fieldset></form> 
  `;
  return form;
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
      '<h5><span class="descText">Miles: </span>' +
      vehicle.inv_miles.toLocaleString() +
      '</h5>';
    grid += '</div>';
    // grid += '</li>';
    grid += '</div>';
  } else {
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>';
  }
  return grid;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += ' selected ';
    }
    classificationList += '>' + row.classification_name + '</option>';
  });
  classificationList +=
    "required value='<%= locals.inv_description %>'</select>";
  return classificationList;
};

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
          req.flash('Please log in.');
          res.clearCookie('jwt');
          return res.redirect('/account/login');
        }
        res.locals.accountData = accountData;
        global.data4 = res.locals.accountData.account_firstname;
        global.data5 = res.locals.accountData;
        res.locals.loggedin = 1;
        global.data2 = res.locals.loggedin;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    res.locals.accountData.account_id;
    next();
  } else {
    req.flash('notice', 'Please log in.');
    return res.redirect('/account/login');
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
