const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.commentRules = () => {
  return [
    body("comment_text")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Comment must be at least 2 characters long.")
  ]
}

validate.checkCommentData = async (req, res, next) => {
  const { post_id, comment_text } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const comments = [] // Optional: fetch comments again if needed
    res.render("comments/view", {
      errors,
      title: "Comments",
      nav,
      post_id,
      comment_text,
      comments,
      intError: "<a href= /error >Error link</a>",
    })
    return
  }
  next()
}

module.exports = validate
