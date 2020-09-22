import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import routes from './routes.js';
import apiRoutes from "./api/apiRoutes.js";
import connectionHandler from './serverSockets/connectionHandler.js';
import connectionEmitter from './serverSockets/connectionEmitter.js';
import path from 'path';
import globalData from './globalData.js';

global.data = new globalData();

const app = express();
const bodyParser = require("body-parser");
const server = http.createServer(app);
const io = socketio(server);
const debug = true;


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../client/build')));
app.use('/api',apiRoutes);
app.use('/',routes);

io.on('connection', function(socket){
	console.log("socket has connected");
	global.handlers = new connectionHandler(io,socket, debug);
	global.emitters = new connectionEmitter(io, debug);

	// turn on event listeners
	global.handlers.eventHandlers();
});

global.data.mongoDB.connect().catch(function(err){
	console.log("Failed to connect to database with error:", err);
}).finally(function(){
	server.listen(9000, () => {
		console.log('Example app listening on port 9000!');
	});	
});

