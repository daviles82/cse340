const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

async function getData(classification_id) {
  return await invModel.getInventoryByClassificationId(classification_id);
}
/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await getData(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  const header = await utilities.getHeader();
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render('./inventory/classification', {
    title: className + ' vehicles',
    header,
    nav,
    grid,
  });
};


/* ***************************
 *  Build by individual view
 * ************************** */
invCont.buildByItemId = async function (req, res, next) {
  const data2 = await invModel.getInventoryById(req.params.individualId);
  const grid = await utilities.buildIndividualGrid(data2);
  const reviews = await utilities.buildReviewList(data2.inv_id);
  const specificVehicle = `${data2.inv_year} ${data2.inv_make} ${data2.inv_model}`
  let nav = await utilities.getNav();
  const header = await utilities.getHeader();
  res.render('./inventory/individual', {
    title: specificVehicle ,
    header,
    nav,
    reviews,
    grid,
  });
};


/* ****************************************
 * Deliver the Vehicle Mangagement page
 * Unit 4,
 * *************************************** */
invCont.vehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const header = await utilities.getHeader();
  const classificationSelect = await utilities.buildClassificationList()
  res.render('inventory/management', {
    title: 'Vehicle Management',
    header,
    nav,
    errors: null,
    classificationSelect,
  });
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInvItemView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const header = await utilities.getHeader();
  const itemData = await invModel.getInventoryById(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    header,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInvItemView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const header = await utilities.getHeader();
  let nav = await utilities.getNav()
  let dropDown = await utilities.buildClassificationList();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    header,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    dropDown
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  const header = await utilities.getHeader();
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    header,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  // let nav = await utilities.getNav()
  const {
    inv_id,
  } = req.body
  const deleteResult = await invModel.deleteInvModel(
    inv_id,
  )
  if (deleteResult) {
    req.flash("notice", `The delete was successfull.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", `The delete was unsuccessful.`)
    res.redirect("/inv/delete/" + parseInt(inv_id))
  }
}

/* ****************************************
 *  Process In page review
 * *************************************** */
invCont.inPageReviewData = async function (req, res, next) {
  const {review_text, review_date, inv_id, account_id} =
    req.body;

  const insertReview = await invModel.reviewSubmission(
    review_text, 
    review_date, 
    inv_id, 
    account_id
  );

  if (insertReview) {
    req.flash(
      'notice',
      `Congratulations, you submitted a review.`
    );
    res.status(201).redirect(`/inv/type/:classificationId/detail/${req.body.inv_id}`);
  } else {
    req.flash('notice', 'Sorry, the review submisstion failed.');
    res.status(501).redirect(`/inv/type/:classificationId/detail/${req.body.inv_id}`);
  }
}

/* ****************************************
 * Deliver the Review Update form
 * *************************************** */
invCont.updateReview = async function(req, res, next) {
  let reviewId = await invModel.getReviewByReviewId(req.params.review_id)
  let item = await invModel.getInventoryById(reviewId[0].inv_id)
  const itemDescription = item.inv_year + ' ' + item.inv_make + ' ' + item.inv_model
  let date = new Date(reviewId[0].review_date)
  let viewReady = { year: 'numeric', month: 'long', day: 'numeric' };
  let readableDate = date.toLocaleDateString('en-US', viewReady)
  res.locals.review_date = readableDate
  let nav = await utilities.getNav();
  const header = await utilities.getHeader();
  res.locals.vehicle_data = reviewId[0]
  res.render('inventory/edit-review.ejs', {
    title: 'Edit '+ itemDescription + ' Review',
    header,
    nav,
    errors: null,
  });
}

/* ****************************************
 * Deliver the Delete Verification form
 * *************************************** */
invCont.deleteReview = async function(req, res, next) {
  let reviewId = await invModel.getReviewByReviewId(req.params.review_id);
  let item = await invModel.getInventoryById(reviewId[0].inv_id)
  let date = new Date(reviewId[0].review_date)
  let viewReady = { year: 'numeric', month: 'long', day: 'numeric' };
  let readableDate = date.toLocaleDateString('en-US', viewReady)
  let nav = await utilities.getNav();
  const header = await utilities.getHeader();
  const itemDescription = item.inv_year + ' ' + item.inv_make + ' ' + item.inv_model
  res.locals.review_date = readableDate
  res.locals.vehicle_data = reviewId[0]
  res.render('inventory/delete-review.ejs', {
    title: 'Delete ' + itemDescription + ' Review',
    header,
    nav,
    errors: null,
  });
}

/* ****************************************
 * Process the Review Update
 * *************************************** */
invCont.updateReviewData = async function(req, res, next) {
  const {review_text, review_id} =
    req.body;

  const insertReviewUpdate = await invModel.reviewUpdateSubmission(
    review_text, review_id
  );

  if (insertReviewUpdate) {
    req.flash(
      'notice',
      `Congratulations, you updated a review.`
    );
    res.status(201).redirect(`/account/loggedAccount/`);
  } else {
    req.flash('notice', 'Sorry, the review update failed.');
    res.status(501).redirect(`/inventory/edit-review.ejs/${req.body.review_id}`);
  }
}

/* ****************************************
 * Process the Review Deletion
 * *************************************** */
invCont.deleteReviewData = async function(req, res, next) {
  const {review_id} =
    req.body;

  const insertDeleteUpdate = await invModel.reviewDeletion(
  review_id
  );

  if (insertDeleteUpdate) {
    req.flash(
      'notice',
      `Congratulations, your review is deleted.`
    );
    res.status(201).redirect(`/account/loggedAccount/`);
  } else {
    req.flash('notice', 'Sorry, the deletion failed.');
    res.status(501).redirect(`/inventory/delete-review.ejs/${req.body.review_id}`);
  }
}

module.exports = invCont
