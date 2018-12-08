//Import app
const {app} = require("../server.js");

//Database Imports
const usersQueries = require("../database/users.js");
const {createUser} = usersQueries;


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

module.exports = {
  create
}
