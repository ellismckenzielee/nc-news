const topicRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controllers");
const { invalidMethod } = require("../controllers/errors.controllers");

topicRouter.route("/").get(getTopics).all(invalidMethod);

module.exports = topicRouter;
