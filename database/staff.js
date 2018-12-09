const {connection} = require("./connections.js");
const {authenticate} = require("./users.js");

const createStaff = ({token, name, jobTitle}) => {
  return new Promise((resolve, reject) => {
    authenticate(token).then((data) => {
        connection.query(`INSERT INTO staff (name, job_title) VALUES('${name}', '${jobTitle}')`, (error, rows, fields) => {
          if(error){
            reject(error);
          }else{
            connection.query('SELECT * FROM staff', (error2, rows2, fields) => {
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

module.exports = {
  createStaff
}
