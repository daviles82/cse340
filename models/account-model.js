const pool = require('../database/');

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
// Part of team task
async function checkExistingEmail(account_email) {
  try {
    const sql = 'SELECT * FROM account WHERE account_email = $1';
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check correct password
 * ********************* */
// There is a bug in this code, need to check if the password is correct and it belongs to the correct email.
// async function checkPassword(account_password) {
//   try {
//     const sql = 'SELECT * FROM account WHERE account_password = $1';
//     const password = await pool.query(sql, [account_password]);
//     return password.rowCount;
//   } catch (error) {
//     return error.message;
//   }
// }

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
      console.log(result.rows[0]);
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail };
