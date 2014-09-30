var request = require('request');
var parseString = require('xml2js').parseString;
var _ = require('underscore');
var username = "you@gmail.com";
var password = "password";

function checkMail(callback){
    request.get("https://"+username+":"+password+"@mail.google.com/gmail/feed/atom", function(error, response, body){
        var xml = body;
        parseString(xml, function (err, result) {
            var msgs = result.feed.entry;
            _.each(msgs, function(msg, i){
                var id = msg.id[0];
                if(i == 0)
                    return callback(msg);
            })
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
}, 5000);
