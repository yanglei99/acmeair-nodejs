/*******************************************************************************
* Copyright (c) 2015 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*******************************************************************************/

module.exports = function (settings) {
    var module = {};
    var http = require('http')

    var contextRoot = settings.authContextRoot || "/acmeair-auth-service/rest/api"
	var location = process.env.AUTH_SERVICE;
	
    var hostAndPort = location.split(":");

	var log4js = require('log4js');
	var logger = log4js.getLogger('acmeairhttp');
	logger.setLevel(settings.loggerLevel);
	
    module.createSession = function (requestHeader, userid, callback /* (error, sessionId) */){
 		requestHeader['Content-Type']='application/json'
		var path = contextRoot+"/authtoken/byuserid/" + userid;
	     	var options = {
			hostname: hostAndPort[0],
		 	port: hostAndPort[1] || 80,
		    	path: path,
		    	method: "POST",
		    	headers: requestHeader
	     }
	
	     logger.debug('createSession  options:'+JSON.stringify(options));
	     var request = http.request(options, function(response){
	          var data='';
			  response.setEncoding('utf8');
			  response.on('data', function (chunk) {
				data +=chunk;
			  });
	          response.on('end', function(){
			 	if (response.statusCode>=400)
				   callback("StatusCode:"+ response.statusCode+",Body:"+data, null);
			   	else{
					var jsonData = JSON.parse(data);
					if (jsonData._id) callback(null, jsonData._id);
		      		else callback(null, jsonData.id);
	            }
			 })
		});
	    request.on('error', function(e) {
		callback('problem with request: ' + e.message, null);
	    });
	    request.end();
    }


	module.validateSession = function (requestHeader, sessionid, callback /* (error, userid) */){
 		requestHeader['Content-Type']='application/json'

		var path = contextRoot+"/authtoken/" + sessionid;
	     	var options = {
			hostname: hostAndPort[0],
		 	port: hostAndPort[1],
		    	path: path,
		    	method: "GET",
		    	headers: requestHeader
	    }
	
	    logger.debug('validateSession request:'+JSON.stringify(options));
	
	    var request = http.request(options, function(response){
	      		var data='';
	      		response.setEncoding('utf8');
	      		response.on('data', function (chunk) {
		   			data +=chunk;
	      		});
	       		response.on('end', function(){
	       			if (response.statusCode>=400)
	       				callback("StatusCode:"+ response.statusCode+",Body:"+data,null);
	       			else
	       				callback(null, JSON.parse(data).customerid);
	        	})
	    });
	    request.on('error', function(e) {
	   			callback('problem with request: ' + e.message, null);
	    });
	   	request.end();
	}

	module.invalidateSession = function (requestHeader, sessionid, callback /* (error) */){
 		 requestHeader['Content-Type']='application/json'
	     var path = contextRoot+"/authtoken/" + sessionid;
	     var options = {
			hostname: hostAndPort[0],
		 	port: hostAndPort[1],
		    	path: path,
		    	method: "DELETE",
		    	headers: requestHeader
	     }
	     logger.debug('invalidateSession request:'+JSON.stringify(options));
	      var request = http.request(options, function(response){
	
		   var data='';
		   response.setEncoding('utf8');
		   response.on('data', function (chunk) {
				data +=chunk;
	    	   });
	           response.on('end', function(){
				if (response.statusCode>=400)
		     			callback("StatusCode:"+ response.statusCode+",Body:"+data);
		   		else{
					callback(null);
		 		}
	           })
	   	});
	 	request.on('error', function(e) {
			callback('problem with request: ' + e.message, null);
	   	});
	  	request.end();
	}
	
	return module;
}
