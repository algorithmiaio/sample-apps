window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = "simnxB3dwTN8kds9p6SGMpGoOJC1"
var numTasks = 0;

/**
 * once DOM is ready, update vars amd set initial URL
 */
$(document).ready(function() {
  setInviteCode('analyzeurl');
});

var callAlgorithm = function() {
  // begin tasks
  startTask();
  // Get the img URL
  var url = $("#url").val();
  // Remove any whitespace from url
  url = url.trim();

  // Validate the URL
  ValidURL(url);
};

var ValidURL = function(url) {
  if(!isValidUrl(url)) {
    // Error Handling
    $("#status-label").html('<div class="alert alert-danger" role="alert">Please enter a valid URL.</div>');
    taskError();
  } else {
    console.log("URL is valid");
    // Call algorithm
    getMeta(url);
  }
};

var getMeta = function(url){
  console.log("calling algorithm")
  Algorithmia.client(Algorithmia.api_key)
   .algo("algo://outofstep/MegaAnalyzeURL/0.1.6")
   .pipe(url)
   .then(function(output) {
      if (output.error) {
        console.log("There was an error", output.error.message);
        // Error Handling
        var statusLabel = $("#status-label");
        statusLabel.html('<div class="alert alert-danger" role="alert">' + output.error.message + ' </div>');
        taskError();
      } else {
        // Add results to page
        addMeta(output.result);
      }
   });
};

var addMeta = function(data){
  console.log("Adding Metadata");
  $("#code").text(JSON.stringify(data, null, 4));
  hljs.highlightBlock($("#code")[0]);
  $("#title").text(data.metadata.title);
  $("#thumb").attr('src', data.metadata.thumbnail);
  $("#shortsummary").text(data.metadata.summary);
  $("#longsummary").text(data.summary);
  $("#fulltext").text(data.metadata.text);
  $("#timestamp").text(data.metadata.date);
  $("#statuscode").text(data.metadata.statusCode);

  // Add URL
  var url = $("#userurl");
  url.attr('href', data.metadata.url);
  url.attr(data.metadata.url);

  // Add Sentiment Analysis
  if (data.socialsentiment){
    // console.log(data.socialsentiment[0].compound);
    var posi = (data.socialsentiment[0].positive * 100).toFixed(2);
    var negi = (data.socialsentiment[0].negative * 100).toFixed(2);
    posi = parseInt(posi,10);
    negi = parseInt(negi,10);
    var neutra = 100-(posi+negi);
    posi = posi+"%";
    neutra = neutra+"%";
    negi = negi+"%";
    $("#positive").html("<span>"+posi+" Positive</span>");
    $("#neutral").html("<span>"+neutra+" Neutral</span>");
    $("#negative").html("<span>"+negi+" Negative</span>");
  }

  // Add Tags
  var tags = $("#tags");
  for (var i in data.tags) {
    var newSpan = document.createElement('span');
    newSpan.className = "label label-primary";
    newSpan.innerHTML = i;

    var space = document.createTextNode(" ");

    tags.append(newSpan);
    tags.append(space);
  };

  // Add Links
  var links = $("#links");
  for (var i in data.links) {
    var listItem = document.createElement('li');
    var listLink = document.createElement('a');
    listLink.setAttribute('href', data.links[i]);
    listLink.innerHTML = data.links[i];

    links.append(listItem);
    listItem.append(listLink);
  };

  var createSocialSection = function(title, body) {
    $('<span class="label label-default">'+title+'<span class="badge">'+body+'</span></span>')
  };

  // Add social shares
  var shares = $("#socialshares");
  console.log(data.socialshares);
  if (data.socialshares.facebook_likes > 0) {
    createSocialSection("Facebook Likes: ", data.socialshares.facebook_likes);
  }
  if (data.socialshares.facebook_shares > 0) {
    createSocialSection("Facebook Shares: ", data.socialshares.facebook_shares);
  }
  if (data.socialshares.facebook_comments > 0) {
    createSocialSection("Facebook Comments: ", data.socialshares.facebook_comments);
  }
  if (data.socialshares.linkedIn > 0) {
    createSocialSection("LinkedIn Shares: ", data.socialshares.linkedIn);
  }
  if (data.socialshares.pinterest > 0) {
    createSocialSection("Pinterest Shares: ", data.socialshares.pinterest);
  }

  // Add images
  var imgs = $("#images");
  for (var i in data.images) {
    // Check is images are valid
    if (data.images[i].match(/\.(jpeg|jpg|gif|png|svg)$/) != null) {
      var div = document.createElement('div');
      div.className = "col-sm-4";

      var img = document.createElement('img');
      img.setAttribute('src', data.images[i]);
      img.className = "img-responsive";

      imgs.append(div);
      div.append(img);
    }
  };

  console.log(data);
  // Finish adding to DOM
  finishTask();
};

var analyzeDefault = function(url) {
	$("#url").val(url);
	callAlgorithm();
};

var startTask = function() {
  numTasks++;
  $("#overlay").removeClass("hidden");

  // Clear error messages
  $("#status-label").empty();

  // Clear contents
  $("#title").empty();
  $("#thumb").attr('src','');
  $("#shortsummary").empty();
  $("#longsummary").empty();
  $("#fulltext").empty();
  $("#timestamp").empty();
  $("#statuscode").empty();
  $("#images").empty();
  $("#socialshares").empty();
  $("#tags").empty();
  $("#links").empty();
  $("#userurl").empty();
  $("#positive").empty();
  $("#neutral").empty();
  $("#negative").empty();
};

var finishTask = function() {
  numTasks--;
  console.log(numTasks);
  if(numTasks <= 0) {
    $("#overlay").addClass("hidden");
    $("#fetch-spinner").addClass("hidden");
    $("#results").removeClass("hidden");
    // smooth scroll to results section
    $('html, body').animate({
      scrollTop: $("#resultspage").offset().top
    }, 1000);
  }
};

var taskError = function() {
  numTasks = 0;
  $("#overlay").addClass("hidden");
  $("#fetch-spinner").addClass("hidden");
  $("#results").addClass("hidden");
};
