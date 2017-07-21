var client = Algorithmia.client("your_api_key");
var algo_stylethief = client.algo("algo://bkyan/StyleThief/0.2.13?timeout=3000");
var algo_cat64 = client.algo("algo://util/CatBase64/0.1.1");

var run = function() {
  var filename = new Date().getTime()+".jpg";
  var input = {
    "source": $("#source").val(),
    "style": $("#style").val(),
    "output": filename,
    "iterations": 100,
    "log_channel": "style-thief-demo"
  };
  var outputURI = "data://.algo/bkyan/StyleThief/temp/"+filename;
  $("#message").empty();
  $('#output').attr('src','');
  $("#run").hide();
  $("#loading").show();
  algo_stylethief.pipe(input).then(function(response) {
    $("#loading").hide();
    $("#run").show();
    if(response.error) {
      $("#message").text(response.error.message);
    } else {
      console.log(response.result.replace('\n',' '));
      console.log(outputURI);
      algo_cat64.pipe(outputURI).then(function(response2) {
        console.log(response2.result);
        $('#output').attr('src','data:image/jpeg;base64,'+response2.result);
      });
    }
  });
};