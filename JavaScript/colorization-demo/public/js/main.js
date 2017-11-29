// this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simhK/jp217MEKHHMtrc3aHsmSe1');

var algorithms = {
  colorize: 'algorithmiahq/ColorizationDemo/1.1.20'
};

/**
 * once DOM is ready, update vars and add handlers
 */
$(document).ready(function() {
  setInviteCode('color');
  initDropzone();
  requireHttp($('#imgUrl'));
  $('#compareLink').click(function() {
      $('#compareLink').attr('href', $('#twoface')[0].toDataURL());
  });
});

/**
 * clear status, colorize image if specified, or check #imgUrl if not
 * @param img
 */
var callAlgorithm = function(img) {
  if (img) {
    $('#imgUrl').val(img);
  } else {
    img=$('#imgUrl').val();
  }
  if(img == "" || img=="http://") {
    return hideWait('Please select an image, click the upload link, or enter a URL');
  }
  $('#status-label').empty();
  showWait();
  colorize(img);
};

/**
 * call API to colorize image
 * @param img
 */
var colorize = function(img) {
  algoClient.algo(algorithms.colorize).pipe(img).then(function(output) {
      if(output.error) {
        hideWait(output.error.message||"Unable to colorize image");
      } else {
        // Decode base64 imgs
        var imgOriginal = "data:image/png;base64," + output.result[0];
        var imgColorized = "data:image/png;base64," + output.result[1];
        // Show the download link if API also returned the URL
        if(output.result.length > 2) {
            $('#resultLink').attr('href',output.result[2]);
        } else {
            $('#resultLink').attr('href','#');
        }
        createTwoface(imgOriginal, imgColorized);
      }
    });
};

/**
 * show TwoFace demo of original vs colorized file
 * @param original
 * @param colorized
 */
var createTwoface = function(original,colorized) {
  var img = new Image();
  img.onload = function() {
    // use height and width of original image
    var twoface = TwoFace('twoface-wrapper', this.width, this.height);
    // set left and right images
    twoface.add(original);
    twoface.add(colorized);
    hideWait();
  };
  img.src = colorized;
};

/**
 * shpw overlay, clear demo
 */
var showWait = function() {
  $("#overlay").removeClass("hidden");
  $(".dots-container").removeClass("hidden");
  $('#twoface-wrapper').empty();
};

/**
 * close overlay and either reveal results or display errorMessage 
 * @param errorMessage
 */
var hideWait = function(errorMessage) {
  $("#overlay").addClass("hidden");
  $(".dots-container").addClass("hidden");
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
var initDropzone  = function() {
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
    $('#status-label').empty();
    showWait();
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      colorize(reader.result);
      dropzone.removeFile(file);
    }, false);
    reader.readAsDataURL(file);
  });
  dropzone.on("error", function(file, err) {
    dropzone.removeFile(file);
    hideWait(err);
  });
};
