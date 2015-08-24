var pmx     = require('pmx');
var mysql   = require('mysql');

// Initialize the module
var conf    = pmx.initModule({

    pid              : pmx.resolvePidPaths(['var/run/mysqld/mysqld.pid',
                                             'var/run/mysql/mysql.pid',
                                             'var/run/mysql.pid',
                                             'var/run/mysqld.pid']),

    widget : {

      // Module display type. Currently only 'generic' is available
      type : 'generic',

      // Logo to be displayed on the top left block
      // Must be https
      logo : 'https://www.mysql.com/common/logos/logo-mysql-170x115.png',

      // 0 = main element
      // 1 = secondary
      // 2 = main border
      // 3 = secondary border
      // 4 = text color (not implemented yet)
      theme : ['#F79618', '#015A84', 'black', '#F79618'],

      // Toggle horizontal blocks above main widget
      el : {
        probes : true,
        actions: false
      },

      block : {
        // Display remote action block
        actions : false,

        // Display CPU / Memory
        cpu     : true,
        mem     : true,

        // Issues count display
        issues  : true,

        // Display meta block
        meta    : true,

        // Display metadata about the probe (restart nb, interpreter...)
        meta_block : false,

        // Name of custom metrics to be displayed as a "major metrics"
        main_probes : ['questions/s', 'connections/s', 'Total Processes', 'Threads Running', 'Pending Reads', 'Buffer Read']
      },
    },

    // Status (in the future, not implemented yet)
    status_check : ['latency', 'event loop', 'query/s']
    //= Status Green / Yellow / Red (maybe for probes?)

});

conf.connection = mysql.createConnection({
  host     : conf.module_conf.host,
  user     : conf.module_conf.user,
  password : conf.module_conf.password
});

conf.connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + conf.connection.threadId);
});

var queries = require('./lib/queries');
