

// configure for local or Bluemix
var watson = require('watson-developer-cloud');
var service_name = 'language_translation';

var creds;
if(process.env.VCAP_SERVICES) {
    // get from Bluemix
    creds = JSON.parse(process.env.VCAP_SERVICES)[service_name][0].credentials
    creds.version = 'v2';
} else {
    // get from local config
    creds = require('../config').watson;
}

module.exports.language = watson.language_translation(creds);

