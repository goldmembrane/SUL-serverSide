const { keyword } = require("../../models");
const jwt = require("jsonwebtoken");

module.exports = {
  get: (req, res) => {
    let token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "need user session" }).end();
    } else {
      let userId = jwt.verify(token, process.env.JWT_SECRET).id;

      keyword
        .findAll({
          where: {
            user_id: userId,
          },
        })
        .then((data) => {
          res.status(200).json(data).end();
        })
        .catch((error) => {
          console.log(error);
          res.status(501).send(error);
        });
    }
  },
  post: (req, res) => {
    let token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "need user session" }).end();
    } else {
      let keywords = req.body.keyword;
      let userId = jwt.verify(token, process.env.JWT_SECRET).id;

      keyword
        .findOrCreate({
          where: {
            keyword: keywords,
            user_id: userId,
          },
        })
        .then(async ([data, created]) => {
          if (!created) {
            res.status(409).json({ message: "Already exists" }).end();
          } else {
            res.status(201).json({ message: "Success " });
          }
        });
    }
  },
  delete: (req, res) => {
    let token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "need user session" }).end();
    } else {
      let userId = jwt.verify(token, process.env.JWT_SECRET).id;
      let keywords = req.body.keyword;

      keyword.findOne({ where: { user_id: userId } }).then((data) => {
        if (data) {
          keyword
            .destroy({ where: { user_id: userId, keyword: keywords } })
            .then(() => {
              res.status(200).json({ message: "Success" }).end();
            })
            .catch((error) => {
              console.log(error);
              res.status(501).send(error);
            });
        } else {
          res.status(404).json({ message: "cannot found data" }).end();
        }
      });
    }
  },
};
