// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simIPuiSZMMAbfq1AeKQU5zjkd/1');

var algorithms = {
  SMIR: 'web/SocialMediaImageRecommender/0.1.3'
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

/**
 * select or deselect a thumbnail
 * @param href
 */
var toggleImage = function(href) {
  setError();
  if(selectedImages[href]) {
    delete selectedImages[href];
  } else {
    if(Object.keys(selectedImages).length>9) {
      setError("You cannot select more than 10 images")
    } else {
      selectedImages[href] = true;
    }
  }
  updateImageCount();
  highlightImages();
};

var updateImageCount = function() {
  var count = Object.keys(selectedImages).length;
  $('#imageCount').text(count?('('+count+' images selected)'):'');
};

/**
 * search for new pixabay images
 */
var searchImages = function() {
  $('.pixabay_widget').attr('data-search', $('#imageTopic').val());
  initPixabayWidget();
  selectedImages = {};
  updateImageCount();
};

/**
 * react to pagination events
 */
var handlePagination = function() {
  setTimeout(highlightImages);
  setTimeout(highlightImages,500);
};

/**
 * ensure (only) selected images have 'active' class set
 */
var highlightImages = function() {
  $('.pixabay_widget img.image-thumb').each(function(i,elem) {
    if (elem.src&&selectedImages[elem.src]) {
      $(elem).addClass('active');
    } else {
      $(elem).removeClass('active')
    }
  });
};

/**
 * pick size of output image
 * @param name
 */
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
  setError();
  $('#results-algo .result-output').empty();
};

/**
 * close overlay and either reveal results or display errorMessage
 * @param errorMessage
 */
var hideWait = function(errorMessage) {
  $("#overlay").addClass("hidden");
  if(errorMessage) {
    setError(errorMessage);
    $('#results-algo').addClass('hidden');
  } else {
    $('#results-algo').removeClass('hidden');
    $('html, body').animate({
      scrollTop: $('#results-algo').offset().top
    }, 1000);
  }
};

/**
 * display errorMessage
 * @param errorMessage
 */
function setError(errorMessage) {
  if(errorMessage) {
    $('#status-label').html('<div class="alert alert-danger" role="alert">' + errorMessage + '</div>');
  } else {
    $('#status-label').empty();
  }
}