const {getReveiws, createReview, deleteReview, editReview} = require('../database/reviews');

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

const deleteAction = (req, res) => {
  const token = req.queryString('token');
  const id = req.queryString('id');
  deleteReview({token, id}).then((reviews) => {
    res.send(reviews);
  }).catch((error) => {
    res.send(error);
  });
}

const edit = (req, res) => {
  const token = req.queryString('token');
  const id = req.queryString('id');
  const score = req.queryString('score');
  const message = req.queryString('message');
  editReview({token, id, score, message}).then((reviews) => {
    res.send(reviews);
  }).catch((e) => {
    res.send(e);
  });
}

module.exports = {
  get,
  create,
  deleteAction,
  edit
}
