window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = "simeyUbLXQ/R8Qga/3ZCRGcr2oR1"
var numTasks = 0;

function callAlgorithm() {
  startTask();

  // Get the img URL
  var img = document.getElementById("imgUrl").value;

  // Remove any whitespaces around the url
  img = img.trim();

  // Check if URL is an image
  var checkImg = img.split('.').pop();
  var extensions = ['png','jpg','jpeg','bmp','gif'];

  if (extensions.indexOf(checkImg) > -1){
    // Call the Image Resizing Function
    getPlaces(img);
  } else {
      // Error Handling
    var statusLabel = document.getElementById("status-label")
    statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh Oh! That&apos;s not a PNG, JPG, or GIF.</div>';
    taskError();
  }
  // getPlaces(img)
  // document.getElementById("urlAddress").innerHTML = img;
};


function getPlaces(url){
  var input = {
    "image": url,
    "numResults": 7
  }

  Algorithmia.client(Algorithmia.api_key)
  .algo("algo://deeplearning/Places365Classifier/0.1.8")
  .pipe(input)
  .then(function(output){
      if(output.error) {
        // Error Handling
        var statusLabel = document.getElementById("status-label")
        statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh Oh! Something went wrong: ' + output.error.message + ' </div>';
        taskError();
      } else {
        addPlaces(output.result.predictions, url);
      }
  });
}

function addPlaces(result, img){

  for (var i = 0; i < result.length; i++){
    var num = result[i].prob * 100;
    var n = num.toFixed(2);
    n = n + "%"

    var table = document.getElementById("tbody")
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    cell1.innerHTML = '<span class="label label-success">'+result[i].class;+'</span>';
    cell2.innerHTML = n;
  }

  // Check if img is a Data URI
  var checkImg = img.split(':').shift();
  var prefix = ['data'];

  if (prefix.indexOf(checkImg) > -1){
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
        var src = "data:image/jpeg;base64,";
        src += outputImageOriginal;
        // Add img to DOM
        document.getElementById("userImg").src = src;
        finishTask();
      }
    });

  } else {
    // Add img to DOM
    document.getElementById("userImg").src = img;
    finishTask();
  }



}

function analyzeDefault(img) {
	document.getElementById("imgUrl").value = img;
	callAlgorithm();
}

function startTask() {
  numTasks++;
  document.getElementById("overlay").classList.remove("hidden");

  // Clear error messages
  var statusLabel = document.getElementById("status-label")
  statusLabel.innerHTML = "";
  // Clear table
  $("#tbody").empty();
  // Clear image
  var image = document.getElementById("userImg").src
  image.src = "";
}

function finishTask() {
  numTasks--;
  if(numTasks <= 0) {
    document.getElementById("overlay").classList.add("hidden");
    document.getElementById("explainer").classList.add("hidden");
    document.getElementById("results").classList.remove("hidden");
    document.getElementById("social").classList.remove("invisible");
    document.getElementById("marketing").classList.remove("hidden");
  }
}

function taskError() {
  numTasks = 0;
  document.getElementById("overlay").classList.add("hidden");
  document.getElementById("explainer").classList.add("display");
  document.getElementById("explainer").classList.remove("hidden");
  document.getElementById("results").classList.add("hidden");
  document.getElementById("social").classList.add("invisible");
  document.getElementById("marketing").classList.add("hidden");

}


function initDropzone() {
  window.Dropzone.autoDiscover = false;
  var dropzone = new Dropzone("#file-dropzone", {
    options: {
      sending: function() {}
    },
    acceptedFiles: "image/*",
    previewTemplate: "<div></div>",
    maxFilesize: 10,
    filesizeBase: 1024,
    createImageThumbnails: false,
    clickable: true
  });
  dropzone.__proto__.cancelUpload = function() {};
  dropzone.__proto__.uploadFile = function() {};
  dropzone.__proto__.uploadFiles = function() {};

  dropzone.on("processing", function(file) {
    startTask();

    var reader = new FileReader();
    reader.addEventListener("load", function () {
      console.log("Calling algorithm with uploaded image.");
      getPlaces(reader.result);
      dropzone.removeFile(file);
    }, false);
    reader.readAsDataURL(file);
    console.log("Reading uploaded image...");
  });

  dropzone.on("error", function(file, err) {
    dropzone.removeFile(file);
    var statusLabel = document.getElementById("status-label")
    statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh oh! ' + err + ' </div>';
    taskError();
  });
}
initDropzone();