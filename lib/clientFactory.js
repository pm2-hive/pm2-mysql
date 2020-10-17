var mysql = require('mysql2');
var pmx = require('pmx');

function build(conf) {
  var mysqlClient = {};

  var pool = mysql.createPool({
    connectionLimit: 10,
    host: conf.host,
    port: conf.port,
    user: conf.user,
    password: conf.password.toString()
  });

  mysqlClient.query = function (queryString, cb) {
    pool.getConnection(function (err, connection) {
      if (err) {
        return cb(err);
      }

      connection.query(queryString, function (err, rows, fields) {
        connection.release();        // And done with the connection.
        if (err) {
          return cb(err);
        }

        cb(null, rows, fields);
      });
    });
  };

  return mysqlClient;
}

module.exports.build = build;
