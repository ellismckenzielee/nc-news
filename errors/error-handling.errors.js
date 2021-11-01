exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  console.log(err);
  if (err.code) {
    const errorConverter = {
      "22P02": { status: 400, msg: "bad request: invalid article name" },
    };
    const customError = errorConverter[err.code];
    next(customError);
  } else {
    next(err);
  }
};

exports.handle500 = (req, res, next) => {
  res.status(500).send({ msg: "server error" });
};

exports.handle404 = (req, res, next) => {
  res.status(404).send({ msg: "Invalid URL" });
};
