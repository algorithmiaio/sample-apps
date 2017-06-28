var algo = Algorithmia.client("your_api_key").algo("algo://media/ContentAwareResize/0.1.3");
var geid = function(id) {return document.getElementById(id);}

var resize = function(url, height, width, target) {
  var input = {
     "image":url,
     "height":height,
     "width":width,
     "binarize":true
  };
console.log(input);
  algo.pipe(input).then(function(response) {
console.log(response);
    if(response.error) {alert("Error: "+response.error.message);}
    geid(target).src = response.result;
  });
};

var reloadHero = function() {
  geid("hero_img").src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Android_style_loader.gif";
  var url = parseInt(geid("hero_url").value);
  var height = parseInt(geid("hero_height").value);
  var width = parseInt(geid("hero_width").value);
  resize("https://upload.wikimedia.org/wikipedia/commons/f/f7/Hickory_Golfer.jpg", height, width, "hero_img");
};

window.onload = reloadHero;