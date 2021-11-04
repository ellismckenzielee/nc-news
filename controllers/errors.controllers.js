exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code) {
    const errorConverter = {
      "22P02": {
        status: 400,
        msg: "400: bad request",
      },
      23503: {
        status: 404,
        msg: "username not found",
      },
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

exports.invalidMethod = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};
