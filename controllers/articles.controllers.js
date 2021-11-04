const {
  selectArticleById,
  updateArticleById,
  selectArticles,
  insertArticleComment,
  selectArticleComments,
  removeArticleById,
} = require("../models/articles.models.js");

exports.getArticleById = (req, res, next) => {
  console.log("in getArticles by id controller");
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  console.log("in patchArticleById controller");
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  console.log("in getArticles controller");
  const { sort_by, order, topic: topicFilter, limit, p } = req.query;
  selectArticles({ sort_by, order, topicFilter, limit, p })
    .then((articles) => res.status(200).send({ articles }))
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  console.log(req.params);
  selectArticleComments(article_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
};

exports.postArticleComment = (req, res, next) => {
  console.log("in postComment controller");
  const { username, body } = req.body;
  const { article_id } = req.params;
  console.log(username, body, article_id);
  insertArticleComment(username, body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  console.log("inside getArticleById controller");
  const { article_id } = req.params;
  removeArticleById(article_id)
    .then(() => {
      res.sendStatus(204);
      //.send({ msg: `success: removed ${removedCommentCount} comments` });
    })
    .catch(next);
};
