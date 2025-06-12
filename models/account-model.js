const pool = require("../database/index");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  console.log(account_firstname, account_lastname, account_email, account_password);
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"

      console.log("Executing query:", sql, [account_firstname, account_lastname, account_email, account_password]);

      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

  /* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
  
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}


async function loginAccount(account_email, account_password){
    
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1 AND account_password = $2";
      const result = await pool.query(sql, [account_email, account_password]);
      if (result.rowCount === 0) {
        return null; // No account found
      }
      return result.rows[0]
    } catch (error) {
      console.error("Error during login:", error.message);
      return null;
    }
  }

// Get account by ID
async function getAccountById(account_id) {
  const data = await pool.query(`SELECT account_id, account_firstname, account_lastname, account_email, FROM account WHERE account_id = $1`,
    [account_id])
    return data.rows[0]
}

// Update name/email
async function updateAccount(account_id, firstname, lastname, email) {
  const sql = `UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *`
  const data = await pool.query(sql, [firstname, lastname, email, account_id])
  return data.rows[0]
}

// Update password
async function updatePassword(account_id, hashedPassword) {
  const sql = `UPDATE account SET account_password = $1 WHERE account_id = $2, RETURNING *`
  const data = await pool.query(sql, [hashedPassword, account_id])
  return data.rows[0]
}

  module.exports = {
    registerAccount, 
    checkExistingEmail, 
    loginAccount, 
    getAccountById,
    updateAccount,
    updatePassword};