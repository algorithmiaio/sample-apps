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
    // Call the Image Resizing Function
    imageSize(img);
  } else {
      // Error Handling
    var statusLabel = document.getElementById("status-label")
    statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh Oh! That&apos;s not a PNG, JPG, or GIF.</div>';
    taskError();
  }

};

function imageSize(img){
  var newImage = img.split("/");
  var imgOutput = "data://.my/colorizer/_new-" + newImage[newImage.length-1]
  newImage = "data://.my/colorizer/" + newImage[newImage.length-1]; 

  var input = [
  img, 
  newImage
  ];

  // Upload original to Data API  
  Algorithmia.client(Algorithmia.api_key)
  .algo("algo://ANaimi/URL2Data/0.1.0")
  .pipe(input)
  .then(function(output) {
    if(output.error){
      // Error Handling
      var statusLabel = document.getElementById("status-label")
      statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh Oh! Something went wrong: ' + output.error.message + ' </div>';
      taskError();
    } else {

      var imgInput = [
        newImage, 
        "-resize 800",
        imgOutput
      ];

      // Resize original image to 800px wide
      Algorithmia.client(Algorithmia.api_key)
      .algo("algo://bkyan/ImageMagick/0.2.0")
      .pipe(imgInput)
      .then(function(output) {
        if(output.error){
          // Error Handling
          var statusLabel = document.getElementById("status-label")
          statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh Oh! Something went wrong: ' + output.error.message + ' </div>';
          taskError();
        } else {
          // Call colorizer 
          colorizeIt(output.result, imgOutput);
        }
      });
    }
  });
}

function colorizeIt(input, original) {
	// Call Colorizer Algorithm
  Algorithmia.client(Algorithmia.api_key)
  .algo("algo://deeplearning/ColorfulImageColorization/0.1.7")
  .pipe(input)
  .then(function(output) {
    if(output.error){
      // Error Handling
      var statusLabel = document.getElementById("status-label")
      statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh Oh! Something went wrong: ' + output.error.message + ' </div>';
      taskError();
    } else {

     // getImg(output.result.output, original);
     getOriginalImage(original,output.result.output);

   }
 });
}

function getOriginalImage(img,colorized){
  // Retrieve original binary from Data API as base64
  Algorithmia.client(Algorithmia.api_key)
  .algo("algo://util/Data2Base64/0.1.0")
  .pipe(img)
  .then(function(output) {
    if(output.error){
      // Error Handling
      var statusLabel = document.getElementById("status-label")
      statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh Oh! Something went wrong: ' + output.error.message + ' </div>';
      taskError();
    } else {
      
      // Decode base64 img
      var outputImageOriginal = output.result;
      var src = "data:image/png;base64,";
      src += outputImageOriginal;

      getColorizedImage(colorized,src)

    }
  });
}

function getColorizedImage(img, original){
  var newImage = img.split("/");
  newImage = "data://.algo/deeplearning/ColorfulImageColorization/temp/" + newImage[newImage.length-1]; 

  // Retrieve Colorized binary from Data API as base64
  Algorithmia.client(Algorithmia.api_key)
  .algo("algo://util/Data2Base64/0.1.0")
  .pipe(newImage)
  .then(function(output) {
    if(output.error){
      // Error Handling
      var statusLabel = document.getElementById("status-label")
      statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh Oh! Something went wrong: ' + output.error.message + ' </div>';
      taskError();
    } else {
      
      // Decode base64 img
      var outputImage = output.result;
      var src = "data:image/png;base64,";
      src += outputImage;
      getMeta(original,src);
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