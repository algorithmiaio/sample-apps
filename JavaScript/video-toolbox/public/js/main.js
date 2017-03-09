// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simeyUbLXQ/R8Qga/3ZCRGcr2oR1');

var algorithms = {
  videoTransform: {
    algorithm: 'demo/VideoTransformDemo/0.1.0', // media/VideoTransform/0.2.21
    result_field: 'output_file'
  },
  metadata: null,
  nsfw: null
};

var algorithmsUserSelectable = {
  deepstyle: {
    algorithm: "deeplearning/DeepFilter/0.6.0",
    advanced_input: {
      "images": "$BATCH_INPUT",
      "savePaths": "$BATCH_OUTPUT",
      "filterName": "smooth_ride"
    }
  },
  saliency: {
    algorithm: "deeplearning/SalNet/0.2.0"
  }
};

var algorithmTemplates = {
  videoTransform: {
      "input_file":null,
      "output_file":null,
      "algorithm":null,
      "fps": 30
    }
};

var selectedVideo;
var selectedAlgo;

/**
 * once DOM is ready, update vars and add handlers
 */
$(document).ready(function() {
  setInviteCode('videotransform');
  // $('input[name="selectedAlgorithm"]:first').click();
  // $('.sample-images a:first').click();
});

var selectVideo = function(name) {
  selectedVideo = name;
};

/**
 * call API on URL and display results
 */
var analyze = function() {
  if(!(selectedVideo&&selectedAlgo)) {return hideWait(null, "Please select a video and a modifier");}
  var data = jQuery.extend(algorithmTemplates.videoTransform, algorithmsUserSelectable[selectedAlgo]);
  data.input_file = 's3+demo://video-transform/'+selectedVideo+'.mp4';
  data.output_file = 's3+demo://video-transform/'+selectedVideo+'_'+selectedAlgo+'.mp4';
  showWait(selectedAlgo);
  algoClient.algo(algorithms.videoTransform.algorithm).pipe(data).then(function(output) {
    if (output.error) {
      hideWait(selectedAlgo, output.error.message);
    } else {
      hideWait(selectedAlgo);
      output.result[algorithms.videoTransform.result_field] = getHttpUrl(output.result[algorithms.videoTransform.result_field]);
      showResults(selectedAlgo, output.result);
    }
  });
};

/**
 * get the http URL which is mapped to our s3 bucket
 * @param s3file s3 data URI of file
 * @returns {string} http URL of file
 */
var getHttpUrl = function(s3file) {
  return s3file.replace('s3+demo://','https://s3.amazonaws.com/algorithmia-demos/');
};

/**
 * render tags and probabilities into
 * @param result [{"class":string,"prob":number}]
 */
var showResults = function(algorithm, result){
  $('#results-'+algorithm+' .result-title').text(algorithm);
// console.log(result)
// console.log(algorithms.videoTransform.result_field)
// console.log(result[algorithms.videoTransform.result_field])
  $('#results-'+algorithm+' .result-img').attr('src', result[algorithms.videoTransform.result_field]);
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
      scrollTop: $("#results-"+algorithm).offset().top
    }, 1000);
  }
};