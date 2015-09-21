var pmx   = require('pmx');
var mysql = require('mysql');

var probe = pmx.probe();
var conf = pmx.getConf();

var con = new probe.metric({
  name  : 'connections/s',
  value : 0
});
var lastCon = 'N/A';

var bsent = new probe.metric({
  name  : 'Bytes Sent/s',
  value : 0
});
var lastBsent = 'N/A';

var rread = new probe.metric({
  name  : 'Rows Read/s',
  value : 0
});
var lastRread = 'N/A';

var total = new probe.metric({
  name  : 'Total Processes',
  value : 'N/A'
});

var quest = new probe.metric({
  name : 'questions/s',
  value: 0
});
var lastQuest = 'N/A';

var threads = new probe.metric({
  name  :'Threads Running',
  value : 'N/A'
});

var preads = new probe.metric({
  name : 'Pending Reads',
  value: 'N/A'
});

var openFiles = new probe.metric({
  name  : 'Open Files' ,
  value : 'N/A'
});

var poolRead = new probe.metric({
  name  : 'Buffer Read',
  value : 'N/A'
});

//List of /s metrics and their older values
var metricsPerSec = ['Innodb_rows_read', 'Bytes_sent', 'Connections', 'Questions'];
var lastMetrics = [lastRread, lastBsent, lastCon, lastQuest];
var metricsProbes = [rread, bsent, con, quest];

var connection = mysql.createConnection({
  host     : conf.host,
  port     : conf.port,
  user     : conf.user,
  password : conf.password
});

setInterval(function() {
 
  connection.query('SELECT 1', function(err, rows) {
    if (err) {
	  connection = mysql.createConnection({
  		host     : conf.module_conf.host,
  		user     : conf.module_conf.user,
		password : conf.password
	  });
	  connection.connect(function(err){
  		if (err)
		  pmx.notify(err);
	  });
	}
  });

  connection.query('SHOW FULL PROCESSLIST', function(error, results, infos) {
  if (!error)
    total.set(results.length);
  else {
    total.set('Error');
  }

  connection.query('SHOW GLOBAL STATUS', function(error, results, infos) {
    if (!error) {
      results.forEach(function(el) {
        if (el.Variable_name === 'Threads_running')
          threads.set(el.Value);
        else if (el.Variable_name === 'Innodb_data_pending_reads')
          preads.set(el.Value);
        else if (el.Variable_name === 'Open_files')
          openFiles.set(el.Value);
        else if (el.Variable_name === 'Innodb_buffer_pool_read_requests')
          poolRead.set(el.Value);
        else
          for (var i = 0; i < metricsPerSec.length; i++) {
            if (el.Variable_name === metricsPerSec[i]) {
              if (lastMetrics[i] !== 'N/A')
                metricsProbes[i].set(el.Value - lastMetrics[i]);
              else
                metricsProbes[i].set(0);
              lastMetrics[i] = el.Value;
            }
        }
      });
    }
    else
      metricsProbes.forEach(function(el){
        el.set('Error');
      });
  });
})}, 1000);
