/****************************************************************
All rights reserved worldwide to DataGenius Technologies LLC.
www.DataGeniusTech.com
****************************************************************/
var fs=require("fs");
var Promise=require("promise");
var express=require("express");
var bodyParser=require("body-parser");
const cfg=require('./config/config'); //config
const logger=require('./controllers/log.control'); //logger
const auth=require('./controllers/auth.control'); //authorization controller
const db=require('./models/db.model'); //main DB

//setup the APP
var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use('/doLogin', auth.login);
app.use('/', auth.login);

// start server
const server = app.listen(cfg.server_env.node_port, function () {
	logger.info('Server listening on port ' + cfg.server_env.node_port);
});

//////////// THE END ////////////
