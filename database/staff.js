const {dbQuery} = require("./connections.js");
const {authenticate, authenticateAdmin} = require("./users.js");

const createStaff = ({token, name, jobTitle}) => {
  return new Promise((resolve, reject) => {
    authenticateAdmin(token).then((data) => {
        dbQuery(`INSERT INTO staff (name, job_title) VALUES('${name}', '${jobTitle}')`, (error, rows, fields) => {
          if(error){
            reject(error);
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

const getStaff = new Promise((resolve, reject) => {
  dbQuery('SELECT * FROM staff;', (error, rows, fields) => {
    if(error){
      reject(error);
    }else{
      resolve(rows);
    }
  });
});

const deleteStaff = ({id, token}) => {
  return new Promise((resolve, reject) => {
    authenticateAdmin(token).then((user) => {
      dbQuery(`DELETE FROM staff WHERE id = ${id}`, (error, rows, fields) => {
        if(error){
          reject(error);
        }else{
          getStaff.then((staff) => {
            resolve(staff);
          }).catch((error2) => {
            reject(error2);
          });
        }
      });
    }).catch((error) => {
      reject(error);
    })
  });
}

module.exports = {
  createStaff,
  getStaff,
  deleteStaff
}
