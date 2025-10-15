const utilities = require("../utilities/")
const commentModel = require("../models/comment-Model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Build comments view for a post
* *************************************** */
async function buildComments(req, res) {
  const post_id = parseInt(req.params.post_id)
  let nav = await utilities.getNav()
  const comments = await commentModel.getCommentsByPostId(post_id)
  const intError = "<a href= /error >Error link</a>"

  res.render("comments/view", {
    title: "Comments",
    nav,
    intError,
    comments,
    post_id,
    errors: null
  })
}

/* ****************************************
*  Process new comment
* *************************************** */
async function addComment(req, res) {
  let nav = await utilities.getNav()
  const token = req.cookies.jwt
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  const account_id = decodedToken.account_id
  const { post_id, comment_text } = req.body

  if (!comment_text || comment_text.trim().length < 2) {
    req.flash("notice", "Comment must be at least 2 characters.")
    return res.redirect(`/comments/${post_id}`)
  }

  const result = await commentModel.addComment(account_id, post_id, comment_text)
  if (result) {
    req.flash("notice", "Comment added successfully.")
  } else {
    req.flash("notice", "Failed to add comment.")
  }
  res.redirect(`/comments/${post_id}`)
}

/* ****************************************
*  Delete a comment
* *************************************** */
async function deleteComment(req, res) {
  const token = req.cookies.jwt
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  const account_id = decodedToken.account_id
  const { comment_id, post_id } = req.body

  const result = await commentModel.deleteComment(comment_id, account_id)
  if (result) {
    req.flash("notice", "Comment deleted.")
  } else {
    req.flash("notice", "Unable to delete comment.")
  }
  res.redirect(`/comments/${post_id}`)
}

module.exports = {
  buildComments,
  addComment,
  deleteComment
}
