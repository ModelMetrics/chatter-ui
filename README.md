Pure JS/HTML/CSS salesforce.com chatter front-end.

See it in action - (https://chatter-ui-demo.herokuapp.com).

Usage
------------------------------

Dependencies:
```html
<link href='/stylesheets/style.css' rel='stylesheet' />
<script src='/javascripts/lib/jquery.js' type='text/javascript'></script>
<script src='/javascripts/lib/jquery.popup.js' type='text/javascript'></script>
<script src='/javascripts/lib/underscore.js' type='text/javascript'></script>
<script src='/javascripts/lib/backbone.js' type='text/javascript'></script>
<script src='/javascripts/app.js' type='text/javascript'></script>
<div id='chatter'></div>
```

Structure:
```html
<div id='chatter'></div>
```

On Load:
```javascript
$(function() {
  Backbone.Salesforce.connection = {
    host: response.instance_url,
    token: response.access_token,
    proxy : {
      url: "http://localhost:5001/${host}${path}",
      headers: [{name: "Authorization", value: "OAuth ${token}"}]
    }
  };
  new window.AppWithSingleFeedView({el:'#chatter'});
});
```

