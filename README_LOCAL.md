
### Local changes underway

#### Moving login page to Angular.js
* public/index.html.new -- new html page which uses angular
* public/js/login.js -- new js page that works with above

*Issue*: index page refreshes after login attempt... there is a '/#/' preventing it from getting url
**Solutions**:
* redirect to a different login page
* figure out how to do it with ajax calls
