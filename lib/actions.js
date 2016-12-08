var pmx = require('pmx');
var shelljs = require('shelljs');

function init(mysqlClient) {

  // Show Slow Queries
  pmx.action('Slow Queries', function (reply) {
    shelljs.exec('mysqldumpslow ' + pmx.getConf().slowQueriesLog, {async: true, silent: true}, function (err, out) {
      if (err) {
        return reply("Couldn't get slow queries: " + err);
      }

      reply(out);
    });
  });

  // Last Queries
  pmx.action('Last Queries', function (reply) {
    shelljs.exec('tail ' + pmx.getConf().generalLog, {async: true, silent: true}, function (err, out) {
      if (err) {
        return reply("Couldn't get last queries: " + err);
      }

      reply(out);
    });
  });

  // List Databases
  pmx.action('List DBs', function (reply) {
    mysqlClient.query("SHOW DATABASES;", function (err, rows) {
      if (err) {
        return reply("Couldn't list databases: " + err);
      }

      var output = "";
      rows.forEach(function (row) {
        output += row.Database + "\r\n";
      });
      reply(output);
    });
  });

}

module.exports.init = init;