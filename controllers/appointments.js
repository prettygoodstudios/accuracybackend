//Import app
const {app} = require("../server.js");

//Database Imports
const appointmentsQueries = require("../database/appointments.js");
const {getAppointments, createAppointments} = appointmentsQueries;


const get = (req, res) => {
  getAppointments.then((data) => {
    res.send(data);
  }).catch((error) => {
    res.send(error);
  });
}

const create = (req, res) => {
  const company = req.queryString('company');
  const time = req.queryString('time');
  const staff_id = req.queryString('staff_id');
  const token = req.queryString('token');
  createAppointments({company, time, staff_id, token}).then((appointments) => {
    res.send(appointments);
  }).catch((error) => {
    res.send(error);
  });
}

module.exports = {
  get,
  create
}
