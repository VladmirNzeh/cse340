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


  module.exports = {registerAccount, checkExistingEmail, loginAccount};