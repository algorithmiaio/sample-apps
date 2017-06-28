var algo = Algorithmia.client("your_api_key").algo("algo://media/ContentAwareResize/0.1.3");

var resize = function(url, height, width, target) {
  var input = {
     "image":url,
     "height":height,
     "width":width,
     "binarize":true
  };
  algo.pipe(input).then(function(response) {
    document.getElementById(target).src = response.result;
  });
};

window.onload = function() {
  resize("https://upload.wikimedia.org/wikipedia/commons/f/f7/Hickory_Golfer.jpg", 300, 150, "hero");
};