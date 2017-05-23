// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simeyUbLXQ/R8Qga/3ZCRGcr2oR1');

var algorithms = {
  videoMetadata: {
    algorithm: 'demo/VideoMetadataExtractionDemo',
    result_field: 'output_file'
  }
};

var algorithmsUserSelectable = {
  nudity: {
    algorithm: "sfw/nuditydetectioni2v/0.2.12",
    displaytext: "Detect Nudity"
  },
  tagger: {
    algorithm: "deeplearning/IllustrationTagger/0.2.4",
    displaytext: "Tag Video"
  }
};

var algorithmTemplates = {
  videoMetadata: {
      "input_file":null,
      "output_file":null,
      "algorithm":null,
      "fps": 5
    }
};

var selectedVideo;
var selectedAlgo;
var resultsInterval;

/**
 * once DOM is ready, update vars and add handlers
 */
$(document).ready(function() {
  setInviteCode('videometadata');
  //resize results whenever window is resized
  $(window).resize(function() {
    resizeResultAreas();
  });
  //reload videos if initial load fails
  $('video').each(function(i, video) {
    video.addEventListener('error', function (e) {
      var curr_src = $(video).attr('src');
      console.log(('Reloading '+curr_src));
      if(curr_src) {
        var curr_src_arr = curr_src.split("?");
        var new_src = curr_src_arr[0] + "?t=" + new Date().getMilliseconds();
        $(video).attr('src', new_src);
        $(video).find('source').attr('src', new_src);
        video.load();
      }
    }, false);
  });
});

var selectVideo = function(name) {
  $('.video-thumb').removeClass('active');
  $('#video-thumb-'+name).addClass('active');
  selectedVideo = name;
};

var selectAlgo = function(name) {
  $('button').removeClass('active');
  $('#button-'+name).addClass('active');
  selectedAlgo = name;
};

/**
 * call API on URL and display results
 */
var analyze = function() {
  if(!(selectedVideo&&selectedAlgo)) {return hideWait(null, "Please select a video and an algorithm");}
  var data = jQuery.extend(algorithmTemplates.videoMetadata, algorithmsUserSelectable[selectedAlgo]);
  data.input_file = 'http://s3.amazonaws.com/algorithmia-demos/video-metadata/'+selectedVideo+'.mp4';
  data.output_file = 'data://.algo/media/VideoMetadataExtraction/perm/'+selectedVideo+'_'+selectedAlgo+'.json';
  showWait(selectedAlgo);
  algoClient.algo(algorithms.videoMetadata.algorithm).pipe(data).then(function(output) {
    if (output.error) {
      hideWait(selectedAlgo, output.error.message);
    } else {
      var inputFileUrl = getHttpUrl(data.input_file);
      $('#results-'+selectedAlgo+' .result-input').attr({'src': inputFileUrl, 'poster': inputFileUrl+'.png'});
      showResults(selectedAlgo, output.result);
    }
  },function(error) {hideWait(selectedAlgo, error);});
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
 * start playback of a video
 * @param selector
 */
var playVideo = function(selector) {
  $(selector).each(function(i,e){try{e.play()}catch(e){}});
};

/**
 * resize .result-output elements to be same height as videos
 */
function resizeResultAreas() {
  Object.keys(algorithmsUserSelectable).forEach(function (algo) {
    $('#results-'+algo+' .result-output').height($('#results-'+algo+' video').height() - 5);
  });
}

/**
 * reveal resultant JSON metadata
 * @param selectedAlgo display name of the algo which was run
 * @param json JSON metadata results
 */
var showResults = function(selectedAlgo, json){
  if(resultsInterval) {
    window.clearInterval(resultsInterval);
    resultsInterval = null;
  }
  var resultArea = $('#results-'+selectedAlgo+' .result-output');
  var resultAreaCheckbox = $('#results-'+selectedAlgo+' .fullresults');
  var videoArea = $('#results-'+selectedAlgo+' video');
  frames = JSON.parse(json)['frame_data'];
  for (var i=0; i<frames.length; i++) {delete frames[i].data.url;}
  resultArea.val('Loading...');
  var refreshResults = function() {
    if(resultAreaCheckbox.is(':checked')) {
      framesShown = frames;
    } else {
      var time = videoArea[0].currentTime;
      framesShown = [];
      for (var i=0; i<frames.length; i++) {
        if(frames[i]['timestamp']<=time) {
          framesShown=frames[i]; //frames.slice(0,i);
        }
      }
    }
    resultArea.val(JSON.stringify(framesShown, undefined, 2));
    // resultArea.animate({scrollTop:resultArea[0].scrollHeight - resultArea.height()},500);
  };
  resultsInterval = window.setInterval(refreshResults, 1000);
  hideWait(selectedAlgo);
  resizeResultAreas();
  playVideo('#results-'+selectedAlgo+' video');
};

/**
 * show overlay, clear results
 */
var showWait = function(algorithm) {
  $('.dots-text').text(algorithmsUserSelectable[algorithm].displaytext);
  $('#overlay').removeClass('hidden');
  $('#status-label').empty();
  $('#results-'+algorithm+' .result-input').removeAttr('src');
  $('#results-'+algorithm+' .result-output').removeAttr('src');
  $('#results-'+algorithm+' .result-link').removeAttr('href');
};


/**
 * close overlay and either reveal results or display errorMessage
 * @param algorithm display name of the algo which was run
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