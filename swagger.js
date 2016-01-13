
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

module.exports = function (express, app, domain, port,settings) {
    var module = {};

    module.config = function() {
    
    var argv = require('minimist')(process.argv.slice(2));
    var swagger = require("swagger-node-express");
    var morgan  = require('morgan');
    var subpath = express();

    app.use("/v1", subpath);
    
    if (settings.useDevLogger)
    	subpath.use(morgan('dev'));                     		// log every request to the console

    swagger.setAppHandler(subpath);

    subpath.use(function(req, res, next) {
    	res.header("Access-Control-Allow-Origin", "*");
    	res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    	res.header("Access-Control-Allow-Headers", "Content-Type, api_key, Authorization");
    	next();
    	});

    subpath.use(express.static('dist'));

    swagger.setApiInfo({
    	title: "AcmeAir NodeJS API",
    	description: "API for AcmeAir NodeJS",
    	termsOfServiceUrl: "",
    	contact: "yanglei@us.ibm.com",
    	license: "",
    	licenseUrl: ""
    });

    subpath.get('/', function (req, res) {
    	 res.sendFile(__dirname + '/dist/index.html');
    });
    
    
    // Set api-doc path
    swagger.configureSwaggerPaths('', 'api-docs', '');

    // Set and display the application URL
    var applicationUrl = 'http://' + domain + ':' + port;
    console.log('API running on ' + applicationUrl);


    swagger.configure(applicationUrl, '1.0.0');

    }
    
    return module;
}
