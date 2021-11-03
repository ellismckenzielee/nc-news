const apiRouter = require("express").Router();
const topicRouter = require("./topic-router");
const articleRouter = require("./article-router");
const commentRouter = require("./comment-router");
const {
  getEndpoints,
  invalidMethod,
} = require("../controllers/api.controllers");

apiRouter.route("/").get(getEndpoints).all(invalidMethod);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
