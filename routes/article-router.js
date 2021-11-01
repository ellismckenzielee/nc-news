const articleRouter = require("express").Router();
const { getArticleById } = require("../controllers/articles.controllers");

articleRouter.route("/:article_id").get(getArticleById);

module.exports = articleRouter;
