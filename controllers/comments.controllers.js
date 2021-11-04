const { removeComment, updateComment } = require("../models/comments.models");

exports.deleteComment = (req, res, next) => {
  console.log("in deleteComment controller");
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  console.log("in patchComment controller");
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  console.log(comment_id, inc_votes);
  updateComment(comment_id, inc_votes)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
