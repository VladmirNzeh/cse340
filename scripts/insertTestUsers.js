const bcrypt = require("bcrypt")
const pool = require("../database/") // adjust path if needed

async function insertTestUsers() {
  try {
    const users = [
      {
        firstname: "Basic",
        lastname: "Client",
        email: "basic@340.edu",
        password: "I@mABas1cCl!3nt",
        type: "Client",
      },
      {
        firstname: "Happy",
        lastname: "Employee",
        email: "happy@340.edu",
        password: "I@mAnEmpl0y33",
        type: "Employee",
      },
      {
        firstname: "Manager",
        lastname: "Administrator",
        email: "manager@340.edu",
        password: "I@mAnAdm!n1strat0r",
        type: "Admin",
      },
    ]

    for (let user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10)

      const sql = `
        INSERT INTO account (
          account_firstname, account_lastname, account_email, account_password, account_type
        )
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (account_email) DO NOTHING
        RETURNING account_id
      `

      const result = await pool.query(sql, [
        user.firstname,
        user.lastname,
        user.email,
        hashedPassword,
        user.type,
      ])

      if (result.rows.length) {
        console.log(`✅ Inserted ${user.email}`)
      } else {
        console.log(`⚠️ Already exists: ${user.email}`)
      }
    }

    console.log("🚀 Done inserting test accounts.")
  } catch (err) {
    console.error("❌ Error inserting users:", err.message)
  } finally {
    pool.end()
  }
}

insertTestUsers()
