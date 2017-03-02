// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simeyUbLXQ/R8Qga/3ZCRGcr2oR1');

var algorithms = {
  nudity: 'sfw/NudityDetectioni2v/0.2.6'
};

/**
 * once DOM is ready, update vars and add handlers
 */
$(document).ready(function() {
  setInviteCode('isitnude');
  requireHttp($('#imgUrl'));
  initDropzone();
});

/**
 * call API on URL, get up to 7 results, and display them
 * @param url
 */
var analyzeImage = function(url) {
  if(url) {
    $('#imgUrl').val(url.indexOf('http')==0?url:''); //only display http URLs
  } else {
    url = $('#imgUrl').val();
  }
  if(url == "" || url=="http://") {
    return hideWait('Please select an image, click the upload link, or enter a URL');
  }
  showWait();
  $('#result-img').attr('src',url);
  algoClient.algo(algorithms.nudity).pipe(url).then(function (output) {
    if (output.error) {
      hideWait(output.error.message);
    } else {
      showResults(output.result);
      hideWait();
    }
  });
};

/**
 * render tags and probabilities into
 * @param result [{"class":string,"prob":number}]
 */
var showResults = function(result){
  if(result.nude) {
    $('#result-rating').html("R - Nude <nobr>(we're "+Math.round(result.confidence*100)+"% sure)</nobr>").addClass('r');
    $('#result-message').html('You might want to be careful where you post this!');
  } else {
    $('#result-rating').html("G - Not Nude <nobr>(we're "+Math.round(result.confidence*100)+"% sure)</nobr>").addClass('g');
    $('#result-message').html('You can probably post this.');
  }
  hideWait();
};

/**
 * show overlay, clear results
 */
var showWait = function() {
  $('#overlay').removeClass('hidden');
  $('#status-label').empty();
  $('#result-rating').html('<span class="aspinner"></span>').removeClass('g').removeClass('r');
  $('#result-message').empty();
  $('#result-img').removeAttr('src');
};


/**
 * close overlay and either reveal results or display errorMessage
 * @param errorMessage
 */
var hideWait = function(errorMessage) {
  $("#overlay").addClass("hidden");
  if(errorMessage) {
    $('#status-label').html('<div class="alert alert-danger" role="alert">' + errorMessage+ '</div>');
    $('#results').addClass('hidden');
  } else {
    $('#results').removeClass('hidden');
    $('html, body').animate({
      scrollTop: $("#results").offset().top
    }, 1000);
  }
};

/**
 * initialize Dropzone component
 */
var initDropzone = function() {
  window.Dropzone.autoDiscover = false;
  var dropzone = new Dropzone("#file-dropzone", {
    url: 'javascript:;',
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
    showWait();
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      analyzeImage(reader.result);
      dropzone.removeFile(file);
    }, false);
    reader.readAsDataURL(file);
  });
  dropzone.on("error", function(file, err) {
    dropzone.removeFile(file);
    hideWait(err);
  });
};