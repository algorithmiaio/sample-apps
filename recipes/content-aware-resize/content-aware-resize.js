var algo = Algorithmia.client("your_api_key").algo("algo://media/ContentAwareResize/0.1.3");
var geid = function(id) {return document.getElementById(id);}

var resize = function(width, height, anchorId) {
  var anchor = geid(anchorId);
  anchor.innerText = "Loading...";
  var input = {
     "image": geid("img_url").value,
     "height": height,
     "width": width,
     "binarize": true
  };
  algo.pipe(input).then(function(response) {
    anchor.innerText = response.error?response.error.message:"Download";
    anchor.href = response.result;
  });
};

var resizeManual = function() {
  resize(parseInt(geid('height').value), parseInt(geid('height').value), 'manual');
};