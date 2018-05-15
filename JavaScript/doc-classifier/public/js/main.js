// this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simIPuiSZMMAbfq1AeKQU5zjkd/1');

var algorithms = {
  ScrapeRSS: 'tags/ScrapeRSS/0.1.6',
  Html2Text: 'util/Html2Text/0.1.6',
  GetImageLinks: 'diego/Getimagelinks/0.1.0',
  SocialMediaImageRecommender: 'demo/SocialMediaImageRecommenderDemo/0.1.2', // web/SocialMediaImageRecommender/0.1.4
  Data2Base64: 'util/Data2Base64/0.1.0'
};

var namespaces = [
  ['Chatbot Demo TBD','data://demo/docclassify_chat_model'],
  ['Scientific Document Classification','data://nlp/arxiv_model']
];

var outputDimensions = {
  facebook: {
    width: 1200,
    height: 628
  },
  twitter: {
    width: 1024,
    height: 576
  },
  linkedin: {
    width: 552,
    height: 368
  }
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

var selectedSize = null;
var waitMessageIndex = 0;

/**
 * once DOM is ready, update vars and add handlers
 */
$(document).ready(function() {
  setInviteCode('demo');
  initTextSelector();
});

/**
 * fill namespaceSelector with news feed links
 */
var initTextSelector = function() {
  var namespaceSelector = $('#namespaceSelector');
  namespaceSelector.find("option").remove();
  namespaceSelector.append(new Option('Select one...', ''));
  for (var i=0; i<namespaces.length; i++) {
    namespaceSelector.append(new Option($("<textarea/>").html(namespaces[i][0]).val(), namespaces[i][1]));
  }
  namespaceSelector.prop("disabled",false);
};

/**
 * fill inputText with content from selected URL
 */
var handleNamespaceSelection = function() {
  var namespaceSelector = $('#namespaceSelector');
  var inputTextDiv = $('#inputText');
  $('#status-label').empty();
  $('#inputs').show('fast');
  inputTextDiv.text('Sample input TBD...');
};

/**
 * call API on URL and display results
 */
var analyze = function() {
  // TBD: check namespaceSelector
  var inputText = $('#inputText').text().trim();
  if(!inputText) {return hideWait("Please select a model");}
  showWait();
  var data = {
    document: inputText
  };
  algoClient.algo(algorithms.SocialMediaImageRecommender).pipe(data).then(function(output) {
    if (output.error) {
      console.error(error);
      hideWait(output.error.message);
    } else {
      showResults(output.result);
    }
  },function(error) {
    console.error(error);
    hideWait(error);
  });
};

/**
 * reveal resultant JSON metadata
 * @param results
 */
var showResults = function(results) {
  var html='<div class="result-title col-md-7">'+JSON.stringify(results)+'</div>';
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