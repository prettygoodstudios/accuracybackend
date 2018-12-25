const {dbQuery} = require('./connections.js');
const {authenticate, authenticateAdmin} = require('./users.js');


const getReveiws = new Promise((resolve, reject) => {
  dbQuery('SELECT * FROM reviews ORDER BY id DESC;', (error, rows, fields) => {
    if(error){
      reject(error);
    }else{
      resolve(rows);
    }
  });
});

const createReview = ({score, message, token}) => {
  return new Promise((resolve, reject) => {
    authenticate(token).then((session) => {
      dbQuery(`INSERT INTO reviews (score, message, user_id) VALUES(?, ?, ?)`, [score, message, session.user_id], (error, rows, fields) => {
        if(error){
          reject(error);
        }else{
          getReveiws.then((reviews) => {
            resolve(reviews);
          }).catch((e2) => {
            reject(e2);
          });
        }
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

module.exports = {
  getReveiws,
  createReview
}
