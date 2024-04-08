const pool = require('../database/');

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    'SELECT * FROM public.classification ORDER BY classification_name'
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error('getclassificationsbyid error ' + error);
  }
}

/* ***************************
 *  Get inventory item by inv_id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,[inv_id]
      );
    return data.rows[0]
  } catch (error) {
    console.error('getinventorybyid error ' + error);
  }
}

/* *****************************
 *   Add new classification
 * *************************** */
async function addClassificationToFile(classification_name) {
  try {
    const sql =
      'INSERT INTO classification (classification_name) VALUES ($1) RETURNING *';
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Add new inventory
 * *************************** */
async function addInventoryToFile(
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color
) {
  try {
    const sql =
      'INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
    return await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInvModel(inv_id) {
  try {
    const sql =
    'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id]);
    return data
  } catch (error) {
    console.error("Delete Inventory Error")
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassification(classification_name) {
  try {
    const sql = 'SELECT * FROM classification WHERE classification_name = $1';
    const classification = await pool.query(sql, [classification_name]);
    return classification.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Get all reviews by inv_id
 * ************************** */
async function getReviewByInvId(inv_id) {
  try {
    const sql = 'SELECT * FROM public.review JOIN public.account ON public.review.account_id = public.account.account_id WHERE public.review.inv_id = $1';
    const data = await pool.query(sql, [inv_id]);
    return data.rows;
  } catch (error) {
    console.error(`getreviewbyinvid error` + error);
  }
}

/* ***************************
 *  Get all reviews by account_id
 * ************************** */
async function getUserReviews(account_id) {
  try {
    const sql = 'SELECT * FROM public.review JOIN public.inventory ON public.review.inv_id = public.inventory.inv_id WHERE public.review.account_id = $1';
    const data = await pool.query(sql, [account_id]);
    return data.rows;
  } catch (error) {
    console.error(`getreviewbyinvid error` + error);
  }
}

/* ***************************
 *  Insert review by inv_id
 * ************************** */
async function reviewSubmission(review_text, review_date, inv_id, account_id) {
  try {
    const sql = 'INSERT INTO public.review (review_text, review_date, inv_id, account_id) VALUES ( $1, $2, $3, $4) RETURNING *';
    const data = await pool.query(sql, [review_text, review_date, inv_id, account_id]);
    return data.rows;
  } catch (error) {
    console.log(`reviewsubmission error` + error);
  }
}

/* ***************************
 *  Get reviews by review_id
 * ************************** */
async function getReviewByReviewId(review_id) {
  try {
    const sql = 'SELECT * FROM public.review WHERE public.review.review_id = $1';
    const data = await pool.query(sql, [review_id]);
    return data.rows;
  } catch (error) {
    console.error(`getreviewbyinvid error` + error);
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function reviewUpdateSubmission(
  review_text,
  review_id
) {
  try {
    const sql =
      "UPDATE public.review SET review_text = $1 WHERE review_id = $2 RETURNING *"
    const data = await pool.query(sql, [
      review_text,
      review_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Review Data
 * ************************** */
async function reviewDeletion(review_id) {
  try {
    const sql =
    'DELETE FROM review WHERE review_id = $1';
    const data = await pool.query(sql, [review_id]);
    return data
  } catch (error) {
    console.error("Delete Inventory Error")
  }
}

module.exports = {
  getInventoryById,
  getClassifications,
  getInventoryByClassificationId,
  addClassificationToFile,
  addInventoryToFile,
  checkExistingClassification,
  updateInventory,
  deleteInvModel,
  getReviewByInvId,
  reviewSubmission,
  getUserReviews,
  getReviewByReviewId,
  reviewUpdateSubmission,
  reviewDeletion
};
