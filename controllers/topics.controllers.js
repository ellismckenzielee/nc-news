const { selectTopics, insertTopic } = require("../models/topics.models");
exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  console.log("in postTopic controller function");
  const { slug, description } = req.body;
  insertTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
