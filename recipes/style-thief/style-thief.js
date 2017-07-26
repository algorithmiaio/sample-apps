var client = Algorithmia.client("your_api_key");
var algo_stylethief = client.algo("algo://bkyan/StyleThief/0.2.13?timeout=3000");
var algo_cat64 = client.algo("algo://util/Data2Base64/0.1.0");

var run = function() {
  var filename = new Date().getTime()+".jpg";
  var outputURI = "data://.algo/bkyan/StyleThief/temp/"+filename;
  var input = {
    "source": $("#source").val(),
    "style": $("#style").val(),
    "output": filename,
    "iterations": 800,
    "log_channel": "style-thief-demo"
  };
  $("#message").text("This will take 5-50 minutes, so please be patient!");
  $('#output').attr('src','');
  $("#run").hide();
  $("#loading").show();
  algo_stylethief.pipe(input).then(function(response) {
    $("#loading").hide();
    $("#run").show();
    if(response.error) {
      $("#message").text(response.error.message);
    } else {
      algo_cat64.pipe(outputURI).then(function(response2) {
        $("#message").empty();
        $('#output').attr('src','data:image/jpeg;base64,'+response2.result);
      });
    }
  });
};