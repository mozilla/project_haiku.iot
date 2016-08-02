(function(global){
  // export a config global
  var config = global.config = {};

  // pull config from querystring
  var expectedKeys = { id: true, autostart: true };

  var queryStr = location.search.substring(1);
  var pairs, nameValue, params = {};
  if(queryStr){
    pairs = queryStr.split('&');
    for(var i=0; i<pairs.length; i++) {
      nameValue = pairs[i].split('=');
      if(nameValue[0] && (nameValue[0] in expectedKeys)){
        config[ nameValue[0] ] = nameValue[1];
      }
    }
    if(i >= pairs.length && location.hash) {
        config[ nameValue[0] ] += location.hash;
    }
  }
})(window);
