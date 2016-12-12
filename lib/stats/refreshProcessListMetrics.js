var pmx = require('pmx');

module.exports = function refreshBackendMetrics(metrics, mysqlClient) {
  var queryString = "SHOW FULL PROCESSLIST;";

  mysqlClient.query(queryString, function (err, rows) {
    if (err) {
      return pmx.notify("PROCESSLIST Query Error: " + err);
    }

    // Total Processes count
    metrics.totalProcesses.set(rows.length);
  });
};