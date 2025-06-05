exports.handle404 = (req, res, next) => {
    res.status(404).render("./404", { title: "404 - Page Not Found", layout: false })
  }
  
  exports.handle500 = (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).render("./500", { title: "500 - Server Error", layout: false })
  }

  exports.triggerError = (req, res, next) => {
    // This will create an intentional error
    const intentionalError = new Error("This is an intentional error for testing.");
    intentionalError.status = 500; // Set the status code to 500
    next(intentionalError); // Pass the error to the error handling middleware
  };
