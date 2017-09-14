// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simIPuiSZMMAbfq1AeKQU5zjkd/1');

var algorithms = {
  ScrapeRSS: 'tags/ScrapeRSS/0.1.6',
  Html2Text: 'util/Html2Text/0.1.6',
  GetImageLinks: 'diego/Getimagelinks/0.1.0',
  SocialMediaImageRecommender: 'demo/SocialMediaImageRecommenderDemo/0.1.2', // web/SocialMediaImageRecommender/0.1.4
  Data2Base64: 'util/Data2Base64/0.1.0'
};

var newsfeed = 'http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml';

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

var selectedImages = [];
var selectedSize = null;
var waitMessageIndex = 0;

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
    algoClient.algo(algorithms.ScrapeRSS).pipe(newsfeed).then(function(output) {
    if (output.error) {
      console.error(output.error.message);
    } else {
      inputTextUrlSelector.find("option").remove();
      inputTextUrlSelector.append(new Option('Select one...', ''));
      output.result = output.result.filter(function(e) {
        return !(/(trump|clinton|dead|death)/i.test(e.title)||/(\/politics|\/briefing)/i.test(e.url));
      });
      for (var i=0; i<Math.min(output.result.length,10); i++) {
        inputTextUrlSelector.append(new Option($("<textarea/>").html(output.result[i].title).val(), output.result[i].url));
      }
    }
    inputTextUrlSelector.append(new Option('Custom', 'Enter URL'));
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
  $('#status-label').empty();
  var inputTextUrlEntryWrapper = $('#inputTextUrlEntryWrapper');
  var inputTextUrlEntry = $('#inputTextUrlEntry');
  var inputTextUrlSelector = $('#inputTextUrlSelector');
  var url = inputTextUrlEntryWrapper.is(':visible')?inputTextUrlEntry.val():inputTextUrlSelector.find(':selected').val();
  var inputTextDiv = $('#inputText');
  var imageDiv = $('#images');
  if(url=='Enter URL') {
  inputTextUrlEntryWrapper.show();
  inputTextUrlSelector.hide();
  } else if(url) {
    $('#inputs').show('fast');
    inputTextDiv.text('Loading article...');
    imageDiv.html('<div class="col-xs-12 sample-image">Loading images...</div>');
    algoClient.algo(algorithms.Html2Text).pipe(url).then(function(output) {
      if (output.error) {
        inputTextDiv.text('Cannot load '+url);
        console.error(output.error.message);
      } else {
        inputTextDiv.text(output.result);
      }
    },function(error) {
      inputTextDiv.text('Cannot load '+url);
      console.error(error);
    });
    algoClient.algo(algorithms.GetImageLinks).pipe(url).then(function(output) {
      if (output.error || !output.result || !output.result.length) {
        imageDiv.text('Cannot load images from '+url);
        console.error(output.error.message);
      } else {
        selectedImages = unique(output.result).slice(0, 4);
        updateImages();
      }
    },function(error) {
      imageDiv.text('Cannot load images from '+url);
      console.error(error);
    });
  }
};

/**
 * remove duplicates from array
 * @param arr
 * @return []
 */
var unique = function(arr) {
  return arr.filter(function(value, index, self) {
    return self.indexOf(value)===index;
  });
};

var updateImages = function() {
  var html = '';
  selectedImages.forEach(function(img){
    html += '<div class="col-xs-6 col-sm-3 sample-image"><img src="'+img+'"></div>';
  });
  $('#images').html(html);
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
  var inputText = $('#inputText').text().trim();
  if(!inputText) {return hideWait("Please select an article");}
  if(selectedImages.length<2) {return hideWait("At least two images are required");}
  if(!selectedSize) {return hideWait("Please select an output size");}
  showWait();
  var data = {
    text: inputText.substring(0,6000),
    images: selectedImages,
    dimension: outputDimensions[selectedSize]
  };
  algoClient.algo(algorithms.SocialMediaImageRecommender).pipe(data).then(function(output) {
    if (output.error) {
      console.error(error);
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
  var html='<div class="result-title col-md-12">Your images have been smart cropped, and ranked based on how relevant they are to the article. The image with the highest score is likely the best image to use when sharing your article on '+selectedSize+'</div>';
  var size = outputDimensions[selectedSize];
  for(var i in recommendations) {
    var rec = recommendations[i];
    var filename = rec.social_image.substring(rec.social_image.lastIndexOf('/')+1);
    var style = 'width:'+size.width+'px;height:'+size.height+'px;display:none';
    html += '<div class="col-xs-6 col-sm-6 col-md-3 result-row">'
      + '<div>Score: '+Math.round(rec.score*100)/100+'</div>'
      + '<a href="'+rec.original_image+'" download="'+filename+'"><img src="'+rec.original_image+'" style="'+style+'"><div class="aspinner"></div></a>'
      + '</div>';
  }
  $('#results-algo .result-output').html(html);
  hideWait();
  setTimeout(function(){
    for (var i in recommendations) {
      fixResultSources(recommendations[i].original_image,recommendations[i].social_image);
    }
  },500);
};

/**
 * replace src and href of result image with the resized social image
 * @param srcUrl URL of original image
 * @param dataUri Data URI to replace srcUrl with
 */
function fixResultSources(srcUrl,dataUri) {
  algoClient.algo(algorithms.Data2Base64).pipe(dataUri).then(function(output) {
    if (output.error) {
      $('.results a[href="' + srcUrl + '"] .aspinner').hide();
      $('.results img[src="' + srcUrl + '"]').show();
      console.error(output.error.message);
    } else {
      var src = 'data:image/png;base64,' + output.result;
      $('.results a[href="' + srcUrl + '"] .aspinner').hide();
      $('.results img[src="' + srcUrl + '"]').attr('src', src).show('slow');
      $('.results a[href="' + srcUrl + '"]').attr('href', src);
    }
  });
}

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