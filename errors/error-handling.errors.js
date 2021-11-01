exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send(err.msg);
  else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code) {
    const errorConverter = {
      "22P02": { status: 400, msg: "bad request: invalid article name" },
    };
    const customError = errorConverter[err.code];
    res.status(customError.status).send({ msg: customError.msg });
  } else {
    next(err);
  }
};
