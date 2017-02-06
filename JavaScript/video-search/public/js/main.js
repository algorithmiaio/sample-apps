// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('sim4m8jnVOF3086ujBXdiYteIS01');
var algorithmVideoClassification = "algorithmiahq/VideoClassificationDemo/0.5.9";
window.player = null;

/**
 * once DOM is ready, update vars amd set initial URL
 */
$(document).ready(function() {
  setInviteCode('videosearch');
});

/**
 * run the specified query against algorithmiahq/VideoClassificationDemo and render the results
 * @param query (optional) query to use instead of $('#search-query') contents
 */
var search = function(query) {
  $("#status-label").empty();
  if(query) {
    $("#search-query").val(query);
  } else {
    query = $("#search-query").val().trim();
  }
  if(!query) {
    return;
  }
  showWait();
  var algoInput = {
    "collections": ["data://demo/VideoSearchDemo"],
    "keyword": query,
    "minConfidence": 0.15
  };
  algoClient.algo(algorithmVideoClassification).pipe(algoInput).then(function(output) {
    if(output.error) {
      // Error Handling
      showError(output.error.message);
    } else if (output.result.length==0) {
      showError('We couldn\'t find any videos for "'+query+'"');
    } else {
      // Render search results
      try {
        renderSearchResults(query, output.result);
        endWait(true);
      } catch(e) {
        console.log("error rendering", e);
        showError(e.message)
      }
    }
  });
};

/**
 * display results of the query inside $('#search-results')
 * @param query
 * @param results
 */
var renderSearchResults = function(query, results) {
  $('#search-results-query').text('"'+query+'"');
  var output = $('#search-results');
  output.empty();
  results.forEach(function(doc) {
    output.append('<li class="row video-result">'
      +'  <div class="col-sm-6"><div class="video-container">'+getIframeHtml(doc)+'</div></div>'
      +'  <div class="col-sm-6"><ul class="video-details">'
      +'    <li><p class="item-title">TERM</p><p class="lg">'+query+'</p></li>'
      +'    <li><p class="item-title">APPEARANCE</p><h4>'+getLinksHtml(doc)+'</h4></li>'
      +'    <li><p class="item-title">VIDEO</p><p class="lg">'+doc.title+'</p></li>'
      +'    <li><p class="item-title">CONFIDENCE</p><p class="lg">'+doc.avgConfidence.toFixed(3)+'</p></li>'
      +'  </ul></div>'
      +'</li>');
  });
};

/**
 * get YouTube iframe embed HTML
 * @param doc
 * @returns {string}
 */
var getIframeHtml = function(doc) {
  return '<iframe id="video_'+doc.videoId+'" width="560" height="315" src="https://www.youtube.com/embed/'+doc.videoId+'" frameborder="0" allowfullscreen></iframe>';
};

/**
 * get links HTML to jump video to start and end frames
 * @param doc
 * @returns {string}
 */
var getLinksHtml = function(doc) {
  return '<a onclick="jumpToVideo(\''+doc.videoId+'\','+doc.startFrame+')">'+formatTime(doc.startFrame)+'</a>'
    +' - <a onclick="jumpToVideo(\''+doc.videoId+'\','+doc.stopFrame+')">'+formatTime(doc.stopFrame)+'</a>';
};

/**
 * format a number of seconds as M:SS
 * @param seconds
 * @returns {string}
 */
var formatTime = function(seconds) {
  return Math.floor(seconds / 60)+":"+padleft(Math.floor(seconds % 60),2);
};

/**
 * jump the specified video iframe to a specific timepoint
 * @param videoId
 * @param time
 */
var jumpToVideo = function(videoId, time) {
  $('#video_'+videoId).attr('src','https://www.youtube.com/embed/'+videoId+'?start='+time+'&autoplay=1');
};

/**
 * show dots, hide button, disable links; pre-clear results
 */
var showWait = function() {
  $("#analyze-button-text").addClass("no-viz");
  $('#search-query').attr('disabled','disabled');
  $('.search-link').click(function (e) {e.preventDefault();});
  $(".dots-container").removeClass("hidden");
};

/**
 * hide dots, reveal button, enable links
 * @param showResults should the results section be revealed?
 */
var endWait = function(showResults) {
  $("#analyze-button-text").removeClass("no-viz");
  $('#search-query').removeAttr('disabled');
  $('.search-link').unbind('click');
  $(".dots-container").addClass("hidden");
  if(showResults) {
    $("#results").removeClass("hidden");
    $('html, body').animate({
      scrollTop: $("#results").offset().top
    }, 1000);
  } else {
    $("#results").addClass("hidden");
    $('#search-results').empty();
  }
};

var showError = function(message) {
  $("#status-label").html('<div class="alert alert-danger" role="alert">'+message+' </div>');
  endWait(false);
};
