var prefixHttpRegex = new RegExp('^(http|https)://', 'i');

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