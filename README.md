Pure JS/HTML/CSS salesforce.com chatter front-end.

See it in action - [https://chatter-ui-demo.herokuapp.com](https://chatter-ui-demo.herokuapp.com).

Dependencies:
------------------------------
* [jQuery](http://jquery.com/)
* [Underscore](http://underscorejs.org/)
* [Backbone](backbonejs.org)

Usage
------------------------------

Head:
```html
<link href='chatter-ui.css' rel='stylesheet' />
<script src='jquery.js' type='text/javascript'></script>
<script src='underscore.js' type='text/javascript'></script>
<script src='backbone.js' type='text/javascript'></script>
<script src='chatter-ui.js' type='text/javascript'></script>
```

Body:
```html
<div id='chatter'></div>
```

On load:
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

Proxy Configuration
------------------------------
chatter-ui interacts with the salesforce.com REST and Chatter REST APIs.  Because these APIs reside on a domain different, chatter-ui is dependent upon either a local reverse proxy, or a remote reverse proxy that supports CORS headers.  Below are at least three different proxies you can leverage, and the corresponding proxy configuration.

[chatter-proxy](https://github.com/sohalloran/chatter-proxy)

```javascript
proxy: {
  url: "https://chatter-proxy.herokuapp.com/${path}",
  headers: [
    {name: "SalesforceProxy-Endpoint", value: "${host}"},
    {name: "X-Authorization", value: "OAuth ${token}"}
  ]
}
```

[CORS-Proxy](https://github.com/gr2m/CORS-Proxy)

```javascript
proxy: {
  url: "http://localhost/${host}${path}",
  headers: [
    {name: "Authorization", value: "OAuth ${token}"}
  ]
}
```

[php proxy page]

```javascript
proxy: {
  url: "http://localhost/proxy.php",
  headers: [
    {name: "SalesforceProxy-Endpoint", value: "https://${host}${path}"},
    {name: "X-Authorization", value: "OAuth ${token}"}
  ]
}
```