const pool = require("../database/")

/* **************
 * Register a new account
 * ************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password, account_type = 'Client') {
  try {
    const sql = `
      INSERT INTO account (
        account_firstname, account_lastname, account_email, account_password, account_type
      ) VALUES ($1, $2, $3, $4, $5) RETURNING *`
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password, account_type])
    return result.rows[0] || null
  } catch (error) {
    console.error("Registration error:", error)
    return null
  }
}

/* **************
 * Check if email already exists
 * ************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    console.error("Email check error:", error)
    return 0
  }
}

/* **************
 * Get account by email
 * ************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Email lookup error:", error)
    return null
  }
}

/* **************
 * Get account by ID
 * ************** */
async function getAccountByAccountId(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Account ID lookup error:", error)
    return null
  }
}

/* **************
 * Update account details
 * ************** */
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = `
      UPDATE public.account
      SET account_firstname = $1, account_lastname = $2, account_email = $3
      WHERE account_id = $4 RETURNING *`
    const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    return data.rows[0] || null
  } catch (error) {
    console.error("Update error:", error)
    return null
  }
}

/* **************
 * Change account password
 * ************** */
async function changePassword(account_id, account_password) {
  try {
    const sql = `
      UPDATE public.account
      SET account_password = $1
      WHERE account_id = $2 RETURNING *`
    const data = await pool.query(sql, [account_password, account_id])
    return data.rows[0] || null
  } catch (error) {
    console.error("Password change error:", error)
    return null
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountByAccountId,
  updateAccount,
  changePassword
}
