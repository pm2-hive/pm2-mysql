var pmx = require('pmx');
var Hwmon = require('hwmon');

function init(metrics) {
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