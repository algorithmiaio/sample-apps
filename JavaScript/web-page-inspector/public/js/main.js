// this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simnxB3dwTN8kds9p6SGMpGoOJC1');
var algorithmAutotag = 'outofstep/MegaAnalyzeURL/0.1.6';

/**
 * once DOM is ready, update vars and add handlers
 */
$(document).ready(function() {
  setInviteCode('analyzeurl');
  requireHttp($('#url'));
});

/**
 * analyze the url specified in $('#url') by calling outofstep/MegaAnalyzeURL
 * @param url (optional) url to use instead of $('#url') contents
 */
var analyzeUrl = function(url) {
  if(url) {
	  $("#url").val(url);
  } else {
    url = $("#url").val();
  }
  url = url.trim();
  showWait();
  if(isValidUrl(url)) {
    // call analysis algorithm with selected URL
    algoClient.algo(algorithmAutotag).pipe(url).then(function(output) {
      if (output.error) {
        console.log("There was an error", output.error.message);
        $("#status-label").html('<div class="alert alert-danger" role="alert">' + output.error.message + ' </div>');
        endWait();
      } else {
        // Add results to page
        showResults(output.result);
      }
     });
  } else {
    // Error Handling
    $("#status-label").html('<div class="alert alert-danger" role="alert">Please enter a valid URL.</div>');
    endWait();
  }
};

/**
 * render results HTML
 * @param data
 */
var showResults = function(data){

  // Add raw JSON response to results section
  var codeblock = $("#code");
  codeblock.text(JSON.stringify(data, null, 4));
  codeblock.each(function(i,block) {hljs.highlightBlock(block);});

  // Add simple result values
  $("#title").text(data.metadata.title);
  $("#thumb").attr('src', data.metadata.thumbnail);
  $("#shortsummary").text(data.metadata.summary);
  $("#longsummary").text(data.summary);
  $("#fulltext").text(data.metadata.text);
  $("#timestamp").text(data.metadata.date);
  $("#statuscode").text(data.metadata.statusCode);

  // Add URL
  var url = $("#userurl");
  url.text(data.metadata.url);
  url.attr('href', data.metadata.url);

  // Add Sentiment Analysis
  if (data.socialsentiment){
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

  // Add social shares
  var shares = $("#socialshares");
  if (data.socialshares.facebook_likes > 0) {
    shares.append(createSocialSection("Facebook Likes: ", data.socialshares.facebook_likes));
  }
  if (data.socialshares.facebook_shares > 0) {
    shares.append(createSocialSection("Facebook Shares: ", data.socialshares.facebook_shares));
  }
  if (data.socialshares.facebook_comments > 0) {
    shares.append(createSocialSection("Facebook Comments: ", data.socialshares.facebook_comments));
  }
  if (data.socialshares.linkedIn > 0) {
    shares.append(createSocialSection("LinkedIn Shares: ", data.socialshares.linkedIn));
  }
  if (data.socialshares.pinterest > 0) {
    shares.append(createSocialSection("Pinterest Shares: ", data.socialshares.pinterest));
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
  }

  // reveal and smooth-scroll to results section
  endWait(true);

};

/**
 * Create a social-shares section to display
 * @param title
 * @param body
 * @returns {jQuery|HTMLElement}
 */
var createSocialSection = function(title, body) {
  return $('<span class="label label-default">'+title+'<span class="badge">'+body+'</span></span>')
};

/**
 * show overlay/dots and hide button; pre-clear results
 */
var showWait = function() {
  $("#overlay").removeClass("hidden");
  $("#analyze-button-text").addClass("no-viz");
  $(".dots-container").removeClass("hidden");
  $("#results").addClass("hidden");
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

/**
 * hide overlay & dots, reveal button
 * @param showResults should the results section be revealed?
 */
var endWait = function(showResults) {
  $("#overlay").addClass("hidden");
  $("#analyze-button-text").removeClass("no-viz");
  $(".dots-container").addClass("hidden");
  if(showResults) {
    $("#results").removeClass("hidden");
    $('html, body').animate({
      scrollTop: $("#results").offset().top
    }, 1000);
  } else {
    $("#results").addClass("hidden");
  }
};
