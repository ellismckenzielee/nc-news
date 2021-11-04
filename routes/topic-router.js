const topicRouter = require("express").Router();
const { getTopics, postTopic } = require("../controllers/topics.controllers");
const { invalidMethod } = require("../controllers/errors.controllers");

topicRouter.route("/").get(getTopics).post(postTopic).all(invalidMethod);
module.exports = topicRouter;
