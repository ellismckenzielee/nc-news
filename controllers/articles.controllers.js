const {
  selectArticleById,
  updateArticleById,
  selectArticles,
  insertArticleComment,
  selectArticleComments,
  removeArticleById,
  insertArticle,
} = require("../models/articles.models.js");

exports.getArticleById = (req, res, next) => {
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
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic: topicFilter, limit, p } = req.query;
  selectArticles({ sort_by, order, topicFilter, limit, p })
    .then((articles) => res.status(200).send({ articles }))
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  console.log(limit, p);
  selectArticleComments(article_id, limit, p)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postArticleComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  insertArticleComment(username, body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleById(article_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  console.log("in postArticle controller");
  const { author, title, body, topic } = req.body;
  insertArticle(author, title, body, topic)
    .then((article) => {
      article.comment_count = 0;
      res.status(201).send({ article });
    })
    .catch(next);
};
