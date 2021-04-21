//app.js
var WebSocketServer = require('ws').Server
    , http = require('http')
    , express = require('express')
    , app = express();

var port = 2525;

app.use(express.static(__dirname + '/'));
var server = http.createServer(app);
var wss = new WebSocketServer({port:25252});

//Websocket接続を保存しておく
var connections = [];
var count = 0;

//接続時
wss.on('connection', function (ws) {
    console.log('Connection: ' + ++count + ' people');
    //配列にWebSocket接続を保存
    connections.push(ws);
    //切断時
    ws.on('close', function () {
        connections = connections.filter(function (conn, i) {
            return (conn === ws) ? false : true;
        });
    });
    //メッセージ送信時
    ws.on('message', function (message) {
        console.log('message:', message);
        broadcast(message);
    });
});

//ブロードキャストを行う
function broadcast(message) {
    connections.forEach(function (con, i) {
        con.send(message);
    });
};

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/html/index.html`);
});


app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});