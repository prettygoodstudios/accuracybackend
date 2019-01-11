const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const myDB = mysql.createConnection({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 10,
  authSwitchHandler: function ({pluginName, pluginData}, cb) {
    if (pluginName === 'ssh-key-auth') {
      getPrivateKey(key => {
        const response = encrypt(key, pluginData);
        // continue handshake by sending response data
        // respond with error to propagate error to connect/changeUser handlers
        cb(null, response);
      });
    } else {
      const err = new Error(`Unknown AuthSwitchRequest plugin name ${pluginName}`);
      err.fatal = true;
      cb(err);
    }
  }
});


const dbQuery = (query, params, callBack) => {
  myDB.query('START TRANSACTION', () => {
    myDB.query(query, Array.isArray(params) ? params : [], (error, rows, fields) => {
      myDB.query('COMMIT', () => {
        if(callBack){
          callBack(error, rows, fields);
        }else{
          params(error, rows, fields);
        }
      });
    });
  });
}

module.exports  = {
  dbQuery
}
