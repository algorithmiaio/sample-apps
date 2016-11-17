// clouds https://images.unsplash.com/16/unsplash_525a7e89953d1_1.JPG
// hills https://images.unsplash.com/29/cloudy-hills.jpg
// rock https://images.unsplash.com/reserve/yZfr4jmxQyuaE132MWZm_stagnes.jpg
// paris https://images.unsplash.com/33/YOfYx7zhTvYBGYs6g83s_IMG_8643.jpg

// Filter selection
var defaultFilters = [
  "none", "smooth_ride", "space_pizza", "purple_pond", "sunday", "alien_goggles"
];
var currentFilter = "smooth_ride";

var resultImg = document.getElementById("resultImg")
var resultCanvas = document.getElementById("resultCanvas");
var downloadLink = document.getElementById("resultLink");

var currentImg = "";

window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = "simZfwrSvLraXpTAgJpIL53Ugji1";
var numTasks = 0;

// Update the style thumbnail view state
function updateStyleButtons() {
  var styleButtons = document.getElementsByClassName("style-thumb");
  for(var i = 0; i < styleButtons.length; i++) {
    var button = styleButtons[i];
    button.onclick = changeStyle;
    var styleName = button.getAttribute("data-style");
    if(styleName === currentFilter) {
      button.classList.add("selected")
    } else {
      button.classList.remove("selected")
    }
  }
}

// Called when a user clicks on a style thumbnail
function changeStyle(event, b) {
  newStyle = this.getAttribute("data-style");
  if(newStyle !== currentFilter) {
    console.log("Changing style to " + newStyle);
    currentFilter = newStyle;
    updateStyleButtons();
    generateStylizedImage(currentImg, currentFilter);
  }
}

function prevStyle() {
  var index = defaultFilters.indexOf(currentFilter);
  currentFilter = defaultFilters[(index + 5) % defaultFilters.length];
  updateStyleButtons();
  generateStylizedImage(currentImg, currentFilter);
}
function nextStyle() {
  var index = defaultFilters.indexOf(currentFilter);
  currentFilter = defaultFilters[(index + 1) % defaultFilters.length];
  updateStyleButtons();
  generateStylizedImage(currentImg, currentFilter);
}

function callAlgorithm() {
  var statusLabel = document.getElementById("status-label");
  statusLabel.innerHTML = "";

  // Get the img URL
  currentImg = document.getElementById("imgUrl").value.trim();
  currentFilter = "smooth_ride";
  updateStyleButtons();

  if(typeof(currentImg) == "string" && currentImg !== "") {
    // Display stylized image
    generateStylizedImage(currentImg, currentFilter);
  } else {
    var statusLabel = document.getElementById("status-label");
    statusLabel.innerHTML = '<div class="alert alert-warning" role="alert">Oops! Please enter an image URL first</div>';
  }

};

function generateStylizedImage(img, filterName) {
  console.log("generateStylizedImage", img.substring(0,20), filterName);
  if(img === "") {
    console.error("Image cannot be empty");
    return;
  }
  if(filterName === "none") {
    // Display original image
    if(img.startsWith("data:image/jpeg;base64,")) {
      displayImgBase64(img, img);
    } else {
      displayImg(img);
    }
    return;
  }

  startTask();

  var uuid = Math.random().toString(36).substring(7);
  var algoInput = {
    "images": [img],
    "savePaths": ["s3+turing://algorithmia-demos/deepstyle/" +  uuid + ".jpg"],
    "filterName": filterName
  };

  Algorithmia.client(Algorithmia.api_key)
    .algo("algo://deeplearning/DeepFilter/0.3.3")
    .pipe(algoInput)
    .then(function(output) {
      if(output.error) {
        // Error Handling
        var statusLabel = document.getElementById("status-label");
        statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh Oh! Something went wrong: ' + output.error.message + ' </div>';
        taskError();
      } else {
        if(output.result.savePaths.length == 1) {
          var url = output.result.savePaths[0];
          url = url.replace("s3+turing://", "https://s3.amazonaws.com/");
          console.log("got output", url);

          // Display stylized image
          displayImg(url, function() {
            finishTask();
          });

        } else {
          console.error("Unexpected result from DeepFilter", output);
        }

      }
    });
}

function displayImg(url, cb) {
  Algorithmia.client(Algorithmia.api_key)
    .algo("algo://util/data2base64")
    .pipe(url)
    .then(function(output) {
      var base64 = "data:image/jpeg;base64," + output.result.replace(/\n/g,"");
      displayImgBase64(url, base64, cb);
    });
}

function displayImgBase64(url, base64, cb) {
  console.log("got base 64");

  // Update download link
  downloadLink.href = url;
  // downloadLink.onclick = clickDownload;

  // Update stylized image
  // resultImg.crossOrigin = ""; // necessary for canvas to access image data
  resultImg.setAttribute("src", base64);

  // Update stylized canvas
  var ctx = resultCanvas.getContext("2d");
  resultImg.onload = function() {
    resultCanvas.width = resultImg.width;
    resultCanvas.height = resultImg.height;
    // ctx.drawImage(img, 0, 0, resultImg.width, resultImg.height);
    resetColors();
    resultCanvas.classList.remove("faded");

    // Scroll to image
    resultCanvas.scrollIntoView();

    // Done
    if(cb) cb();
  };

  // Show results if not already showing
  var resultsDiv = document.getElementById("results");
  resultsDiv.style.display = "block";
  resultsDiv.style.height = "";
  // var resultsThumbsDiv = document.getElementById("results-thumbnails");
  // resultsThumbsDiv.style.display = "block";
  // resultsThumbsDiv.style.height = "";
  document.getElementById("downloadLinks").classList.remove("hidden");
}

function clickDownload(e) {
  var link = document.createElement("a");
  link.download = "stylized.png";
  link.href = canvas.toDataURL();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
  e.preventDefault();
  return false;
}

function analyzeDefault(img) {
	document.getElementById("imgUrl").value = img;
	callAlgorithm();
}

function startTask() {
  numTasks++;
  document.getElementById("overlay").classList.remove("hidden");
  document.getElementById("resultImg").classList.add("faded");
  document.getElementById("resultCanvas").classList.add("faded");
}

function finishTask() {
  numTasks--;
  if(numTasks <= 0) {
    document.getElementById("overlay").classList.add("hidden");
    // document.getElementById("explainer").classList.add("hidden");
    document.getElementById("results").classList.remove("hidden");
    // document.getElementById("social").classList.remove("invisible");
    // document.getElementById("marketing").classList.remove("hidden");
  }
}

function taskError() {
  numTasks = 0;
  document.getElementById("overlay").classList.add("hidden");
  // document.getElementById("explainer").classList.add("display");
  // document.getElementById("explainer").classList.remove("hidden");
  document.getElementById("results").classList.add("hidden");
  // document.getElementById("social").classList.add("invisible");
  // document.getElementById("marketing").classList.add("hidden");
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
    document.getElementById("imgUrl").value = "";
    var statusLabel = document.getElementById("status-label")
    statusLabel.innerHTML = "";
    // startTask();

    var reader = new FileReader();
    reader.addEventListener("load", function () {
      console.log("Calling algorithm with uploaded image.");
      currentImg = reader.result;
      currentFilter = "smooth_ride";
      updateStyleButtons();
      generateStylizedImage(currentImg, currentFilter);
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

updateStyleButtons();
initDropzone();
