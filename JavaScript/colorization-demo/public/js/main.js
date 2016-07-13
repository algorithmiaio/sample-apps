// clouds https://images.unsplash.com/16/unsplash_525a7e89953d1_1.JPG
// hills https://images.unsplash.com/29/cloudy-hills.jpg
// rock https://images.unsplash.com/reserve/yZfr4jmxQyuaE132MWZm_stagnes.jpg
// paris https://images.unsplash.com/33/YOfYx7zhTvYBGYs6g83s_IMG_8643.jpg

window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = "simeyUbLXQ/R8Qga/3ZCRGcr2oR1"
var numTasks = 0;

function callAlgorithm() {
  var statusLabel = document.getElementById("status-label")
  statusLabel.innerHTML = "";
  startTask();

  // Get the img URL
  var img = document.getElementById("imgUrl").value;
  
  // Remove any whitespaces around the url
  img = img.trim();

  document.getElementById("urlAddress").innerHTML = img;

  // Check if URL is an image 
  var checkImg = img.split('.').pop();
  var extensions = ['png','jpg','jpeg','bmp','gif'];

  if (extensions.indexOf(checkImg) > -1){
    // Call Image Colorization
    colorify(img);
  } else {
      // Error Handling
    var statusLabel = document.getElementById("status-label")
    statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh Oh! That&apos;s not a PNG, JPG, or GIF.</div>';
    taskError();
  }

};

function colorify(img) {
  Algorithmia.client(Algorithmia.api_key)
    .algo("algo://algorithmiahq/ColorizationDemo/1.0.2")
    .pipe(img)
    .then(function(output) {
      if(output.error) {
        // Error Handling
        var statusLabel = document.getElementById("status-label")
        statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh Oh! Something went wrong: ' + output.error.message + ' </div>';
        taskError();
      } else {
        console.log("got output", output.result);

        // Decode base64 imgs
        var imgOriginal = "data:image/png;base64," + output.result[0];
        var imgColorized = "data:image/png;base64," + output.result[1];

        getMeta(imgOriginal, imgColorized);
      }
    });
}

function getMeta(original,colorized){   
  
  // Get height and width of original image
  var img = new Image();

  img.onload = function(){
    width = this.width;
    height = this.height;

    var twoface = TwoFace('twoface-demo', width, height);
    twoface.add(original);
    twoface.add(colorized);

      // Finish Task
      finishTask();

    };

  img.src = colorized;
}

function analyzeDefault(img) {
	document.getElementById("imgUrl").value = img;
	callAlgorithm();
}

function startTask() {
  numTasks++;
  document.getElementById("overlay").classList.remove("hidden");
  var clear = document.getElementById("twoface-demo");
  clear.innerHTML = '';
}

function finishTask() {
  numTasks--;
  if(numTasks <= 0) {
    document.getElementById("overlay").classList.add("hidden");
    document.getElementById("explainer").classList.add("hidden");
    document.getElementById("results").classList.remove("hidden");
  }
}

function taskError() {
  numTasks = 0;
  document.getElementById("overlay").classList.add("hidden");
  document.getElementById("explainer").classList.add("display");
  document.getElementById("explainer").classList.remove("hidden");
  document.getElementById("results").classList.add("hidden");

}