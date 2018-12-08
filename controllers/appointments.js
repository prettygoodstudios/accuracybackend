//Import app
const {app} = require("../server.js");

//Database Imports
const appointmentsQueries = require("../database/appointments.js");
const {getAppointments} = appointmentsQueries;


const get = (req, res) => {
  getAppointments.then((data) => {
    res.send(data);
  }).catch((error) => {
    res.send(error);
  });
}

module.exports = {
  get
}
