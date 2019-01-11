const {getReveiws, createReview, deleteReview, editReview, approveReview} = require('../database/reviews');

const get = (req, res) => {
  getReveiws().then((reviews) => {
    res.send(reviews);
  }).catch((error) => {
    res.send(error);
  });
}

const create = (req, res) => {
  const token = req.queryString('token');
  const score = req.queryString('score');
  const message = req.queryString('message');
  if(score != 0 && score != undefined){
    if(message.length != ""){
      createReview({token, score, message}).then((reviews) => {
        res.send(reviews);
      }).catch((error) => {
        res.send(error);
      });
    }else{
      res.send({error: "You must enter in a message atleast six characters long."});
    }
  }else{
    res.send({error: "You must enter in a score."});
  }
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

const approve = (req, res) => {
  const id = req.queryString('id');
  const token = req.queryString('token');
  approveReview(id, token).then((reviews) => {
    res.send(reviews);
  }).catch((error) => {
    res.send(error);
  });
}

module.exports = {
  get,
  create,
  deleteAction,
  edit,
  approve
}
