//Import app
const {app} = require("../server.js");

//Database Imports
const appointmentsQueries = require("../database/appointments.js");
const {getAppointments, createAppointments, deleteAppointment, getMyAppointments, editAppointment} = appointmentsQueries;


const get = (req, res) => {
  getAppointments().then((data) => {
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

const deleteAction = (req, res) => {
  const id = req.queryString('id');
  const token = req.queryString('token');
  deleteAppointment({id, token}).then((appointments) => {
    res.send(appointments);
  }).catch((error) => {
    res.send(error);
  });
}

const getMine = (req, res) => {
  const token = req.queryString('token');
  getMyAppointments(token).then((appointments) => {
    res.send(appointments);
  }).catch((e) => {
    res.send(e);
  })
}

const edit = (req, res) => {
  const token = req.queryString('token');
  const id = req.queryString('id');
  const company = req.queryString('company');
  const time = req.queryString('time');
  const staff_id = req.queryString('staff_id');
  editAppointment({token, id, company, time, staff_id}).then((appointments) => {
    res.send(appointments);
  }).catch((error) => {
    res.send(error);
  })
}

module.exports = {
  get,
  create,
  deleteAction,
  getMine,
  edit
}
