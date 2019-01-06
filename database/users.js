const {dbQuery} = require("./connections.js");
const bcrypt = require('bcrypt');


const createUser = (email, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function(err, hash) {
      if(err){
        reject(err);
      }else{
        dbQuery(`INSERT INTO users (email, password) VALUES(?, ?);`, [email, hash], (error, rows, fields) => {
          if(error){
            reject({error: `Database Issue: ${error}`});
          }else{
            dbQuery(`SELECT * FROM users WHERE email = ?`, [email], (error, rows, fields) => {
              if(error){
                reject({error: `Select Issue: ${error}`});
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
      dbQuery(`SELECT * FROM users WHERE email = ?`, [email], (error, rows, fields) => {
        if(error){
          reject(`Database Issue: ${error}`);
        }else{
          if(rows[0] && bcrypt.compareSync(password, rows[0].password)){
            const token = Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2);
            dbQuery(`INSERT INTO sessions (user_id, expiration, token) VALUES(${rows[0].id}, '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', '${token}')`, (error2, rows2, fields) => {
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
    dbQuery(`SELECT * FROM sessions WHERE token = ?`, [token], (error, rows, fields) => {
      if(error){
        reject(`Database Issue: ${error}`);
      }else{
        const x = new Date();
        const UTCtime = (x.getTime() + x.getTimezoneOffset()*60*1000);
        const elapsedTime = rows[0] ? (UTCtime - rows[0].expiration.getTime())/(1000*60) : 3000;
        if(rows[0] && rows[0].token == token && elapsedTime < 60){
          dbQuery(`UPDATE sessions SET expiration = ? WHERE token = ?`, [new Date().toISOString().slice(0, 19).replace('T', ' '), token], (error2, rows2, fields) => {
            if(error2){
              reject(error2);
            }else{
              resolve(rows[0]);
            }
          });
        }else{
          reject({error: 'Invalid Token'});
        }
      }
    });
  });
}

const getUser = (token) => {
  return new Promise((resolve, reject) => {
      authenticate(token).then((session) => {
          dbQuery(`SELECT id, email, role FROM users WHERE id = ?`, [session.user_id], (error, rows, fields) => {
            if(error){
              reject(error);
            }else{
              resolve(rows[0]);
            }
          });
      }).catch((e) => {
        reject(e);
      });
  })
}

const authenticateAdmin = (token) => {
  return new Promise((resolve, reject) => {
    getUser(token).then((user) => {
      if(user.role === "admin"){
        resolve(user);
      }else{
        reject({error: "You must be an admin to perform this action."});
      }
    }).catch((error) => {
      reject(error);
    });
  });
}

module.exports = {
  createUser,
  createSession,
  authenticate,
  getUser,
  authenticateAdmin
}
