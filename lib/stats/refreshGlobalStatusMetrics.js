var pmx = require('pmx');

module.exports = function refreshGlobalStatusMetrics(metrics, mysqlClient) {
  var queryString = "SHOW GLOBAL STATUS;";

  var varNames = {
    'Innodb_data_pending_reads': 'preads',
    'Open_files': 'openFiles',
    'Innodb_buffer_pool_read_requests': 'poolRead',
    'Innodb_rows_read': 'rread',
    'Bytes_sent': 'bsent',
    'Connections': 'con',
    'Questions': 'quest',
    'Uptime': 'uptime',
    'Threads_running': 'threadsRunning',
    'Threads_connected': 'threadsConnected',
    'Max_used_connections': 'maxUsedConnections',
    'Innodb_row_lock_waits': 'rowLockWaits',
    'Innodb_buffer_pool_wait_free': 'bufferPoolWaitFree',
    'Open_tables': 'openTables',
    'Aborted_connects': 'abortedConnects',
  };

  mysqlClient.query(queryString, function (err, rows) {
    if (err) {
      return pmx.notify("GLOBAL STATUS Query Error: " + err);
    }

    rows.forEach(function (row) {
      var metricName = varNames[row.Variable_name];
      if (metricName) {
        var lastMetric = metrics['last' + metricName];
        if (lastMetric !== undefined) {
          if (lastMetric === 'N/A') {
            metrics[metricName].set(0);
          } else {
            metrics[metricName].set((row.Value - lastMetric) * (1000 / pmx.getConf().refreshRate));
          }
          metrics['last' + metricName] = row.Value;
        }
        else {
          metrics[metricName].set(row.Value);
        }
      }
    });

    if(metrics.maxConnections.val()){
      metrics.maxUsedConnectionsPerc.set(parseInt(metrics.maxUsedConnections.val()/metrics.maxConnections.val() *100));
    }

  });
};