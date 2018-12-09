const express = require('express');

//Import Controllers
const appointments = require("./controllers/appointments");
const users = require("./controllers/users");
const staff = require("./controllers/staff");


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
    this.app.post(`${usersRoute}/session`, users.newSession);
    this.app.post(`${usersRoute}/authenticate`, users.authenticateSession);
    //Staff Actions
    const staffRoute = '/staff';
    this.app.post(`${staffRoute}`, staff.create);
  }

  listen(){
    this.app.listen(this.port, () => console.log(`Example app listening on port ${this.port}!`));
  }

}

const app = new Server({port: 3000}).app;

module.exports = {
  app
}
