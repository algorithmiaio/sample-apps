// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simeyUbLXQ/R8Qga/3ZCRGcr2oR1');

var algorithms = {
  SMIR: 'web/SocialMediaImageRecommender/0.1.0'
};

var outputDimensions = {
  facebook: {
    width: 100,
    height: 100
  },
  twitter: {
    width: 100,
    height: 100
  }
};

var selectedImages = {};
var selectedSize = null;

/**
 * once DOM is ready, update vars and add handlers
 */
$(document).ready(function() {
  setInviteCode('socialimagerec');
});

var toggleImage = function(name) {
  if(selectedImages[name]) {
    $('#image-thumb-'+name).removeClass('active');
    delete selectedImages[name];
  } else {
    $('#image-thumb-'+name).addClass('active');
    selectedImages[name] = true;
  }
};

var selectSize = function(name) {
  $('button').removeClass('active');
  $('#button-'+name).addClass('active');
  selectedSize = name;
};

/**
 * call API on URL and display results
 */
var analyze = function() {
  if(!Object.keys(selectedImages).length&&selectedSize) {return hideWait("Please select image(s) and a size");}
  showWait();
  var data = {}; //TBD
  algoClient.algo(algorithms.SMIR).pipe(data).then(function(output) {
    if (output.error) {
      console.log(output);
      hideWait(output.error.message);
    } else {
      showResults(selectedSize, output.result);
    }
  },function(error) {
    console.log(error);
    hideWait(error);
  });
};

/**
 * reveal resultant JSON metadata
 * @param selectedSize display name of output image size
 * @param json JSON algo results
 */
var showResults = function(selectedSize, json) {
  $('#results-algo .result-output').text(json);
};

/**
 * show overlay, clear results
 */
var showWait = function() {
  $('.dots-text').text("Getting results...");
  $('#overlay').removeClass('hidden');
  $('#status-label').empty();
  $('#results-algo .result-output').empty();
};


/**
 * close overlay and either reveal results or display errorMessage
 * @param errorMessage
 */
var hideWait = function(errorMessage) {
  $("#overlay").addClass("hidden");
  if(errorMessage) {
    $('#status-label').html('<div class="alert alert-danger" role="alert">' + errorMessage+ '</div>');
    $('#results-algo').addClass('hidden');
  } else {
    $('#results-algo').removeClass('hidden');
    $('html, body').animate({
      scrollTop: $('#results-algo').offset().top
    }, 1000);
  }
};