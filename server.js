const express = require('express');

//Import Controllers
const appointments = require("./controllers/appointments");
const users = require("./controllers/users");


class Server {

  constructor({port}){
    this.app = express();
    this.port = port;
    this.app.use(require('sanitize').middleware);
    this.setMap();
    this.listen();
  }

  setMap(){
    //Appointment Actions
    const appointmentRoute = '/appointments';
    this.app.get(`${appointmentRoute}`, appointments.get);
    //Users Actions
    const usersRoute = '/users';
    this.app.post(`${usersRoute}`, users.create);
  }

  listen(){
    this.app.listen(this.port, () => console.log(`Example app listening on port ${this.port}!`));
  }

}

const app = new Server({port: 3000}).app;

module.exports = {
  app
}
