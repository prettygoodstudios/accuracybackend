const {createStaff, getStaff} = require("../database/staff.js");

const create = (req, res) => {
  const token = req.queryString('token');
  const jobTitle = req.queryString('jobTitle');
  const name = req.queryString('name');
  if(name != "" || jobTitle != ""){
    createStaff({token, name, jobTitle}).then((staff) => {
      res.send(staff);
    }).catch((error) => {
      res.send(error);
    });
  }else{
    res.send("You must provide both a name and job title.");
  }
}

const get = (req, res) => {
  getStaff.then((staff) => {
    res.send(staff);
  }).catch((error) => {
    res.send(error);
  })
}

module.exports = {
  create,
  get
}
