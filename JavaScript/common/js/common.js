/**
 * set invite code to be used for signup link and description thereof
 * @param inviteCode
 */
function setInviteCode(inviteCode) {
  $('.invite_code').text(inviteCode);
  $('.invite_link').attr('href','https://algorithmia.com/signup?invite=' + inviteCode);
}

/**
 * once DOM is ready, run inits common to all demos
 */
$(document).ready(function() {
  hljs.initHighlightingOnLoad();
});