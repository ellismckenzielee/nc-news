const { selectTopics } = require("../models/topics.models");
exports.getTopics = (req, res, next) => {
  console.log("in getTopics controller");
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
