const {dbQuery} = require("./connections.js");
const {authenticate, getUser, authenticateAdmin} = require("./users.js");


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
  dbQuery(`SELECT time, staff_id FROM appointments WHERE time > STR_TO_DATE('${weekAgo.toISOString().slice(0, 19).replace('T', ' ')}', '%Y-%m-%d %H:%i:%s');`, (error, rows, fields) => {
    if(error){
      reject(error);
    }else{
      resolve(rows);
    }
  });
});

const editAppointment = ({token, company, time, staff_id, id}) => {
  return new Promise((resolve, reject) => {
    authenticate(token).then((session) => {
      dbQuery(`SELECT * FROM appointments WHERE id = ?`, [id], (error, rows, fields) => {
        if(error){
          reject(error);
        }else{
          if(session.user_id == rows[0].user_id){
            let params = [];
            let paramQuery = '';
            if(company){
              params.push(company);
              paramQuery += "company = ?";
            }
            if(time){
              params.push(time);
              if(company){
                paramQuery += ",";
              }
              paramQuery += " time = ?";
            }
            if(staff_id){
              params.push(staff_id);
              if(company || time){
                paramQuery += ",";
              }
              paramQuery += " staff_id = ?";
            }
            params.push(id);
            dbQuery(`UPDATE appointments SET ${paramQuery} where id = ?;`, params, (error3, rows, fields) => {
              if(error3){
                reject(error3);
              }else{
                getMyAppointments(token).then((appointments) => {
                  resolve(appointments);
                }).catch((error4) => {
                  reject(error4);
                });
              }
            });
          }else{
            authenticateAdmin(token).then((admin) => {
              let params = [];
              let paramQuery = '';
              if(company){
                params.push(company);
                paramQuery += "company = ?";
              }
              if(time){
                params.push(time);
                if(company){
                  paramQuery += ",";
                }
                paramQuery += " time = ?";
              }
              if(staff_id){
                params.push(staff_id);
                if(company || time){
                  paramQuery += ",";
                }
                paramQuery += " staff_id = ?";
              }
              params.push(id);
              dbQuery(`UPDATE appointments SET ${paramQuery} where id = ?;`, params, (error3, rows, fields) => {
                if(error3){
                  reject(error3);
                }else{
                  getMyAppointments(token).then((appointments) => {
                    resolve(appointments);
                  }).catch((error4) => {
                    reject(error4);
                  });
                }
              });
            }).catch((error2) => {
              reject(error2);
            });
          }
        }
      });
    }).catch((error) => {
      reject(error);
    })
  });
}

const getMyAppointments = (token) => {
  return new Promise((resolve, reject) => {
    authenticate(token).then((session) => {
      authenticateAdmin(token).then((admin) => {
        dbQuery(`SELECT * FROM appointments;`, (error, rows, fields) => {
          if(error){
            reject(error);
          }else{
            resolve(rows);
          }
        });
      }).catch((e) => {
        dbQuery(`SELECT * FROM appointments WHERE user_id = ?`, [session.user_id], (error, rows, fields) => {
          if(error){
            reject(error);
          }else{
            resolve(rows);
          }
        });
      });
    }).catch((e) => {
      reject(e);
    });
  });
}

const createAppointments = ({company, time, staff_id, token}) => {
  return new Promise((resolve, reject) => {
    authenticate(token).then((session) => {
      dbQuery(`INSERT INTO appointments (company, time, staff_id, user_id) VALUES(?, STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'), ?, ?);`, [company, time, staff_id, session.user_id], (error, rows, fields) => {
        if(error){
          reject({error, query: `INSERT INTO appointments (company, time, staff_id, user_id) VALUES('${company}', '${time}', ${staff_id}, ${session.user_id})`});
        }else{
          dbQuery('SELECT time, staff_id FROM appointments ORDER BY id DESC;', (error2, rows2, fields) => {
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
      dbQuery(`SELECT * FROM appointments WHERE id = ?;`, [id], (error, rows, fields) => {
        if(error){
          reject(error);
        }else{
          if(user.role === "admin" || user.id == rows[0].user_id){
            dbQuery(`DELETE FROM appointments WHERE id = id;`, [id], (error2, rows2, fields) => {
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
  deleteAppointment,
  getMyAppointments,
  editAppointment
}
