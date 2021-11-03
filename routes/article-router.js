const articleRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require("../controllers/articles.controllers");

const {
  getComments,
  postComment,
} = require("../controllers/comments.controllers");

articleRouter.route("/:article_id/comments").get(getComments).post(postComment);
articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);
articleRouter.route("/").get(getArticles);

module.exports = articleRouter;
