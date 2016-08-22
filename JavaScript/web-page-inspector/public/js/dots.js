// TweenMax.min.js is needed to move dem dots

var $red = document.querySelector('.dot1');
var $green = document.querySelector('.dot2');
var $blue = document.querySelector('.dot3');
var $purple = document.querySelector('.dot4');
var start = 0;

var tl = new TimelineMax({
  repeat: -1,
  repeatDelay: 0.05,
});

// center
tl.fromTo($green, 0.4, {x: 0}, {x: 30, ease: Linear.easeNone}, start);
tl.fromTo($blue, 0.4, {x: 0}, {x: -30, ease: Linear.easeNone}, start);
// ext 1st
tl.to($green, 0.4, {x: 60, ease: Linear.easeNone}, start + 0.45);
tl.fromTo($purple, 0.4, {x: 0}, {x: -30, ease: Linear.easeNone}, start + 0.45);
tl.to($blue, 0.4, {x: -60, ease: Linear.easeNone}, start + 0.45);
tl.fromTo($red, 0.4, {x: 0}, {x: 30, ease: Linear.easeNone}, start + 0.45);
// ext return
tl.to($green, 0.4, {x: 30, ease: Linear.easeNone}, start + 0.9);
tl.to($purple, 0.4, {x: 0, ease: Linear.easeNone}, start + 0.9);
tl.to($blue, 0.4, {x: -30, ease: Linear.easeNone}, start + 0.9);
tl.to($red, 0.4, {x: 0, ease: Linear.easeNone}, start + 0.9);
// center again
tl.to($green, 0.4, {x: 0, ease: Linear.easeNone}, start + 1.35);
tl.to($blue, 0.4, {x: 0, ease: Linear.easeNone}, start + 1.35);