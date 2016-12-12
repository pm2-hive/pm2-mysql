var pmx = require('pmx');
var shelljs = require('shelljs');

function init(metrics) {
  shelljs.exec('iostat', {async: true, silent: true}, function (err, out) {
    if (err) {
      return pmx.notify("iostat is not available. IO monitoring disabled");
    }

    startMonitoring(metrics);
  });
}

function startMonitoring(metrics) {
  var Hwmon = require('hwmon');
  var hwmon = new Hwmon({interval: 1000});

  hwmon.on('iostat', function (data) {
    if (data['avg-cpu:'] && data['avg-cpu:']['%iowait']) {
      metrics.ioWait.set(data['avg-cpu:']['%iowait']);
    }

    var deviceName = pmx.getConf().dbDiskName || 'sda';
    if (data['devices'] && data['devices'][deviceName]) {
      if (data['devices'][deviceName]['kB_read/s']) {
        metrics.ioReadRate.set(data['devices'][deviceName]['kB_read/s']);
      }
      if (data['devices'][deviceName]['kB_wrtn/s']) {
        metrics.ioWriteRate.set(data['devices'][deviceName]['kB_wrtn/s']);
      }
    }
  });

  hwmon.start();
}

module.exports = {
  init: init
};