var prefixHttpRegex = new RegExp('^(http|https)://', 'i');

var doubleHttpRegex = new RegExp('^http:/+http(s)*:/');

var validUrlRegex = new RegExp('^(https?:\\/\\/)?' + // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'); // port and path
  // '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  // '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

/**
 * once DOM is ready, run inits common to all demos
 */
$(document).ready(function() {
  // code highlighting
  hljs.initHighlightingOnLoad();
});

/**
 * set invite code to be used for signup link and description thereof
 * @param inviteCode
 */
function setInviteCode(inviteCode) {
  $('.invite_code').text(inviteCode);
  $('.invite_link').attr('href','https://algorithmia.com/signup?invite=' + inviteCode);
}

/**
 * ensure that a URL begins with http(s)://
 * @param url
 * @returns {string}
 */
function prefixHttp(url) {
  return prefixHttpRegex.test(url)?url:'http://'+url;
}

function isValidUrl(url) {
  return validUrlRegex.test(url);
}

/***
 * add http:// prefix to an input element if empty, and clean up "http://http"
 * @param elem jQuery element
 */
var requireHttp = function(elem) {
  var requireHttpHandler = function(elem) {
    var val = elem.val().trim();
    if (val=='') {
      elem.val('http://');
    } else if (doubleHttpRegex.test(val)) {
      elem.val(val.replace(doubleHttpRegex,'http$1:/'));
    }
  };
  elem.bind('paste', function (e) {
    setTimeout(function(){requireHttpHandler(elem)});
  });
  elem.bind('click keypress', function (e) {
    requireHttpHandler(elem);
  });
};