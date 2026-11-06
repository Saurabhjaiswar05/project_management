const fs = require("fs");

const logger = (req, res, next) => {
  const data = `
Request Body: ${JSON.stringify(req.body)}
Method: ${req.method}
Path: ${req.path}
Query: ${JSON.stringify(req.query)}
Params: ${JSON.stringify(req.params)}
`;

  fs.appendFile("console.log", data + "\n", (err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    next();
  });
};

module.exports = logger;