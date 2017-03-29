// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simeyUbLXQ/R8Qga/3ZCRGcr2oR1');

var algorithms = {
  tagger: 'deeplearning/IllustrationTagger/0.2.3'
};

/**
 * once DOM is ready, update vars and add handlers
 */
$(document).ready(function() {
  setInviteCode('imagetags');
  requireHttp($('#imgUrl'));
  initDropzone();
});

/**
 * call API on URL, get up to 7 results, and display them
 * @param url
 */
var getInfo = function(url) {
  if(url) {
    $('#imgUrl').val(url.indexOf('http')==0?url:''); //only display http URLs
  } else {
    url = $('#imgUrl').val();
  }
  if(url == "" || url=="http://") {
    return hideWait('Please select an image, click the upload link, or enter a URL');
  }
  showWait();
  var input = {
    "image": url,
    "numResults": 7
  };
  $('#userImg').attr('src',url);
  algoClient.algo(algorithms.tagger).pipe(input).then(function (output) {
    if (output.error) {
      endWait(output.error.message);
    } else {
      showResults(output.result);
      endWait();
    }
  });
};
/**
 * render tags and probabilities into
 * @param tags [{"class":string,"prob":number}]
 */
var showResults = function(result){
console.log(result)
  $('#results-tbody').html(
    tags2html(result.rating, 0.2, 'rating: ')
    + tags2html(result.character, 0.1, 'character: ')
    + tags2html(result.general, 0.23)
  );
  hideWait();
};

/**
 * generate HTML to display provided tags
 * @param tags tag/probability pairs
 * @param threshold 0-1 probability above which tag should be shown
 * @param prefix (optional) string to prepend to each tag
 * @returns {string}
 */
function tags2html(tags, threshold, prefix) {
  var html = '';
  for (var i = 0; i < tags.length; i++) {
    Object.keys(tags[i]).forEach(function (key) {
      var prob = tags[i][key];
      if(prob>threshold) {
        var tag = (prefix || '') + key.replace(/_/g, ' ');
        html += '<tr><td><span class="label label-success">' + tag + '</span></td><td>' + (prob * 100).toFixed(2) + '%</td></tr>';
      }
    });
  }
  return html;
}

/**
 * show overlay, clear results
 */
var showWait = function() {
  $('#overlay').removeClass('hidden');
  $('#status-label').empty();
  $("#results-tbody").empty();
  $('#userImg').removeAttr('src');
};


/**
 * close overlay and either reveal results or display errorMessage
 * @param errorMessage
 */
var hideWait = function(errorMessage) {
  $("#overlay").addClass("hidden");
  if(errorMessage) {
    $('#status-label').html('<div class="alert alert-danger" role="alert">' + errorMessage+ '</div>');
    $('#results').addClass('hidden');
  } else {
    $('#results').removeClass('hidden');
    $('html, body').animate({
      scrollTop: $("#results").offset().top
    }, 1000);
  }
};

/**
 * initialize Dropzone component
 */
var initDropzone = function() {
  window.Dropzone.autoDiscover = false;
  var dropzone = new Dropzone("#file-dropzone", {
    url: 'javascript:;',
    options: {sending: function() {}},
    acceptedFiles: "image/*",
    previewTemplate: "<div></div>",
    maxFilesize: 10,
    filesizeBase: 1024,
    createImageThumbnails: false,
    clickable: true
  });
  dropzone.__proto__.cancelUpload = function() {};
  dropzone.__proto__.uploadFile = function() {};
  dropzone.__proto__.uploadFiles = function() {};
  dropzone.on("processing", function(file) {
    showWait();
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      getInfo(reader.result);
      dropzone.removeFile(file);
    }, false);
    reader.readAsDataURL(file);
  });
  dropzone.on("error", function(file, err) {
    dropzone.removeFile(file);
    endWait(err);
  });
};