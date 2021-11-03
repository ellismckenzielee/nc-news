const fs = require("fs/promises");

exports.readEndpoints = () => {
  console.log("inside readEndpoints model");
  return fs
    .readFile("./endpoints.json", "UTF-8")
    .then((endpoints) => endpoints);
};
