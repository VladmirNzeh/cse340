const { Pool } = require("pg")
require("dotenv").config()

let pool

// Use SSL in all environments (Render requires it)
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Log queries in development
if (process.env.NODE_ENV === "development") {
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params)
        console.log("executed query", { text })
        return res
      } catch (error) {
        console.error("error in query", { text })
        throw error
      }
    },
  }
} else {
  // Production, no logging
  module.exports = pool
}
