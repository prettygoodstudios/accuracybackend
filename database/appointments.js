const {connection} = require("./connections.js");
const {authenticate} = require("./users.js");

const getAppointments = new Promise((resolve, reject) => {
  connection.query('SELECT * FROM appointments;', (error, rows, fields) => {
    if(error){
      reject(error);
    }else{
      resolve(rows);
    }
  });
});

const createAppointments = ({company, time, staff_id, token}) => {
  return new Promise((resolve, reject) => {
    authenticate(token).then((session) => {
      connection.query(`INSERT INTO appointments (company, time, staff_id, user_id) VALUES('${company}', '${time}', ${staff_id}, ${session.user_id})`, (error, rows, fields) => {
        if(error){
          reject(error);
        }else{
          getAppointments.then((appointments) => {
            resolve(appointments);
          }).catch((error2) => {
            reject(error2);
          });
        }
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

module.exports = {
  getAppointments,
  createAppointments
}
