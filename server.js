const express = require('express');

//Import AppointmentController
const appointments = require("./controllers/appointments");


class Server {

  constructor({port}){
    this.app = express();
    this.port = port;
    this.setMap();
    this.listen();
  }

  setMap(){
    //Appointment Actions
    const appointmentRoute = '/appointments';
    this.app.get(`${appointmentRoute}`, appointments.get);
  }

  listen(){
    this.app.listen(this.port, () => console.log(`Example app listening on port ${this.port}!`));
  }

}

const app = new Server({port: 3000}).app;

module.exports = {
  app
}
