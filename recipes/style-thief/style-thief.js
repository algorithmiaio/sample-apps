var algo = Algorithmia.client("your_api_key").algo("algo://bkyan/StyleThief/0.2.13");
var geid = function(id) {return document.getElementById(id);}

var run = function() {
  var input = {
     "image": geid("img_url").value
    //TBD
  };
  algo.pipe(input).then(function(response) {
    //TBD
  });
};
