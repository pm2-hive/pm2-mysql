var pmx = require('pmx');
var shelljs = require('shelljs');
var shellescape = require('shell-escape');

function init(mysqlClient) {
  var conf = pmx.getConf();

  // Show Slow Queries
  pmx.action('Slow Queries', function (reply) {
    var args = ['mysqldumpslow', conf.slowQueriesLog, '-a'];
    shelljs.exec(shellescape(args), {async: true, silent: true}, function (err, out) {
      if (err) {
        return reply("Couldn't get slow queries: " + err);
      }

      reply(out);
    });
  });

  // Last Queries
  pmx.action('Last Queries', function (reply) {
    var args = ['tail', '-n', conf.lastQueriesSize, conf.generalLog];
    shelljs.exec(shellescape(args), {async: true, silent: true}, function (err, out) {
      if (err) {
        return reply("Couldn't get last queries: " + err);
      }

      reply(out);
    });
  });

  // Last Errors
  pmx.action('Last Errors', function (reply) {
    var args = ['tail', '-n', conf.lastErrorsSize, conf.errorLog];
    shelljs.exec(shellescape(args), {async: true, silent: true}, function (err, out) {
      if (err) {
        return reply("Couldn't get last errors: " + err);
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
