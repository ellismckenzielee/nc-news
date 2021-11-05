const articleRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getArticleComments,
  postArticleComment,
  deleteArticleById,
  postArticle,
} = require("../controllers/articles.controllers");

articleRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleComment);

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById);

articleRouter.route("/").get(getArticles).post(postArticle);

module.exports = articleRouter;
