const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

//Import Controllers
const appointments = require("./controllers/appointments");
const users = require("./controllers/users");
const staff = require("./controllers/staff");
const reviews = require("./controllers/reviews");


class Server {

  constructor({port}){
    this.app = express();
    this.port = port;
    this.app.use(require('sanitize').middleware);
    this.app.use(express.urlencoded());
    this.app.use(express.json());  
    this.app.use(function(req, res, next){
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      next();
    });
    this.setMap();
    this.listen();
  }

  setMap(){
    //Appointment Actions
    const appointmentRoute = '/appointments';
    this.app.get(`${appointmentRoute}`, appointments.get);
    this.app.get(`${appointmentRoute}/mine`, appointments.getMine);
    this.app.post(`${appointmentRoute}/edit`, appointments.edit);
    this.app.post(`${appointmentRoute}`, appointments.create);
    this.app.post(`${appointmentRoute}/delete`, appointments.deleteAction);
    //Users Actions
    const usersRoute = '/users';
    this.app.post(`${usersRoute}`, users.create);
    this.app.get(`${usersRoute}`, users.get);
    this.app.post(`${usersRoute}/session`, users.newSession);
    this.app.post(`${usersRoute}/authenticate`, users.authenticateSession);
    this.app.post('/sendemail', users.sendEmail);
    //Staff Actions
    const staffRoute = '/staff';
    this.app.post(`${staffRoute}`, staff.create);
    this.app.post(`${staffRoute}/edit`, staff.edit);
    this.app.get(`${staffRoute}`, staff.get);
    this.app.post(`${staffRoute}/delete`, staff.deleteAction);
    //Reviews Actions
    const reviewsRoute = '/reviews';
    this.app.post(`${reviewsRoute}`, reviews.create);
    this.app.post(`${reviewsRoute}/edit`, reviews.edit);
    this.app.get(`${reviewsRoute}`, reviews.get);
    this.app.delete(`${reviewsRoute}`, reviews.deleteAction);
    this.app.post(`${reviewsRoute}/approve`, reviews.approve);
  }

  listen(){
    this.app.listen(this.port, () => console.log(`Example app listening on port ${this.port}!`));
  }

}

const app = new Server({port: process.env.PORT}).app;

module.exports = {
  app
}
