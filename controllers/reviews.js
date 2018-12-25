const {getReveiws, createReview} = require('../database/reviews');

const get = (req, res) => {
  getReveiws.then((reviews) => {
    res.send(reviews);
  }).catch((error) => {
    res.send(error);
  });
}

const create = (req, res) => {
  const token = req.queryString('token');
  const score = req.queryString('score');
  const message = req.queryString('message');
  createReview({token, score, message}).then((reviews) => {
    res.send(reviews);
  }).catch((error) => {
    res.send(error);
  });
}

module.exports = {
  get,
  create
}
