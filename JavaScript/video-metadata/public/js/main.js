// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simeyUbLXQ/R8Qga/3ZCRGcr2oR1');

var algorithms = {
  videoMetadata: 'demo/VideoMetadataExtractionDemo/0.1.9',
  VideoTagSequencer: 'media/VideoTagSequencer/0.1.8'
};

var algorithmsUserSelectable = {
  nudity: {
    algorithm: "sfw/nuditydetectioni2v/0.2.12",
    displaytext: "Detect Nudity"
  },
  tagger: {
    algorithm: "deeplearning/InceptionNet/1.0.3",
    displaytext: "Tag Video"
  },
  cars: {
    algorithm: "LgoBE/CarMakeandModelRecognition/0.3.4",
    displaytext: "Identify Cars"
  },
  deepfashion: {
    algorithm: "algorithmiahq/DeepFashion/0.1.1",
    displaytext: "Tag Video"
  },
  places: {
    algorithm: "deeplearning/Places365Classifier/0.1.9",
    displaytext: "Places Classifier"
  },
  realestate: {
    algorithm: "deeplearning/RealEstateClassifier/0.2.3",
    displaytext: "Real Estate Classifier"
  },
  emotion: {
    algorithm: "deeplearning/EmotionRecognitionCNNMBP/0.1.3",
    displaytext: "Emotion Recognition"
  },
  faces: {
    algorithm: "dlib/faceDetection/0.2.0",
    displaytext: "Detect Faces"
  }
};

var algorithmTemplates = {
  videoMetadata: {
      "input_file":null,
      "output_file":null,
      "algorithm":null,
      "advanced_input":"$SINGLE_INPUT",
      "fps": 10
    },
  videoTagSequencer: {
    nudity: {
      tag_key: "nude",
      confidence_key: "confidence",
      traversal_path: "$ROOT",
      minimum_confidence: 0.65,
      minimum_sequence_length: 8
    },
    tagger: {
      tag_key: "class",
      confidence_key: "confidence",
      traversal_path:{tags: "$ROOT"},
      minimum_confidence: 0.1,
      minimum_sequence_length: 5
    },
    cars: {
      tag_key: ["body_style", "make", "model", "model_year"],
      confidence_key: "confidence",
      traversal_path: "$ROOT",
      minimum_confidence: 0.3,
      minimum_sequence_length: 2
    },
    deepfashion: {
        tag_key: "article_name",
        confidence_key: "confidence",
        traversal_path: {articles: "$ROOT"},
        minimum_confidence: 0.25,
        minimum_sequence_length: 5
    },
    places: {
      tag_key: "class",
      confidence_key: "prob",
      traversal_path: {predictions: "$ROOT"},
      minimum_confidence: 0.25,
      minimum_sequence_length: 5
    }
  }
};

var algoSuggestions = {
  "massage": ["nudity","tagger"],
  "india1643": ["tagger","deepfashion","places","emotion","faces"],
  "city730": ["tagger","cars","places"],
  "dance4428": ["tagger","deepfashion","places"],
  "slapping64": ["places","emotion","faces"],
  "woman87": ["tagger","deepfashion","places","emotion","faces"],
  "crowd6582": ["tagger","deepfashion","places","emotion","faces"],
  "busstation6094": ["tagger","cars","deepfashion","places"]
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
  $('button[name=selectedAlgorithm]').addClass('btn-suppressed');
  algoSuggestions[name].forEach(function(algo) {
    $('#button-'+algo).removeClass('btn-suppressed');
  });
  selectedVideo = name;
};

var selectAlgo = function(name) {
  $('button').removeClass('active');
  $('#button-'+name).addClass('active');
  $('#analyze-button-text').text(algorithmTemplates.videoTagSequencer[name]?'Extract Metadata & Build Timeline':'Extract Metadata');
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
  algoClient.algo(algorithms.videoMetadata).pipe(data).then(function(output) {
    if (output.error) {
      console.log(output);
      hideWait(selectedAlgo, output.error.message);
    } else {
      var inputFileUrl = getHttpUrl(data.input_file);
      $('#results-algo .result-input').attr({'src': inputFileUrl, 'poster': inputFileUrl+'.png'});
      showResults(selectedAlgo, output.result, data.output_file);
    }
  },function(error) {
    console.log(error);
    hideWait(selectedAlgo, error);
  });
};

/**
 * get the http URL which is mapped to our s3 bucket
 * @param s3file s3 data URI of file
 * @return {string} http URL of file
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
    $('#results-algo .result-output').css('min-height',($('#results-algo video').height() - 5));
  });
}

/**
 * reveal resultant JSON metadata
 * @param selectedAlgo display name of the algo which was run
 * @param json JSON metadata results
 * @param outputFile data URI of metadata file
 */
