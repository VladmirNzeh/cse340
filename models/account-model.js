/* **************
* Process Registration account
* ************** */
const pool = require("../database/")
const { get } = require("../routes/static")

/* **************
* Registration new account
* Process regitration activity
* ************** */

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const bcrypt = require("bcrypt") // typo fixed from "bycrypt" to "bcrypt"
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword])
  } catch (error) {
    console.error("Registration error:", error.message)
    return null // or throw error if you want to handle it upstream
  }
}

/* **************
* Check for existing email
* Stickiness activity
* ************** */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, account_email
      FROM account
      WHERE account_id = $1`,
      [account_id]
    )
    return result.rows[0]
  }  catch (error) {
    return new Error("No matching account found")
  }
}

async function updateAccountInfo(account_id, firstname, lastname, email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *`
    const values = [firstname, lastname, email, account_id]
    const result = await pool.query(sql, values)
    return result.rows[0]
  } catch (error) {
    throw new Error("Error updating account info: " + error.message)
  }
}


async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2`
    const values = [hashedPassword, account_id]
    const result = await pool.query(sql, values)
    return result
  } catch (error) {
    return new Error("Error updating password: " + error.message)
  }
}


module.exports = {
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail,
  getAccountById,
  updateAccountInfo,
  updatePassword}
