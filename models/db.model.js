/****************************************************************
All rights reserved worldwide to DataGenius Technologies LLC.
www.DataGeniusTech.com
****************************************************************/
"use strict";
//MySQL pool manager: high performance MySQL connections
var PoolManager = require('mysql-connection-pool-manager');
const cfg = require('../config/config.js'); //config
const logger=require('../controllers/log.control.js'); //logger

//global connection variable
global._conn = undefined;

class MySQLDB {
	initDB() {
		if(global._conn !== undefined) { return; }

			// Initialize instance
			var mySQL = PoolManager(this.PoolOptions);

			//raw connection
			global._conn = mySQL.raw.createConnection({
				host: cfg.db.host,
				user: cfg.db.user,
				password: cfg.db.password,
				database: cfg.db.database
			});

			try {
				global._conn.connect(function (error, results, fields) {
					if(error) {
						logger.error("EXCEPTION: Database cannot be connected. Terminating program.");
						process.exit(0);
					};
				});
			} catch (e) {
				logger.error('EXCEPTION: '+e.message());
			} finally {
				//TBD
			}
			logger.info('======= DB INIT =======');
	};

	PoolOptions = {
		idleCheckInterval: cfg.db.idleCheckInterval,
	  maxConnextionTimeout: cfg.db.maxConnextionTimeout,
	  idlePoolTimeout: cfg.db.idlePoolTimeout,
	  errorLimit: cfg.db.errorLimit,
	  preInitDelay: cfg.db.preInitDelay,
	  sessionTimeout: cfg.db.sessionTimeout,
	  onConnectionAcquire: () => {  },
	  onConnectionConnect: () => {  },
	  onConnectionEnqueue: () => {  },
	  onConnectionRelease: () => {  },
	  mySQLSettings: {
	    host: cfg.db.host,
	    user: cfg.db.user,
	    password: cfg.db.password,
	    database: cfg.db.database,
	    charset: 'utf8',
	    port: cfg.db_conn_parms.mysql_port,
	    socketPath: cfg.db_conn_parms.mysql_sock,
	    multipleStatements: cfg.db_conn_parms.mysql_multipleStatements,
	    connectTimeout: cfg.db_conn_parms.mysql_connectTimeout,
	    acquireTimeout: cfg.db_conn_parms.mysql_acquireTimeout,
	    waitForConnections: cfg.db_conn_parms.mysql_waitForConnections,
	    connectionLimit: cfg.db_conn_parms.mysql_connectionLimit,
	    queueLimit: cfg.db_conn_parms.mysql_queueLimit,
	    debug: cfg.db_conn_parms.mysql_debug
	  }
	};

	getData(table,columns,where='1=1') {
		if(global._conn == undefined) {
			this.initDB();
		}

		where = ' where '+where;
		var sSQL = 'select '+columns+' from '+table+' '+where;
		return this.dbPromise(sSQL);
	};

	insert(table,columns,values) {
		var sSQL = 'insert into '+table+' ('+columns+') values ('+values+')';
		return this.dbPromise(sSQL);
	};

	dbPromise(sSQL) {
		return new Promise((resolve,reject) => {
			global._conn.query(sSQL, function (error, result) {
				if(error) {
					logger.info("FAILURE: DB operation");
					return reject(error);
				} else {
					return resolve(result);
				}});
		});
	};


}; //class MySQLDB

module.exports = new MySQLDB();

//////////// THE END ////////////
