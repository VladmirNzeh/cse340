const {Pool} = require("pg") // imports the Pool funcionality from the "pg" package. 
require("dotenv").config() //imports the "dotenv" package which allows the sensitive information about the database location and connection credentials to be stored in a separate location and still be accessed.
/* ********
*Connection Pool
*SSL Object needed for local testing of app
*But will cause problems in production environment
*If - else will make determination which to use
* **********/
let pool
if (process.env.NODE_ENV == "development") {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL, //Line 12 - indicates how the pool will connect to the database (use a connection string) and the value of the string is stored in a name - value pair, which is in the .env file locally, and in an "environment variable" on a remote server. These are equivelent concepts, but different implementations.
        ssl: { // Lines 13 through 15 - describes how the Secure Socket Layer (ssl) is used in the connection to the database, but only in a remote connection, as exists in our development environment. 
            rejectUnauthorized: false,
        },
    })

    //Added for troubleshooting queries
    //during development
    module.exports = { //Lines 20-31 - exports an asynchronous query function that accepts the text of the query and any parameters. When the query is run it will add the SQL to the console.log. If the query fails, it will console log the SQL text to the console as an error. This code is primarily for troubleshooting as you develop. As you test the application in your development mode, have the terminal open, and you will see the queries logged into the terminal as each is executed.
        async query(text, params) {
            try {
                const res = await pool.query(text, params)
                console.log("executed query", {text})
                return res
            } catch (error) {
                console.error("error in query", {text})
                throw error
            }
        },
    }
} else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL, //o	Line 34 - indicates the value of the connection string will be found in an environment variable. In the production environment, such a variable will not be stored in our .env file, but in the server's settings.
    })
    module.exports = pool //Line 36 - exports the pool object to be used whenever a database connection is needed. This is for the production environment, which means the queries will not be entered into the console. 
}

