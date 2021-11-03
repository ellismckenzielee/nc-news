exports.handleCustomErrors = (err, req, res, next) => {
  console.log("in handleCustomErrors error handler");
  console.log("ERROR TO SEND", err);
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  console.log("in handlePSQLErrors error handler");
  if (err.code) {
    console.log(err.code);
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
    console.log("converted PSQL error into custom error");
    next(customError);
  } else {
    next(err);
  }
};

exports.handle500 = (req, res, next) => {
  console.log("in handle500 error handler");
  res.status(500).send({ msg: "server error" });
};

exports.handle404 = (req, res, next) => {
  console.log("in handle404 error handler");
  res.status(404).send({ msg: "Invalid URL" });
};
