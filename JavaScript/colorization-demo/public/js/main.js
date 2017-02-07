// clouds https://images.unsplash.com/16/unsplash_525a7e89953d1_1.JPG
// hills https://images.unsplash.com/29/cloudy-hills.jpg
// rock https://images.unsplash.com/reserve/yZfr4jmxQyuaE132MWZm_stagnes.jpg
// paris https://images.unsplash.com/33/YOfYx7zhTvYBGYs6g83s_IMG_8643.jpg

// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simYU7sWtoiMToSYQC9uVqdAURb1');

var algorithms = {
  colorize: 'algorithmiahq/ColorizationDemo/1.1.16'
};

/**
 * once DOM is ready, update vars amd set initial URL
 */
$(document).ready(function() {
  setInviteCode('color');
  initDropzone();
  $('#compareLink').click(function() {
      downloadCanvas(this, 'twoface', 'rendered-comparison.png');
  }, false);
});

/**
 * analyze specified image
 * @param img
 */
var analyzeDefault = function(img) {
	$('#imgUrl').val(img);
	callAlgorithm();
};

/**
 * clear status, colorify current image
 */
var callAlgorithm = function() {
  var statusLabel = $('#status-label').empty();
  // Get the img URL
  var img = $('#imgUrl').val().trim();
  if(img !== "") {
    startTask();
    // Call Image Colorization
    colorify(img);
  }
};

/**
 * download result file
 * @param link
 * @param canvasId
 * @param filename
 */
var downloadCanvas = function(link, canvasId, filename) {
    link.href = $(canvasId)[0].toDataURL();
    link.download = filename;
};

/**
 * call API to colorize image
 * @param img
 */
var colorify = function(img) {
  algoClient.algo(algorithms.colorize).pipe(img).then(function(output) {
      if(output.error) {
        // Error Handling
        $('#status-label').html('<div class="alert alert-danger" role="alert">Uh Oh! Something went wrong: ' + output.error.message + ' </div>');
        taskError();
      } else {
        console.log("got output", output.result);
        // Decode base64 imgs
        var imgOriginal = "data:image/png;base64," + output.result[0];
        var imgColorized = "data:image/png;base64," + output.result[1];
        // Show the download link if API also returned the URL
        if(output.result.length > 2) {
            $('downloadLinks').removeClass('hidden');
            $('#resultLink').attr('href',output.result[2]);
        } else {
            $('#downloadLinks').addClass('hidden');
            $('#resultLink').attr('href','#');
        }
        getMeta(imgOriginal, imgColorized);
      }
    });
};

/**
 * show TwoFace demo of original vs colorized file
 * @param original
 * @param colorized
 */
var getMeta = function(original,colorized) {
  var img = new Image();
  img.onload = function(){
    // Get height and width of original image
    width = this.width;
    height = this.height;
    var twoface = TwoFace('twoface-demo', width, height);
    twoface.add(original);
    twoface.add(colorized);
    finishTask();
  };
  img.src = colorized;
};

/**
 * remove overlay, clear demo
 */
var startTask = function() {
  $('#overlay').removeClass('hidden');
  $('#twoface-demo').empty();
};

/**
 * reveal results
 */
var finishTask = function() {
  $('overlay').addClass('hidden');
  $('explainer').addClass('hidden');
  $('results').removeClass('hidden');
  $('social').removeClass('invisible');
  $('marketing').removeClass('hidden');
};

/**
 * hide results
 */
var taskError = function() {
  $('overlay').addClass('hidden');
  $('explainer').addClass('display').removeClass('hidden');
  $('results').addClass('hidden');
  $('social').addClass('invisible');
  $('marketing').addClass('hidden');
};

/**
 * initialize Dropzone component
 */
var initDropzone  = function() {
  window.Dropzone.autoDiscover = false;
  var dropzone = new Dropzone("#file-dropzone", {
    options: {sending: function() {}},
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
    $('#status-label').empty();
    startTask();
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      console.log("Calling algorithm with uploaded image.");
      colorify(reader.result);
      dropzone.removeFile(file);
    }, false);
    reader.readAsDataURL(file);
    console.log("Reading uploaded image...");
  });
  dropzone.on("error", function(file, err) {
    dropzone.removeFile(file);
    $('#status-label').html('<div class="alert alert-danger" role="alert">Uh oh! ' + err + ' </div>');
    taskError();
  });
};
