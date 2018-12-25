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

const deleteReview = ({token, id}) => {
  return new Promise((resolve, reject) => {
    if(!id){
      authenticate(token).then((session) => {
        dbQuery(`DELETE FROM reviews WHERE user_id = ?`, [session.user_id], (error, rows, fields) => {
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
      });
    }else{
      authenticateAdmin(token).then((session) => {
        dbQuery('DELETE FROM reviews WHERE id = ?;', [id], (error, rows, fields) => {
          if(error){
            reject(error);
          }else{
            getReveiws.then((reviews) => {
              resolve(reviews);
            }).catch((error2) => {
              reject(error2);
            });
          }
        });
      }).catch((error) => {
        reject(error);
      });
    }
  });
}

const editReview = ({token, id, score, message}) => {
  return new Promise((resolve, reject) => {
    if(!id){
      authenticate(token).then((session) => {
        let params = [];
        let paramQuery = '';
        if(score){
          params.push(score);
          paramQuery += 'score = ?';
        }
        if(message){
          params.push(message);
          if(score){
            paramQuery += ', ';
          }
          paramQuery += 'message = ?';
        }
        params.push(session.user_id)
        dbQuery(`UPDATE reviews SET ${paramQuery} WHERE user_id = ?;`, params, (error, rows, fields) => {
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
    }else{
      authenticateAdmin(token).then((session) => {
        let params = [];
        let paramQuery = '';
        if(score){
          params.push(score);
          paramQuery += 'score = ?';
        }
        if(message){
          params.push(message);
          if(score){
            paramQuery += ', ';
          }
          paramQuery += 'message = ?';
        }
        params.push(id)
        dbQuery(`UPDATE reviews SET ${paramQuery} WHERE id = ?;`, params, (error, rows, fields) => {
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
    }
  });
}

module.exports = {
  getReveiws,
  createReview,
  deleteReview,
  editReview
}
