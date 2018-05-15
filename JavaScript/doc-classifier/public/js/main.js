// this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simuIA0J68bR0L27q8M7X6dj0KT1');

var algorithms = {
  DocumentClassifier: 'nlp/DocumentClassifier/0.4.0'
};

var sampleInputs = {
  "data://demo/docclassify_chat_model":"Sorry, the Chatbot Demo has not yet been trained!",
  "data://nlp/arxiv_model":"Attention-based neural encoder-decoder frameworks have been widely adopted for image captioning. Most methods force visual attention to be active for every generated word. However, the decoder likely requires little to no visual information from the image to predict non-visual words such as the and of. Other words that may seem visual can often be predicted reliably just from the language model e.g., sign after behind a red stop or phone following talking on a cell."
};

var waitMessages = [
  'Scanning text...',
  'Extracting main keywords...',
  'Searching Reddit for dank memes...',
  'Inspecting images...',
  'Putting in contact lenses...',
  'Identifying shapes and colors...',
  'Reticulating splines...',
  'Calling mom for advice...',
  'Calculating cross-product of word intersections...',
  'Questioning the meaning of life, the universe, and everything...',
  'Math.ceil(6.48074^2)...',
  'Optimizing search tree...',
  'Breeding army of sentient Roombas...',
  'Getting next image...'
];

var waitMessageIndex = 0;

/**
 * once DOM is ready, update vars and add handlers
 */
$(document).ready(function() {
  setInviteCode('demo');
});

/**
 * fill inputText with content from selected URL
 */
var handleNamespaceSelection = function() {
  var namespace = $('#namespaceSelector').val();
  $('#status-label').empty();
  $('#inputText').val(sampleInputs[namespace]);
};

/**
 * call API on URL and display results
 */
var analyze = function() {
  var namespace = $('#namespaceSelector').val();
  if(!namespace) {return hideWait("Please select a model");}
  var inputText = $('#inputText').val().trim();
  if(!inputText) {return hideWait("Please enter some text to predict against");}
  showWait();
  var data = {
    "namespace": namespace,
    "mode": "predict",
    "data": [{
      "text": inputText
    }]
  };
  algoClient.algo(algorithms.DocumentClassifier).pipe(data).then(function(output) {
    if (output.error) {
      console.error(output.error);
      hideWait(output.error.message);
    } else {
      showResults(output.result.predictions);
    }
  },function(error) {
    console.error(error);
    hideWait(error);
  });
};

/**
 * reveal resultant JSON metadata
 * @param predictions [{text, topN[{confidence,predictions}]}]
 */
var showResults = function(predictions) {
  var html = '';
  console.log(predictions)
  for(var i in predictions) {
    if (!predictions[i].topN.length) {
      return hideWait('No prediction could be made: try typing more text or using a different model');
    }
    for(var j in predictions[i].topN) {
      var p =  predictions[i].topN[j];
      html += '<div class="col-sm-12 result-row">'+Math.round(100*p.confidence)+'% '+p.prediction+'</div>';
    }
  }
  $('#results-algo .result-output').html(html);
  hideWait();
};

/**
 * show a new wait message
 */
var rotateOverlayText = function() {
  waitMessageIndex = (waitMessageIndex+1)%waitMessages.length;
  $('.dots-text').text(waitMessages[waitMessageIndex]);
  if (!$('#overlay').hasClass('hidden')) {
    window.setTimeout(rotateOverlayText, 5000);
  }
};

/**
 * show overlay, clear results
 */
var showWait = function() {
  waitMessageIndex = 0;
  $('.dots-text').text(waitMessages[0]);
  $('#overlay').removeClass('hidden');
  window.setTimeout(rotateOverlayText, 5000);
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