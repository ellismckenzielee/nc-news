const articleRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getArticleComments,
  postArticleComment,
} = require("../controllers/articles.controllers");

articleRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleComment);
articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);
articleRouter.route("/").get(getArticles);

module.exports = articleRouter;
