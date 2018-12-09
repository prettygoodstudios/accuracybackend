const {connection} = require("./connections.js");
const bcrypt = require('bcrypt');

function mysqlTimeStampToDate(mysqlTime) {
  //function parses mysql datetime string and returns javascript Date object
  //input has to be in this format: 2007-06-05 15:26:02
  const timestamp = mysqlTime.toString();
  const regex=/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
  const parts=timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');
  return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);

}

const createUser = (email, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function(err, hash) {
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

const createSession = (email, password) => {
  return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM users WHERE email = '${email}'`, (error, rows, fields) => {
        if(error){
          reject(`Database Issue: ${error}`);
        }else{
          if(rows[0] && bcrypt.compareSync(password, rows[0].password)){
            const token = Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2);
            connection.query(`INSERT INTO sessions (user_id, expiration, token) VALUES(${rows[0].id}, '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', '${token}')`, (error2, rows2, fields) => {
              if(error2){
                reject(error2);
              }else{
                resolve(token);
              }
            });
          }else{
            reject('Incorrect Password');
          }
        }
      });
  });
}

const authenticate = (token) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM sessions WHERE token = '${token}'`, (error, rows, fields) => {
      if(error){
        reject(`Database Issue: ${error}`);
      }else{
        const x = new Date();
        const UTCtime = (x.getTime() + x.getTimezoneOffset()*60*1000);
        const elapsedTime = (UTCtime - rows[0].expiration.getTime())/(1000*60);
        if(rows[0] && rows[0].token == token && elapsedTime < 60){
          connection.query(`UPDATE sessions SET expiration = '${new Date().toISOString().slice(0, 19).replace('T', ' ')}' WHERE token = '${token}'`, (error2, rows2, fields) => {
            if(error2){
              reject(error2);
            }else{
              resolve(true);
            }
          });
        }else{
          reject('Invalid Token');
        }
      }
    });
  });
}

module.exports = {
  createUser,
  createSession,
  authenticate
}
