//Import app
const {app} = require("../server.js");

//Database Imports
const usersQueries = require("../database/users.js");
const {createUser, createSession, authenticate, getUser} = usersQueries;


const create = (req, res) => {
  const email = req.queryString('email');
  const password = req.queryString('password');
  if(email.length > 3 && email.indexOf(".") != -1 && email.indexOf("@") != -1){
    if(password.length > 6){
      createUser(email, password).then((data) => {
        res.send(data);
      }).catch((error) => {
        res.send(error);
      });
    }else{
      res.send('Password must be atleast 6 characters.');
    }
  }else{
    res.send('You must enter in a valid email.');
  }
}

const newSession = (req, res) => {
  const email = req.queryString('email');
  const password = req.queryString('password');
  createSession(email, password).then((token) => {
    res.send(token);
  }).catch((error) => {
    res.send(error);
  });
}

const authenticateSession = (req, res) => {
  const token = req.queryString('token');
  authenticate(token).then((data) => {
    res.send(data);
  }).catch((error) => {
    res.send(error);
  });
}

const get  = (req, res) => {
  const token = req.queryString('token');
  getUser(token).then((user) => {
    res.send(user);
  }).catch((error) => {
    res.send(error);
  });
}

module.exports = {
  create,
  newSession,
  authenticateSession,
  get
}
