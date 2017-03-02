// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simeyUbLXQ/R8Qga/3ZCRGcr2oR1');

var algorithms = {
  nudity: 'sfw/NudityDetectioni2v/0.2.6'
};

var selectedVideo;

/**
 * once DOM is ready, update vars and add handlers
 */
$(document).ready(function() {
  setInviteCode('isitnude');
  $('input[name="selectedAlgorithm"]:first').click();
  $('.sample-images a:first').click();
});

var selectVideo = function(uri) {
  selectedVideo = uri;
};

/**
 * call API on URL, get up to 7 results, and display them
 */
var analyze = function() {
  var url = selectedVideo;
  var algorithm = $('input[name="selectedAlgorithm"]:checked').val();
  if(url == "" || url=="http://") {
    return hideWait(algorithm, 'Please select an image, click the upload link, or enter a URL');
  }
  showWait(algorithm);
  algoClient.algo(algorithms.nudity).pipe(url).then(function(output) {
    if (output.error) {
      hideWait(algorithm, output.error.message);
    } else {
      showResults(algorithm, output.result);
      hideWait(algorithm);
    }
  });
};

/**
 * render tags and probabilities into
 * @param result [{"class":string,"prob":number}]
 */
var showResults = function(algorithm, result){
  $('#results-'+algorithm+' .result-title').text(algorithm);
  $('#results-'+algorithm+' .result-img').attr('src', selectedVideo);
  hideWait(algorithm);
};

/**
 * show overlay, clear results
 */
var showWait = function(algorithm) {
  $('.dots-text').text(algorithm);
  $('#overlay').removeClass('hidden');
  $('#status-label').empty();
  $('#results-'+algorithm+' .result-title').empty();
  $('#results-'+algorithm+' .result-img').removeAttr('src');
};


/**
 * close overlay and either reveal results or display errorMessage
 * @param errorMessage
 */
var hideWait = function(algorithm, errorMessage) {
  $("#overlay").addClass("hidden");
  if(errorMessage) {
    $('#status-label').html('<div class="alert alert-danger" role="alert">' + errorMessage+ '</div>');
    $('.results').addClass('hidden');
  } else {
    $('.results').addClass('hidden');
    $('#results-'+algorithm).removeClass('hidden');
    $('html, body').animate({
      scrollTop: $(".results-"+algorithm).offset().top
    }, 1000);
  }
};