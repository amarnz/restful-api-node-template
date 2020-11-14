/****************************************************************
All rights reserved worldwide to DataGenius Technologies LLC.
www.DataGeniusTech.com
****************************************************************/
const cfg = require('../config/config') //config

//global LOG var
global._log = undefined;

class LOG {
	constructor() {
		return this.getLog();
	}

	getLog() {
		if(global._log === undefined) {
			var dtNow = new Date();
			var sDTStamp = dtNow.toISOString().slice(0,10);
			var winston=require("winston");
			var curPgm='app';
			var curPath=__dirname;
			var tmpS=__filename.split('.')[0].split('/');
			if(tmpS.length > 0) { curPgm=tmpS[tmpS.length-1]; }
			var logOptions = {
				file: {level:cfg.logger.file.level,maxsize:cfg.logger.file.maxsize,
				filename: curPath+'/../logs/'+curPgm+'.'+sDTStamp+'.log'}};

			global._log = new winston.createLogger({
				transports:[new winston.transports.File(logOptions.file)],
				exitOnError:false});
		}
		return global._log;
	} //getLog
} //class LOG

module.exports = new LOG();
//////////// THE END ////////////
