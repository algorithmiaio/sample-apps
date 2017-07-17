var algo = Algorithmia.client("your_api_key").algo("algo://bkyan/StyleThief/0.2.13");

var run = function() {
  var input = {
    "source": $("#source").val(),
    "style": $("#style").val(),
    "output": $("#output").val(),
    "iterations" : 800
  };
console.log(input);
  $("#run").hide();
  algo.pipe(input).then(function(response) {
  $("#run").show();
console.error(response);
  });
};
