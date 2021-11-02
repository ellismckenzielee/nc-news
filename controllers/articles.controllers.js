const {
  selectArticleById,
  updateArticleById,
  selectArticles,
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
  const { votesInc } = req.body;
  console.log(article_id, votesInc);
  updateArticleById(article_id, votesInc)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  console.log("in getArticles controller");
  const { sort_by, order, topic: topicFilter } = req.query;
  selectArticles(sort_by, order, topicFilter)
    .then((articles) => res.status(200).send({ articles }))
    .catch(next);
};
