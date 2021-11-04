const fs = require("fs/promises");

exports.readEndpoints = () => {
  return fs
    .readFile("./endpoints.json", "UTF-8")
    .then((endpoints) => JSON.parse(endpoints));
};
