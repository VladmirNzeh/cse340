const pool = require("../database")

/* **************
 * Add a new comment
 * ************** */
async function addComment(account_id, post_id, comment_text) {
  try {
    const sql = `
      INSERT INTO comments (account_id, post_id, comment_text)
      VALUES ($1, $2, $3) RETURNING *`
    const result = await pool.query(sql, [account_id, post_id, comment_text])
    return result.rows[0] || null
  } catch (error) {
    console.error("Add comment error:", error)
    return null
  }
}

/* **************
 * Get comments for a post
 * ************** */
async function getCommentsByPostId(post_id) {
  try {
    const sql = `
      SELECT c.comment_id, c.comment_text, c.created_at,
             a.account_firstname, a.account_lastname
      FROM comments c
      JOIN account a ON c.account_id = a.account_id
      WHERE c.post_id = $1
      ORDER BY c.created_at DESC`
    const result = await pool.query(sql, [post_id])
    return result.rows
  } catch (error) {
    console.error("Fetch comments error:", error)
    return []
  }
}

/* **************
 * Delete a comment
 * ************** */
async function deleteComment(comment_id, account_id) {
  try {
    const sql = `
      DELETE FROM comments
      WHERE comment_id = $1 AND account_id = $2 RETURNING *`
    const result = await pool.query(sql, [comment_id, account_id])
    return result.rows[0] || null
  } catch (error) {
    console.error("Delete comment error:", error)
    return null
  }
}

module.exports = {
  addComment,
  getCommentsByPostId,
  deleteComment
}
