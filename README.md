Pure JS/HTML/CSS salesforce.com chatter front-end.

See it in action - (https://chatter-ui-demo.herokuapp.com).

Usage
------------------------------
```html
<div id='chatter'></div>
```
```javascript
Backbone.Salesforce.connection = {
   host: response.instance_url,
   token: response.access_token,
   proxy : {
     url: "http://localhost:5001/${host}${path}",
     headers: [{name: "Authorization", value: "OAuth ${token}"}]
   }
 };
 new window.AppWithSingleFeedView({el:'#chatter'});
```

