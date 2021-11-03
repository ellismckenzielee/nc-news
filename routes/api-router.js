const apiRouter = require("express").Router();
const topicRouter = require("./topic-router");
const articleRouter = require("./article-router");
const commentRouter = require("./comment-router");
const { getEndpoints } = require("../controllers/api.controllers");
const { invalidMethod } = require("../controllers/errors.controllers");
const userRouter = require("./user-router");

apiRouter.route("/").get(getEndpoints).all(invalidMethod);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/users", userRouter);

module.exports = apiRouter;
