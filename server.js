/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const session = require("express-session");
const pool = require('./database/');
const utilities = require('./utilities');
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const errorController = require("./controllers/errorController");
const accountRoute = require('./routes/accountRoute');
const errorRoute = require("./routes/errorRoute");
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const path = require("path");
const checkAuth = require("./middleware/checkAuth");

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: 'sessionId',
}))

//Flash Message Middleware
app.use(flash())
app.use(function(req, res, next){
  res.locals.messages = req.flash(); 
  next();
})

app.use(cookieParser())
// express parser middleware for POST requests
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

// JWT info to res.locals.accountData
app.use(checkAuth)
/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") 
app.set('views', path.join(__dirname, 'views'))

/* ***********************
 * Routes
 *************************/
app.use(express.static(path.join(__dirname, "public")))
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use("/error", errorRoute)

/* ***********************
 * Error Handling
 *************************/
// Use the 404 error handler from utilities
app.use(utilities.handle404);

// Use the 500 error handler for other server errors
app.use(utilities.handle500);


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
 