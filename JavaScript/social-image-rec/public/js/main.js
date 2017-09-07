// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simIPuiSZMMAbfq1AeKQU5zjkd/1');

var algorithms = {
  ScrapeRSS: 'tags/ScrapeRSS/0.1.6',
  Html2Text: 'util/Html2Text/0.1.6',
  SocialMediaImageRecommender: 'demo/SocialMediaImageRecommenderDemo/0.1.1' // web/SocialMediaImageRecommender/0.1.3
};

var newsfeeds = {
  yahoo: 'https://www.yahoo.com/news/rss/mostviewed'
};

var outputDimensions = {
  facebook: {
    width: 100,
    height: 100
  },
  twitter: {
    width: 100,
    height: 100
  },
  linkedin: {
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
  initTextSelector();
});

/**
 * fill inputTextUrlSelector with news feed links
 */
var initTextSelector = function() {
  $('#inputTextUrlEntry').on('keypress', function(e) {
    if ((e.keyCode||e.which) == '13') {
      prefillText();
    }
  });
  var inputTextUrlSelector = $('#inputTextUrlSelector');
    algoClient.algo(algorithms.ScrapeRSS).pipe(newsfeeds.yahoo).then(function(output) {
    if (output.error) {
      console.error(output.error.message);
    } else {
      inputTextUrlSelector.find("option").remove();
      inputTextUrlSelector.append(new Option('Select one...', ''));
      for (var i=0; i<Math.min(output.result.length,5); i++) {
        inputTextUrlSelector.append(new Option($("<textarea/>").html(output.result[i].title).val(), output.result[i].url));
      }
    }
    inputTextUrlSelector.append(new Option('custom', 'Enter URL'));
    inputTextUrlSelector.prop("disabled",false);
  },function(error) {
    console.error(error);
  });
};

/**
 * hide manual URL entry and reveal selector
 */
var cancelTextUrlEntry = function () {
  $('#inputTextUrlEntryWrapper').hide();
  $('#inputTextUrlSelector').show();
};

/**
 * fill inputText with content from selected URL
 */
var prefillText = function() {
  var inputTextUrlEntryWrapper = $('#inputTextUrlEntryWrapper');
  var inputTextUrlEntry = $('#inputTextUrlEntry');
  var inputTextUrlSelector = $('#inputTextUrlSelector');
  var url = inputTextUrlEntryWrapper.is(':visible')?inputTextUrlEntry.val():inputTextUrlSelector.find(':selected').val();
  var inputText = $('#inputText');
  if(url=='Enter URL') {
  inputTextUrlEntryWrapper.show();
  inputTextUrlSelector.hide();
  } else if(url) {
    inputText.val('Loading...');
    algoClient.algo(algorithms.Html2Text).pipe(url).then(function(output) {
      if (output.error) {
        inputText.val('Cannot load '+url);
        console.error(output.error.message);
      } else {
        inputText.val(output.result);
      }
    },function(error) {
      inputText.val('Cannot load '+url);
      console.error(error);
    });
  }
};

/**
 * select or deselect a thumbnail
 * @param href
 */
var toggleImage = function(href) {
  setError();
  if(selectedImages[href]) {
    delete selectedImages[href];
  } else {
    if(Object.keys(selectedImages).length>=5) {
      setError("You cannot select more than 5 images")
    } else {
      selectedImages[href] = true;
    }
  }
  updateImageCount();
  highlightImages();
};

var updateImageCount = function() {
  var count = Object.keys(selectedImages).length;
  $('#imageCount').text(count?('('+count+' selected)'):'');
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
  var inputText = $('#inputText').val().trim();
  var images = Object.keys(selectedImages);
  if(!inputText) {return hideWait("Please enter some text");}
  if(images.length<2) {return hideWait("Please select at least two images");}
  if(!selectedSize) {return hideWait("Please select an output size");}
  showWait();
  var data = {
    text: inputText,
    images: images,
    dimension: outputDimensions[selectedSize]
  };
  algoClient.algo(algorithms.SocialMediaImageRecommender).pipe(data).then(function(output) {
    if (output.error) {
      hideWait(output.error.message);
    } else {
      showResults(selectedSize, output.result.recommendations);
    }
  },function(error) {
    console.error(error);
    hideWait(error);
  });
};

/**
 * reveal resultant JSON metadata
 * @param selectedSize display name of output image size
 * @param recommendations) [{social_image:string,score:number}]
 */
var showResults = function(selectedSize, recommendations) {
  if(!recommendations.length) {
    return 'No results. Either your text was too short, or the images you selected had nothing in common with the text'
  }
  var html='<div class="result-title col-md-12">Smart cropped for '+selectedSize+'</div>';
  for(var i in recommendations) {
    html += '<div class="col-md-3 result-row"><a href="'+recommendations[i].social_image+'"><img src="'+recommendations[i].original_image+'"></a>'+'<div>Score: '+Math.round(recommendations[i].score*100)/100+'</div></div>';
  }
  $('#results-algo .result-output').html(html);
  hideWait();
};

/**
 * show overlay, clear results
 */
var showWait = function() {
  $('.dots-text').text("Making recommendations...");
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