var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var command = process.argv[2];

var serialPort = new SerialPort("/dev/ttyACM0", {
  baudrate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false,
  parser: serialport.parsers.readline("\r")
});

serialPort.on("open", function () {
  console.log('open');

  serialPort.on('data', function(data) {
      result = data.trim();
      console.log('data received: ' + result);
      if (result === 'OK') {
          console.log('command successful');
      }
      else {
          console.log('command not successful');
      }
  });

  setTimeout(function() {
      console.log("waiting...");
      command = command + '#'
    serialPort.write(command, function(err, results) {
      console.log('err ' + err);
      console.log('results ' + results);
    });
  }, 3000);

  serialPort.on('error', function (err) {
      console.error("error", err);
  });
});
