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
    host:  'REPLACE ME!!',
    token: 'REPLACE ME!!',
    proxy: 'REPLACE ME!!'
  };
  new window.AppWithSingleFeedView({el:'#chatter'});
});
```

