var pmx = require('pmx');

var refreshProcessListMetrics = require('./stats/refreshProcessListMetrics');
var refreshGlobalStatusMetrics = require('./stats/refreshGlobalStatusMetrics');

var initMysqlVars = require('./stats/initMysqlVars');
var ioMetrics = require('./stats/ioMetrics');

var metrics = {};
var probe = pmx.probe();

// Init metrics with default values
function initMetrics() {
  metrics.con = new probe.metric({
    name: 'connections/s',
    value: 0
  });
  metrics.lastcon = 'N/A';

  metrics.bsent = new probe.metric({
    name: 'Bytes Sent/s',
    value: 0
  });
  metrics.lastbsent = 'N/A';

  metrics.rread = new probe.metric({
    name: 'Rows Read/s',
    value: 0
  });
  metrics.lastrread = 'N/A';

  metrics.totalProcesses = new probe.metric({
    name: 'Total Processes',
    value: 'N/A'
  });

  metrics.quest = new probe.metric({
    name: 'questions/s',
    value: 0
  });
  metrics.lastquest = 'N/A';

  metrics.threadsRunning = new probe.metric({
    name: 'Threads Running',
    value: 'N/A'
  });

  metrics.preads = new probe.metric({
    name: 'Pending Reads',
    value: 'N/A'
  });

  metrics.openFiles = new probe.metric({
    name: 'Open Files',
    value: 'N/A'
  });

  metrics.poolRead = new probe.metric({
    name: 'Buffer Read',
    value: 'N/A'
  });

  metrics.uptime = new probe.metric({
    name: 'Uptime',
    value: 'N/A',
    alert: {
      mode: 'threshold-avg',
      value: 180,
      msg: 'Too many Server Restarts',
      cmp: "<",
      interval: 600
    }
  });

  metrics.threadsConnected = new probe.metric({
    name: 'Threads Connected',
    value: 'N/A',
    alert: {
      mode: 'threshold-avg',
      value: 0,
      msg: 'No Threads Connected',
      cmp: "=",
      interval: 60
    }
  });

  metrics.version = new probe.metric({
    name: 'MySQL Version',
    value: 'N/A'
  });

  metrics.maxUsedConnections = new probe.metric({
    name: 'Max Used Connections',
    value: 'N/A'
  });
  metrics.maxConnections = new probe.metric({
    name: 'Max Connections',
    value: 'N/A'
  });
  metrics.maxUsedConnectionsPerc = new probe.metric({
    name: '% Max Used Connections',
    value: 'N/A',
    alert: {
      mode: 'threshold-avg',
      value: 85,
      msg: 'Connections could run out soon',
      cmp: ">",
      interval: 60
    }
  });

  metrics.abortedConnects = new probe.metric({
    name: 'Aborted_connects',
    value: 'N/A',
    alert: {
      mode: 'threshold-avg',
      value: 50,
      msg: 'Aborted connects too high',
      cmp: ">",
      interval: 60
    }
  });

  metrics.rowLockWaits = new probe.metric({
    name: 'Row Lock Waits',
    value: 'N/A'
  });
  metrics.bufferPoolWaitFree = new probe.metric({
    name: 'Row Lock Waits',
    value: 'N/A'
  });
  metrics.openTables = new probe.metric({
    name: 'Open Tables',
    value: 'N/A'
  });

  metrics.ioWait = new probe.metric({
    name: '% IO WAIT',
    value: 'N/A'
  });
  metrics.ioReadRate = new probe.metric({
    name: 'IO Read kb/s',
    value: 'N/A'
  });
  metrics.ioWriteRate = new probe.metric({
    name: 'IO Write kb/s',
    value: 'N/A'
  });
}

// Refresh metrics
function refreshMetrics(mysqlClient) {
  refreshProcessListMetrics(metrics, mysqlClient);
  refreshGlobalStatusMetrics(metrics, mysqlClient);
}

function init(mysqlClient) {
  initMetrics();
  ioMetrics.init(metrics);
  setInterval(refreshMetrics.bind(this, mysqlClient), pmx.getConf().refreshRate);
  initMysqlVars(metrics, mysqlClient);
}

module.exports.init = init;