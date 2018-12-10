const {connection} = require("./connections.js");
const {authenticate, getUser} = require("./users.js");

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

const deleteAppointment = ({token, id}) => {
  return new Promise((resolve, reject) => {
    getUser(token).then((user) => {
      connection.query(`SELECT * FROM appointments WHERE id = ${id};`, (error, rows, fields) => {
        if(error){
          reject(error);
        }else{
          if(user.role === "admin" || user.id == rows[0].user_id){
            connection.query(`DELETE FROM appointments WHERE id = ${id};`, (error2, rows2, fields) => {
              if(error2){
                reject(error2);
              }else{
                getAppointments.then((appointments) => {
                  resolve(appointments);
                }).catch((error3) => {
                  reject(error3);
                });
              }
            });
          }else{
            reject("It must be your own appointment inorder to cancel it.");
          }
        }
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

module.exports = {
  getAppointments,
  createAppointments,
  deleteAppointment
}
