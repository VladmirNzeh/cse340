
let pool
if (process.env.NODE_ENV === 'development') {
    pool = new pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },
    })

    // Added for troubleshooting queries
    // during development
    module.exports = {
        async query(text, params) {
            try {
                const res = await pool.query(text, params)
                console.log("executed query", {text})
                return res
            } catch (err) {
                console.error("Query error", {text, params, err})
                throw err
            }
        },
    }
}
else {
    pool = new pool({
        connectionString: process.env.DATABASE_URL,
    })
    module.exports = pool
}