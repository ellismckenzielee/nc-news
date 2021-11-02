const { selectComments } = require("../models/comments.models.js");
exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  console.log(req.params);
  selectComments(article_id).then((comments) =>
    res.status(200).send({ comments })
  );
};
