/****************************************************************
All rights reserved worldwide to DataGenius Technologies LLC.
www.DataGeniusTech.com
****************************************************************/
const express=require("express");
const cfg=require('../config/config');
const db=require('../models/db.model'); //main DB
const dgutils=require('../controllers/dgutils.control');
const logger=require('../controllers/log.control'); //logger

//API METHOD: login
async function login(req, res) {
	var sMethod = 'login';
	var jsnRes = await checkAuth(req.method,req.headers,req.body);
	return res.status(jsnRes.status).json(jsnRes);
} //login

//return TRUE - if HEADERS are defined properly & validate in DB
function headerDefined(reqHeaders) {
	// needed auth vals
	const sAuthToken = reqHeaders.token;

	//check if empty
	if (!sAuthToken || sAuthToken === undefined) { return false; }
	return true;
}; //headerDefined

//checks if authorization headers + details are good
//bGetUser=True: verify Login details
//bGetUser=False: verify that the user:Exists: used at creating-login time
async function checkAuth(sMethod,objHeaders,objBody,bGetUser=true) {
	//get a default JSON response obj
	var jsnRes = dgutils.getJSONResultObject('ERROR');

	//only POST allowed
	if (sMethod != "POST") {
		jsnRes.msg = 'ERROR: Invalid HTTP method';
		logger.info(JSON.stringify(jsnRes));
		return jsnRes;
	}

	//check if Header values are set
	if(!headerDefined(objHeaders)) {
		jsnRes.msg = 'ERROR: Headers are not defined';
		logger.info(JSON.stringify(jsnRes));
		return jsnRes;
	}

	//prepare to get User object from DB
	const sAuthToken = objHeaders.token; //Header
	const sUserName = dgutils.sanitize(objBody.username); //Body
	const sPassword = dgutils.sanitize(objBody.sec_pwd); //Body

	var jsnUser = await getUser(sAuthToken,sUserName,sPassword);
	if(jsnUser == ''||jsnUser === undefined) {
		jsnRes.msg = 'ERROR: Cannot get User details';
		logger.info(JSON.stringify(jsnRes));
		return jsnRes;
	}

	//Verify User Login credentials
	if(!bGetUser && (jsnUser.username == undefined||
		jsnUser.username == ''||jsnUser.is_active == 0||jsnUser.is_deleted == 1)) {
		return jsnRes;
	} //

	// success!
	jsnRes.response="SUCCESS";
	jsnRes.status=200;
	jsnRes.msg="User details successfully authenticated.";
	return jsnRes;
} //checkAuth

//from DB: return user object [if exists]
//Supply (UserID + PWD): when exact match is needed for LOGIN
async function getUser(sToken,sUserName='',sPwd='') {
	var jsnUser = '';
	sTable = " auth_token at, user_auth ua ";
	sFields = "ua.username,ua.uuid,ua.is_active,ua.is_deleted";
	var sWhere = " at.token='"+sToken+"' ";

	//check with (AuthToken)
	if(sUserName != '') {
		sWhere += " and ua.username='"+sUserName+"' ";
	}

	//check with (Salted PWD)
	if(sPwd != '') {
		sWhere += " and ua.password='"+dgutils.getSaltedPwd(sPwd)+"'";
	}

	var dbRes = await db.getData(sTable,sFields,sWhere);
	return dbRes[0];
} //getUser

exports.login = login;
exports.checkAuth = checkAuth;
//////////// THE END ////////////
