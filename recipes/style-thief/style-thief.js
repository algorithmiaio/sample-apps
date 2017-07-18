var algo = Algorithmia.client("simABLGaZp3ZsXrLF9BhSGSnDGZ1").algo("algo://bkyan/StyleThief/0.2.13");

var run = function() {
  var input = {
    "source": $("#source").val(),
    "style": $("#style").val(),
    "output": $("#output").val(),
    "iterations": 800,
    "log_channel": "style-thief-demo"
  };
  $("#message").text();
  $("#run").hide();
  $("#loading").show();
  algo.pipe(input).then(function(response) {
    $("#loading").hide();
    $("#run").show();
    if(response.error) {
      $("#message").text(response.error.message);
    } else {
      $("#message").text(response.result.replaceAll('\n',' '))
    }
  });
};
