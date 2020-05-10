var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;
app.use(express.static('./dist'));

app.get('/', function(req, res) {
  res.redirect('/meleelight.html');
});

app.listen(9000)


// server.listen(1000);
