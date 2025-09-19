// Bring in Pool from pg and dotenv for env variables
const { Pool } = require("pg")
require("dotenv").config()

// Create a new pool instance with SSL enabled (required by Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// 🔍 Development logging patch
// If we're in development mode, wrap the pool's query function
// to log each SQL query before it runs (for easier debugging)
if (process.env.NODE_ENV === "development") {
  const originalQuery = pool.query.bind(pool) // preserve original query method

  pool.query = async (text, params) => {
    try {
      const res = await originalQuery(text, params)
      console.log("✅ executed query", { text }) // dev logging
      return res
    } catch (error) {
      console.error("❌ error in query", { text }) // dev error logging
      throw error // allow caller to handle it
    }
  }
}

// This allows you to use .query AND .end() from anywhere in your app
module.exports = pool
