const { removeComment } = require("../models/comments.models");
exports.deleteComment = (req, res, next) => {
  console.log("in deleteComment controller");
  const { comment_id } = req.params;
  removeComment(comment_id).then(() => {
    res.sendStatus(204);
  });
};
