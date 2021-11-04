const db = require("../db/connection");

exports.removeComment = (comment_id) => {
  console.log("in removeComment model");
  return db
    .query("DELETE FROM comments WHERE comment_id = $1;", [comment_id])
    .then(({ rowCount }) => {
      return rowCount
        ? rowCount
        : Promise.reject({ status: 404, msg: "comment not found" });
    });
};

exports.updateComment = (comment_id, inc_votes) => {
  console.log("in updateComment model");
  console.log(typeof inc_votes);
  if (isNaN(inc_votes))
    return Promise.reject({ status: 400, msg: "400: bad request" });
  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length) return rows[0];
      else return Promise.reject({ status: 404, msg: "comment not found" });
    });
};
