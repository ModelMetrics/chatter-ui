(function($){

  console.log('backbone.salesforce.js');

  Backbone.Salesforce = Backbone.Salesforce || {defaultApiVersion: 'v26.0', connection: {}};

  //-------------------------------------------------------
  Backbone.Salesforce.Collection = Backbone.Collection.extend({
    fetch: function(options){
      
      //validate connection config
      var connection = Backbone.Salesforce.connection;
      if(_.isUndefined(connection)) throw 'Backbone.Salesforce.connection undefined!';
      if(_.isUndefined(connection.host)) throw 'Backbone.Salesforce.connection.host undefined!';
      if(_.isUndefined(connection.token)) throw 'Backbone.Salesforce.connection.token undefined!';

      // api version
      var apiVersion = connection.apiVersion;
      if(_.isUndefined(apiVersion)) apiVersion = Backbone.Salesforce.defaultApiVersion;
      apiVersion = apiVersion.replace(/^v/,'');
      if(!/^\d+(\.\d{1,2})?/.test(apiVersion)) throw 'Invalid API Version: ' + apiVersion;

      // get substitution variables
      var path = options.url;
      if(options.more) path = this.nextPageUrl;
      if(!path) path = '';
      if(!/^\//.test(path)) path = '/' + path;
      if(!/^\/services\/data\/v\d+(\.\d{1,2})?/.test(path)){
        path = '/services/data/v' + apiVersion + path;
      } 
      var host = connection.host;
      host = host.replace(/^https:\/\//,'');
      var substitutes = {
        'host': host,
        'token': connection.token,
        'path': path
      };

      //calculate url and headers
      var url = 'https://';
      var headers = [];
      if(!_.isUndefined(connection.proxy)){
        url = this.replaceVars(connection.proxy.url,substitutes);
        _.each(connection.proxy.headers,function(header){
          headers.push({name: header.name, value: this.replaceVars(header.value,substitutes)});
        }.bind(this));
      } else {
        url += host + path;
      }
      
      return $.ajax({
        type: 'GET',
        async: false,
        url: url,
        contentType: 'application/json',
        cache: false,
        processData: false,
        data: undefined,
        success: function(data, textStatus, jqXHR){ 
          this.nextPageUrl = data.nextPageUrl;
          this.currentPageUrl = data.currentPageUrl;
          this.isModifiedUrl = data.isModifiedUrl;
          this.reset(this.parse(data),{add: options.more});
        }.bind(this),
        error: options.error,
        dataType: "json",
        beforeSend: function(xhr){
          _.each(headers,function(header){
            xhr.setRequestHeader(header.name,header.value);
          });
        }
      });
      
    },

    replaceVars: function(str, vars){
      if(_.isUndefined(str)) return str;
      return _.reduce(_.keys(vars),function(memo, key){
        return memo.replace(new RegExp('\\$\{' + key + '\}'),vars[key]);
      }, str);
    },
    
    hasMore: function(){
      return !_.isEmpty(this.nextPageUrl);
    },

    isModified: function(){
      return true;
    }
    
  });

  //-------------------------------------------------------
  console.log('app.js');
  
  //-------------------------------------------------------
  window.FeedItemCollection = Backbone.Salesforce.Collection;
  window.FeedItemCollection.prototype = Backbone.Salesforce.Collection.prototype.clone();
  _.extend(window.FeedItemCollection.prototype, { 

    parse: function(response){ 
      return response.items; 
    }

  });
    
  //-------------------------------------------------------
  window.FeedItemView = Backbone.View.extend({
    
    id: function(){ return this.model.id },
    tagName: "div",
    className: "cxfeeditem feeditem cxhover",
    template: _.template('<span class=""><a href="javascript: void(0);"><span class="chatter-avatar feeditemusericon chatter-avatarRegular" data-hovid="<%= actor.id %>" data-uidsfdc="74" id="hoverItem74"><img src="<%= actor.photo.smallPhotoUrl %>?oauth_token=<%= escape(Backbone.Salesforce.connection.token) %>" alt="<%= actor.name %>" width="45" height="45" class="chatter-photo" title="<%= actor.name %>"><img src="/images/s.gif" alt="" width="12" height="1" class="chatter-avatarStyle" style="margin-right: 0.25em;" title=""></span></a></span>' +
    '<div class="feeditemcontent cxfeeditemcontent">' +
    '  <div class="feeditembodyandfooter">' +
    '    <div class="feeditembody">' +
    '      <div class="preamblecontainer displayblock">' +
    '        <span class="feeditempreamble"><a href="javascript: void(0);" class="actorentitylink" data-hovid="<%= actor.id %>" data-uidsfdc="75" id="hoverItem75" name="hoverItem75"><%= actor.name %></a></span>' +
    '        <div id="<%= actor.id %>Hover" style="position: absolute; display: none; z-index: 95; left: 1534px; top: 1787px;">' +
    '          <div class="chatterHover chatterHover-below" id="ext-gen12">' +
    '            <div class="wrapper" id="ext-gen11" style="top: 0px;">' +
    '              <div class="loadHover"></div>' +
    '            </div>' +
    '            <div class="arrow"></div>' +
    '          </div>' +
    '        </div>' +
    '      </div><span class="feeditemtext cxfeeditemtext"><%= body.text %></span>' +
    '    </div>' +
    '    <div class="feeditemfooter">' +
    '      <span class="cxallfeedactions"><a href="javascript:void(0);" title="Comment on this post" class="feeditemactionlink cxaddcommentaction">Comment</a> <span class="cxfeeditemcommentdot feeditemseparatingdot">·</span> <a href="javascript:void(0);" title="Like this post" style="" class="feeditemactionlink cxlikeitemaction">Like</a> <a href="javascript:void(0);" title="Stop liking this post" style="display:none;" class="feeditemactionlink cxunlikeitemaction">Unlike</a> <span class="cxfeeditemlikedot feeditemseparatingdot">·</span> <a href="javascript:void(0);" title="Bookmark this post" style="display:none;" class="feeditemactionlink cxbookmarkaction bookmarkLink">Bookmark</a> <a href="javascript:void(0);" title="Remove this bookmark" style="display:none;" class="feeditemactionlink cxunbookmarkaction unbookmarkLink">Unbookmark</a> <span class="bookmarkDot feeditemseparatingdot">·</span> <a href="javascript:void(0);" class="dialog_RechatDialog0D5U000000J0h7w"><span title="Share Post">Share</span></a> <span class=" feeditemseparatingdot">·</span></span><span class="feeditemtimestamp"><%= parseAndFormat(createdDate) %></span>' +
    '    </div>' +
    '  </div>' +
    '  <div class="feeditemextras cxchattertextareacontainer chattertextareacontainer">' +
    '    <div class="cxfeedcommentarrow feedcommentarrow"></div>' +
    '    <div class="cxcomments feeditemcomments">' +
    '      <div class="cxlikecontainer" style="display:none">' +
    '        <div class="cxfeeditemlike feeditemlike" style="display:block">' +
    '          <span class="like-icon">&nbsp;</span><span><%= likes.likes.length %> people like this.</span>' +
    '        </div>' +
    '      </div>' +
    '      <% _.each(comments.comments,function(comment) { %> ' +
    '        <div class="feeditemcomment cxfeedcomment" style="display:block">' +
    '          <a href="javascript: void(0);" class="feeditemcommentphoto"><span class="chatter-avatarMedium chatter-avatar" data-hovid="<%= comment.user.id %>" data-uidsfdc="76" id="hoverItem76"><img src="<%= comment.user.photo.smallPhotoUrl %>?oauth_token=<%= escape(Backbone.Salesforce.connection.token) %>" alt="<%= comment.user.name %>" width="30" height="30" class="chatter-photo" title="<%= comment.user.name %>"><img src="/images/s.gif" alt="" width="12" height="1" class="chatter-avatarStyle" style="margin-right: 0.25em;" title=""></span></a>' +
    '          <div class="feeditemcommentbody">' +
    '            <div class="feedcommentuser">' +
    '              <a href="javascript: void(0);" class="actorentitylink" data-hovid="<%= comment.user.id %>" data-uidsfdc="77" id="hoverItem77" name="hoverItem77"><%= comment.user.name %></a>' +
    '            </div><span class="feedcommenttext"><%= comment.body.text %></span>' +
    '            <div class="feedcommentfooter">' +
    '              <span class="feedcommentactions"><span><span class="cxallfeedactions"><a href="javascript: void(0);" class="commentactionlink cxlikecommentaction" title="Like this post">Like</a><a href="javascript: void(0);" class="commentactionlink cxunlikecommentaction" style="display:none" title="Stop liking this post">Unlike</a></span></span> <span class="feeditemseparatingdot cxcommentlikedot">·</span> <a href="javascript:void(0);" title="Delete this comment" class="feeditemactionlink commentDeleteLink" >Delete</a> <span class="feeditemseparatingdot deleteDot">·</span></span> <span class="feeditemtimestamp"><%= parseAndFormat(comment.createdDate) %></span>' +
    '            </div>' +
    '          </div>' +
    '        </div>' +
    '      <% }); %>' +
    '    </div>' +
    '  </div>' +
    '</div>'),
    
    initialize: function() {
      _.bindAll(this,'render');
    },

    render: function() {
      this.el.innerHTML = this.template(this.model.toJSON());
      return this;
    }

  });
  
  //-------------------------------------------------------
  window.FeedItemCollectionView = Backbone.View.extend({

    id: _.uniqueId("feed-items"),
    tagName: "div",
    className: "feedcontainer cxfeedcontainer actionsOnHoverEnabled",
    events:{'click .more': 'handleDoMore'},
    
    initialize: function() {
      _.bindAll(this,'handleReset','handleDoMore');
      this.items = this.options.items;
      this.items.bind('reset',this.handleReset);
    },

    handleReset: function(collection, options) {
      //remove all children unless appending
      options = options || {}
      if(!options.add) this.$el.children().remove();
      
      //append each item
      this.items.each(function(item){
        var view = new FeedItemView({model: item}).render();
        this.$el.append(view.el);
      }.bind(this));
      
      if(this.items.hasMore()){
        this.$el.append($('<button></button>').addClass('more').html('Get More'));
      }
    },

    handleDoMore: function(event) {
      var button = $(event.target);
      button.attr('disabled','disabled');
      this.items.fetch({more: true});
      button.remove();
    }

  });
  
  
  //-------------------------------------------------------
  window.AppWithSingleFeedView = Backbone.View.extend({
    
    initialize: function() {
      var view = new FeedItemCollectionView({items: new window.FeedItemCollection});
      this.$el.append(view.el);
      view.items.fetch({url: this.options.feedUrl || 'chatter/feeds/news/me/feed-items'});
    }
    
  });
  
})(jQuery);

function parseAndFormat(str){
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var d = new Date(str);
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  var hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' at ' + hours + ':' + minutes + ' ' + ampm;
}

