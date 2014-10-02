var serialport = require("serialport");
var SerialPort = serialport.SerialPort

var sp = new SerialPort("/dev/tty.usbmodem1431", {
  parser: serialport.parsers.readline("\n")
});

sp.open(function (err) {
  if (err) console.log('failed to open: '+error);
  else {
    console.log('open');
    sp.on('data', function(data) {
      console.log('sv:' + data);
    });
    sp.write("MIT#\n");
    sp.write("Gmail#\n");
  }
});
