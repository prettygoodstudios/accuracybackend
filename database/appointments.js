const {connection} = require("./connections.js");

const getAppointments = new Promise((resolve, reject) => {
  connection.query('SELECT * FROM appointments;', (error, rows, fields) => {
    if(error){
      connection.end();
      reject(error);
    }else{
      connection.end();
      resolve(rows[0]);
    }
  });
});

module.exports = {
  getAppointments
}
