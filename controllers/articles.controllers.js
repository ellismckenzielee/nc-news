const {
  selectArticleById,
  updateArticleById,
} = require("../models/articles.models.js");

exports.getArticleById = (req, res, next) => {
  console.log("in get articles by id controller");
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  console.log("in patchArticleById");
  const { article_id } = req.params;
  const { votesInc } = req.body;
  console.log(article_id, votesInc);
  updateArticleById(article_id, votesInc)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => console.log(err));
};
