var request = require('request');
var parseString = require('xml2js').parseString;
var _ = require('underscore');
var config = require('./config');
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var serialPort = new SerialPort("/dev/ttyACM0", {
    baudrate: 9600,
    parser: serialport.parsers.readline("\n")
});

serialPort.open(function(err) {
  if (err) console.log('failed to open: '+err);
  else {
    console.log('open');
    serialPort.on('data', function(data) {
      console.log(data);
    });
    serial.Port.write('Email from ddh@mit.edu', function(err, result){
        if(err) console.log(err)
        else
            console.log(result);
    })
  }
});
    var username = config.email;
    var password = config.password;

    function checkMail(callback){
        request.get("https://"+username+":"+password+"@mail.google.com/gmail/feed/atom", function(error, response, body){
            if(error)console.log(error);
            var xml = body;
            parseString(xml, function (err, result) {
                if(err) console.log(err);
                if (result !== undefined){
                    var msgs = result.feed.entry;
                    _.each(msgs, function(msg, i){
                        var id = msg.id[0];
                        if(i == 0)
                            return callback(msg);
                        })
                    }
                });
            })
        }
        var msgID=0;
        var intID=0;
        setInterval(function () {
            checkMail(function(data){
                var id = data.id[0].split(":")[2];
                msgID = id;
                if(intID !== msgID && intID!==0 && msgID!==0){
                    console.log("You got mail!");
                    console.log(data);

                }
            })
            intID=msgID;
        }, 2000);