var showResults = function(selectedAlgo, json, outputFile){
  showSequenceResults(selectedAlgo,outputFile);
  if(resultsInterval) {
    window.clearInterval(resultsInterval);
    resultsInterval = null;
  }
  $('#results-algo .result-title').text(algorithmsUserSelectable[selectedAlgo].displaytext);
  var resultArea = $('#results-algo .result-output');
  var resultAreaTimestamp = $('#results-algo .result-timestamp');
  var resultAreaCheckbox = $('#results-algo .fullresults');
  var videoArea = $('#results-algo video');
  frames = JSON.parse(json)['frame_data'];
  for (var i=0; i<frames.length; i++) {
    delete frames[i].data.url;
    delete frames[i].data.output;
  }
  resultArea.val('Loading...');
  var refreshResults = function() {
    var framesShown = [];
    if(resultAreaCheckbox.is(':checked')) {
      framesShown = frames;
      resultAreaTimestamp.text('');
    } else {
      var time = videoArea[0].currentTime;
      resultAreaTimestamp.text("Timestamp: "+time.toFixed(2));
      for (var i=0; i<frames.length; i++) {
        if(frames[i]['timestamp']<=time) {
          framesShown = frames[i]['data']; //frames.slice(0,i);
        }
      }
    }
    resultArea.val(JSON.stringify(framesShown, undefined, 2));
    // resultArea.animate({scrollTop:resultArea[0].scrollHeight - resultArea.height()},500);
  };
  resultsInterval = window.setInterval(refreshResults, 300);
  hideWait(selectedAlgo);
  resizeResultAreas();
  window.setTimeout(function() {
    playVideo('#results-algo video');
    resizeResultAreas();
  },500);
};

/**
 * reveal resultant Sequence (if available)
 * @param selectedAlgo display name of the algo which was run
 * @param outputFile data URI of metadata file
 */
var showSequenceResults = function(selectedAlgo,outputFile) {
  $('#results-sequence .result-output').html('<b>Building Timeline...</b>');
  if(algorithmTemplates.videoTagSequencer[selectedAlgo]) {
    $('#results-sequence').removeClass('hidden');
    var sequenceInput=algorithmTemplates.videoTagSequencer[selectedAlgo];
    sequenceInput.source=outputFile;
    algoClient.algo(algorithms.VideoTagSequencer).pipe(sequenceInput).then(function(output2) {
      var sequenceHtml = null;
      if(output2.error) {
        sequenceHtml = output2.error;
      } else  if (output2.result.length) {
        sequenceHtml = generateSequenceHtml(output2.result);
        showTimeline(output2.result);
      } else {
        sequenceHtml = '<i>(no results above '+algorithmTemplates.videoTagSequencer[selectedAlgo].minimum_confidence+' confidence for at least '+algorithmTemplates.videoTagSequencer[selectedAlgo].minimum_sequence_length+' frames)</i>';
      }
      $('#results-sequence .result-output').html(sequenceHtml);
      $('#results-sequence').removeClass('hidden');
    });
  } else {
    $('#results-sequence').addClass('hidden');
  }
};

/**
 * build html view of VideoTagSequencer results
 * @param sequencerResults
 * @return {string}
 */
function generateSequenceHtml(sequencerResults) {
  var html = '<table class="table table-hover">';
  for (var i in sequencerResults) {
    html += '<tr><td>';
    var s = sequencerResults[i];
    for (var j in s.tag) {
      html += j + ': ' + s.tag[j] + '</br>';
    }
    html += '</td><td><nobr>';
    for (var k in s.sequences) {
      var start = round2d(s.sequences[k].start_time);
      var end = round2d(s.sequences[k].stop_time);
      html += '<a onclick="jumpToVideo(' + start + ')">' + start + '</a> - ';
      html += '<a onclick="jumpToVideo(' + end + ')">' + end + '</a>s<br/>';
    }
    html += '</nobr></td></tr>';
  }
  return html + '</table>';
}

/**
 * render timeline.js for VideoTagSequencer results
 * @param sequencerResults
 */
var showTimeline = function(sequencerResults) {
  var events = [];
  for (var i in sequencerResults) {
    var s = sequencerResults[i];
    for (var j in s.tag) {
      for (var k in s.sequences) {
        var event = {
          text:{
            text: '<a onclick="jumpToVideo(' + s.sequences[k].start_time + ')">' + s.tag[j] +'</a>'
          }
        };
        event.start_date = {
          year: Math.floor(s.sequences[k].start_time)
        };
        event.end_date = {
          year: Math.floor(s.sequences[k].stop_time)
        };
        events.push(event);
      }
    }
  }
  window.timeline = new TL.Timeline(
    'timeline-embed',
    {events: events},
    {
      scale: 'cosmological',
      start_at_end: true,
      hash_bookmark: false,
      zoom_sequence: [0.5]
    }
  );
  var fixTimelineDisplay = function() {
    window.timeline.setZoom(0);
    window.timeline.updateDisplay();
    ['BCE','Jan.','Feb.','March','April','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec'].forEach(function(txt) {
      $('.tl-timeaxis span:contains("'+txt+'")').empty();
    });
  };
  window.setTimeout(fixTimelineDisplay,500);
  window.setTimeout(fixTimelineDisplay,1000);
  window.addEventListener('resize', fixTimelineDisplay);
};

/**
 * two-digit rounding
 * @param n
 * @return {number}
 */
var round2d = function(n) {
  return Math.round(n*100)/100.0;
};

/**
 * jump the video to a specified timepoint
 * @param time
 */
var jumpToVideo = function(time) {
  $('#results-algo .result-input')[0].currentTime=time;
};

/**
 * show overlay, clear results
 */
var showWait = function(algorithm) {
  $('.dots-text').text(algorithmsUserSelectable[algorithm].displaytext);
  $('#overlay').removeClass('hidden');
  $('#status-label').empty();
  $('#results-algo .result-input').removeAttr('src');
  $('#results-algo .result-output').removeAttr('src');
  $('#results-algo .result-link').removeAttr('href');
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
    $('#results-algo').removeClass('hidden');
    $('html, body').animate({
      scrollTop: $('#results-algo').offset().top
    }, 1000);
  }
};