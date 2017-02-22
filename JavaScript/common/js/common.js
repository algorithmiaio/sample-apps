var prefixHttpRegex = new RegExp('^(http|https)://', 'i');

var doubleHttpRegex = new RegExp('^http:/+http(s)*:/');

var validUrlRegex = new RegExp('^(https?:\\/\\/)?' + // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'); // port and path
  // '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  // '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

// code-highlighting onload handler
hljs.initHighlightingOnLoad();

/**
 * set invite code to be used for signup link and description thereof
 * @param inviteCode
 */
function setInviteCode(inviteCode) {
  $('.invite_code').text(inviteCode);
  $('.invite_link').attr('href','https://algorithmia.com/signup?invite=' + inviteCode);
}

/**
 * trim and ensure that a URL begins with http(s)://
 * @param url
 * @returns {string}
 */
function prefixHttp(url) {
  if(url) {
    url = url.trim();
    url = prefixHttpRegex.test(url)?url:'http://'+url;
  }
  return url;
}

/**
 * does this look like a URL?
 * @param url
 * @returns {boolean}
 */
function isValidUrl(url) {
  return validUrlRegex.test(url);
}

/**
 * get the portion of a URL before # and strip trailing /
 * @param url
 * @returns {*}
 */
function getUrlCore(url) {
  return url.split('#')[0].replace(/\/$/, '');
}

/***
 * add http:// prefix to an input element if empty, and clean up "http://http"
 * @param elem jQuery element
 */
var requireHttp = function(elem) {
  var requireHttpHandler = function(elem) {
    var val = elem.val().replace(/\s/g,''); //even trim inner whitespace
    if (val=='') {
      elem.val('http://');
    } else if (doubleHttpRegex.test(val)) {
      elem.val(val.replace(doubleHttpRegex,'http$1:/'));
    } else if (!prefixHttpRegex.test(val)) {
      elem.val('http://'+val)
    }
  };
  elem.bind('paste', function (e) {
    setTimeout(function(){requireHttpHandler(elem)});
  });
  elem.bind('click keypress', function (e) {
    requireHttpHandler(elem);
  });
};

/**
 * left-pad a number
 * @param n original number
 * @param width total number of characters desired
 * @param padchar (optional) character with which to pad, else '0'
 * @returns {*}
 */
function padleft(n, width, padchar) {
  padchar = padchar || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(padchar) + n;
}