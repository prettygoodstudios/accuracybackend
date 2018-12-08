const {connection} = require("./connections.js");

const getAppointments = new Promise((resolve, reject) => {
  connection.query('SELECT * FROM appointments;', (error, rows, fields) => {
    if(error){
      reject(error);
    }else{
      resolve(rows[0]);
    }
  });
});

module.exports = {
  getAppointments
}
