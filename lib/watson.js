

// configure for local or Bluemix
var watson = require('watson-developer-cloud');
var service_name = 'language_translation';

var creds;
if(process.env.VCAP_SERVICES) {
    creds = JSON.parse(process.env.VCAP_SERVICES)[service_name][0].credentials
    creds.version = 'v2';
} else {
    creds = {
        username: '814a1d97-6f96-4f81-8b10-dd05dd948741',
        password: '5u05jscmNnBZ',
        version: 'v2'
    }
}

module.exports.language = watson.language_translation(creds);

