const {dbQuery} = require("./connections.js");
const {authenticate, getUser} = require("./users.js");


const commitAppointments = (error) => {
  return new Promise((resolve, reject) => {
    if(error){
      reject(error);
    }else{
      dbQuery('COMMIT', () => {
        getAppointments.then((appointments) => {
          resolve(appointments);
        }).catch((error2) => {
          reject(error2);
        });
      });
    }
  });
}

const getAppointments = new Promise((resolve, reject) => {
  const x = new Date();
  const UTCtime = (x.getTime() + x.getTimezoneOffset()*60*1000);
  const weekAgo = new Date(UTCtime - 60*60*1000*24*7);
  dbQuery(`SELECT * FROM appointments WHERE time > STR_TO_DATE('${weekAgo.toISOString().slice(0, 19).replace('T', ' ')}', '%Y-%m-%d %H:%i:%s');`, (error, rows, fields) => {
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
      dbQuery(`INSERT INTO appointments (company, time, staff_id, user_id) VALUES('${company}', STR_TO_DATE('${time}', '%Y-%m-%d %H:%i:%s'), ${staff_id}, ${session.user_id});`, (error, rows, fields) => {
        if(error){
          reject({error, query: `INSERT INTO appointments (company, time, staff_id, user_id) VALUES('${company}', '${time}', ${staff_id}, ${session.user_id})`});
        }else{
          dbQuery('SELECT * FROM appointments ORDER BY id DESC;', (error2, rows2, fields) => {
            if(error2){
              reject(error2);
            }else{
              resolve(rows2);
            }
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
      dbQuery(`SELECT * FROM appointments WHERE id = ${id};`, (error, rows, fields) => {
        if(error){
          reject(error);
        }else{
          if(user.role === "admin" || user.id == rows[0].user_id){
            dbQuery(`DELETE FROM appointments WHERE id = ${id};`, (error2, rows2, fields) => {
              commitAppointments(error2).then((appointments) => {
                resolve(appointments);
              }).catch((error) => {
                reject(error);
              });
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
