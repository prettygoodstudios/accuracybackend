const {connection} = require("./connections.js");
const bcrypt = require('bcrypt');

const createUser = (email, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(email, 10, function(err, hash) {
      if(err){
        reject(err);
      }else{
        console.log(hash);
        connection.query(`INSERT INTO users (email, password) VALUES('${email}','${hash}');`, (error, rows, fields) => {
          if(error){
            reject(`Database Issue: ${error}`);
          }else{
            console.log('Second Connection');
            connection.query(`SELECT * FROM users WHERE email = '${email}'`, (error, rows, fields) => {
              if(error){
                reject(`Select Issue: ${error}`);
              }else{
                resolve(rows[0]);
              }
            });
          }
        });
      }
    });
  });
}

module.exports = {
  createUser
}
