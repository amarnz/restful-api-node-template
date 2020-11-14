/****************************************************************
All rights reserved worldwide to DataGenius Technologies LLC.
www.DataGeniusTech.com
****************************************************************/
global._cfg = undefined;

class Config {
	constructor() {
		return this.getConfig();
	}

	getConfig() {
		if(global._cfg === undefined) {
			global._cfg = this.applyOverrides(this.cfg,this.appCfg);
		}

		return global._cfg;
	};

	cfg = {
		"myprivatekey": "DEFAULT_KEY_OVERRIDE",
		"db": {
			"host": "localhost",
			"database": "db_database",
			"user": "db_user",
			"password": "db_password",
			"idleCheckInterval": 1000,
		  "maxConnextionTimeout": 30000,
		  "idlePoolTimeout": 3000,
		  "errorLimit": 5,
		  "preInitDelay": 50,
		  "sessionTimeout": 60000
		},
		"db_conn_parms": {
			"conn_pools": 10,
			"mysql_port": 3306,
			"mysql_sock":"/var/run/mysqld/mysqld.sock",
			"mysql_multipleStatements": true,
			"mysql_connectTimeout": 15000,
			"mysql_acquireTimeout": 10000,
			"mysql_waitForConnections": true,
			"mysql_connectionLimit": 1000,
			"mysql_queueLimit": 5000,
			"mysql_debug": true
		},
		"server_env": {
			"password_salt": "server_salt",
			"config_id": "development",
			"app_name": "ME_APP",
			"app_desc": "ME_APP",
			"node_port": 3000
		},
		"logger": {
			"file": {
				"level":"info",
				"json": true,
				"maxsize":5242880
			},
			"console": {
				"level":"info",
				"colorize":true,
			}
		}
	};

	//correct config for override
	appCfg=require('./app_config_overrides');

	//apply overrides
	applyOverrides(oldCfg,newCfg) {
		for (var property in newCfg) {
			if(newCfg[property] == '[object Object]') {
				oldCfg[property] = this.applyOverrides(oldCfg[property],newCfg[property]);
			} else {
				oldCfg[property] = newCfg[property];
			}
		}

		return oldCfg;
	};

};

module.exports = new Config();
//////////// THE END ////////////
