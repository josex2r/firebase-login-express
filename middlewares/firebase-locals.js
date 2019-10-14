module.exports = (req, res, next) => {
  res.locals = process.env;
  next();
};
