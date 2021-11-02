const articleRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require("../controllers/articles.controllers");

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);
articleRouter.route("/").get(getArticles);

module.exports = articleRouter;
