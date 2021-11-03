const { readEndpoints } = require("../models/api.models");
exports.getEndpoints = (req, res, next) => {
  console.log("inside getEndpoints controller");
  readEndpoints().then((endpoints) => {
    res.status(200).send({ endpoints });
  });
};
