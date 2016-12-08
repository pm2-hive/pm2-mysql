var pmx = require('pmx');

function init(metrics, mysqlClient) {
  var queryString = "SHOW VARIABLES ;";

  mysqlClient.query(queryString, function (err, rows) {
    if (err) {
      return pmx.notify("SHOW VARIABLES Query Error: " + err);
    }

    rows.forEach(function (row) {
      if (row.Variable_name === "version") {
        metrics.version.set(row.Value);
      }
      if (row.Variable_name === "max_connections") {
        metrics.maxConnections.set(row.Value);
      }
    });
  });
}

module.exports = init;