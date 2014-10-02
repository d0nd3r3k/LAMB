var request = require('request');
var parseString = require('xml2js').parseString;
var _ = require('underscore');
var config = require('./config');
var exec = require('child_process').exec;
var child;

var username = config.email;
var password = config.password;

child = exec("node serial.js Gmail#", function (err, stdout, stderr) {
    console.log(stdout);
    if(err) console.log(err);
    if(stderr) console.log(stderr);
})

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
