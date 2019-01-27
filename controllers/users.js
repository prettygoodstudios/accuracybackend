//Import app
const {app} = require("../server.js");
const Twitter = require("twitter");
const dotenv = require('dotenv');
dotenv.config();

//Database Imports
const usersQueries = require("../database/users.js");
const {createUser, createSession, authenticate, getUser} = usersQueries;

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

const create = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const company = req.body.company;
  if(email.length > 3 && email.indexOf(".") != -1 && email.indexOf("@") != -1){
    if(password.length >= 6 && password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])/)){
      if(company.length >= 3){
        createUser(email, password, company).then((data) => {
          res.send(data);
        }).catch((error) => {
          res.send(error);
        });
      }else{
        res.send({error: 'Your company name must be atleast three characters.'});
      }
    }else{
      res.send({error: 'Password must be atleast 6 characters and contain numbers and letters.'});
    }
  }else{
    res.send({error: 'You must enter in a valid email.'});
  }
}

const newSession = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  createSession(email, password).then((token) => {
    res.send({token: token});
  }).catch((error) => {
    res.send({error: error});
  });
}

const authenticateSession = (req, res) => {
  const token = req.body.token;
  authenticate(token).then((data) => {
    res.send(data);
  }).catch((error) => {
    res.send(error);
  });
}

const get  = (req, res) => {
  const token = req.queryString("token");
  getUser(token).then((user) => {
    res.send(user);
  }).catch((error) => {
    res.send(error);
  });
}

const sendEmail = (req, res) => {
  const message  = req.queryString("message");
  res.send({
    status: "sent"
  });
}

const getTweets = (req, res) => {
  var params = {screen_name: 'AccuracyUt'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      res.send(tweets);
    }else{
      res.send({error});
    }
  });
}

module.exports = {
  create,
  newSession,
  authenticateSession,
  get,
  sendEmail,
  getTweets
}
