const {
  selectComments,
  insertComment,
} = require("../models/comments.models.js");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  console.log(req.params);
  selectComments(article_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
};

exports.postComment = (req, res, next) => {
  console.log("in postComment controller");
  const { newComment } = req.body;
  const { username, body } = newComment;
  const { article_id } = req.params;
  console.log(username, body, article_id);
  insertComment(username, body, article_id).then((comment) => {
    res.status(201).send({ comment });
  });
};
