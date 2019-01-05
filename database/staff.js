const {dbQuery} = require("./connections.js");
const {authenticate, authenticateAdmin} = require("./users.js");

const createStaff = ({token, name, jobTitle}) => {
  return new Promise((resolve, reject) => {
    authenticateAdmin(token).then((data) => {
        dbQuery(`INSERT INTO staff (name, job_title) VALUES(?, ?)`, [name, jobTitle], (error, rows, fields) => {
          if(error){
            reject({error});
          }else{
            dbQuery('SELECT * FROM staff', (error2, rows2, fields) => {
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

const getStaff = () => {
  return new Promise((resolve, reject) => {
    dbQuery('SELECT * FROM staff;', (error, rows, fields) => {
      if(error){
        reject({error});
      }else{
        resolve(rows);
      }
    });
  });
}

const editStaff = ({name, jobTitle, id, token}) => {
  return new Promise((resolve, reject) => {
    authenticateAdmin(token).then((session) => {
      let params = [];
      let paramQuery = '';
      if(name){
        params.push(name);
        paramQuery += 'name = ?';
      }
      if(jobTitle){
        params.push(jobTitle);
        if(name){
          paramQuery += ',';
        }
        paramQuery += ' job_title = ?';
      }
      params.push(id);
      dbQuery(`UPDATE staff SET ${paramQuery} WHERE id = ?;`, params, (error, rows, fields) => {
        if(error){
          reject({error});
        }else{
          getStaff().then((staff) => {
            resolve(staff);
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

const deleteStaff = ({id, token}) => {
  return new Promise((resolve, reject) => {
    authenticateAdmin(token).then((user) => {
      dbQuery('DELETE FROM appointments WHERE staff_id = ?', [id], (e1, r1, f1) => {
        if(e1){
          reject({error: e1});
        }else{
          dbQuery(`DELETE FROM staff WHERE id = ?;`, [id], (error, rows, fields) => {
            if(error){
              reject({error});
            }else{
              getStaff().then((staff) => {
                resolve(staff);
              }).catch((error2) => {
                reject(error2);
              });
            }
          });
        }
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

module.exports = {
  createStaff,
  getStaff,
  deleteStaff,
  editStaff
}
