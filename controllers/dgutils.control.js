/****************************************************************
All rights reserved worldwide to DataGenius Technologies LLC.
www.DataGeniusTech.com
****************************************************************/
"use strict";
const cfg = require('../config/config.js'); //config
const md5=require('md5'); //main DB

class DGUTILS {
	//returns salted password hash
	getSaltedPwd = function(sOldPwd) {
		return md5(md5(cfg.server_env.password_salt)+md5(sOldPwd));
	};//getSaltedPwd

	//return comma separated field list
	//if "required" = TRUE: return only required columns
	getFieldList = function(schema,required=false) {
		var sFldList = '';

		try {
			for (var sKey of Object.keys(schema)) {
				//if only required fields should be sent back: gather here
				if(required) {
					if(this.isFieldRequired(sKey)) {
						if(sFldList != '') { sFldList += ',';}
						sFldList += sKey;
					} //else - ignore this field
				} else {
					if(sFldList != '') { sFldList += ',';}
					sFldList += sKey;
				}
			}

		} catch (e) {
			//TBD
		} finally {
			//TBD
		}
		//return what you got
		return sFldList;
	};//getFieldList

	//ERROR: Fill in this function with proper REGEX parsing
	//to exclude executable code in POST values
	sanitize(sRawValue) {
		return sRawValue;
	}; //sanitize

	//ERROR: Fill in this function with proper REGEX parsing
	//for EMAIL address
	isEmail(sRawValue) {
		return true;
	}; //isEmail

	//returns true if the Key is a required FIELD in Schema
	isFieldRequired = function(sKey) {
		return(schema[sKey].required === true?true:false);
	} //isFieldRequired

	//generate a JSON object to return as result
	getJSONResultObject(sMessage,sStatus='',sResponse='',sData='') {
		var jsnRes = {};
		//{"response":"failure","data":"","msg": "","status": 401};
		jsnRes.msg = sMessage;
		sStatus = (sStatus == ''?'401':sStatus);
		jsnRes.status = sStatus;
		sResponse = (sResponse == ''?'FAILURE':sResponse);
		jsnRes.response = sResponse;
		jsnRes.data = sData;
		return jsnRes;
	} //getJSONResultObject

} //class DGUTILS

module.exports = new DGUTILS();

//////////// THE END ////////////
