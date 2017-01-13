window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = "simeyUbLXQ/R8Qga/3ZCRGcr2oR1";

var httpRegex = new RegExp("^(http|https)://", "i");

/**
 * copy URL of RSS feed from dropdown into input text
 */
function updateUrl() {
  var dropDown = document.getElementById("urlDD");
  document.getElementById("inputStrings").value = dropDown.options[dropDown.selectedIndex].value;
}

/**
 * Display error message to user; can also be used to test if error is present
 * @param error (optional) if error is not present, returns immediately (nothing will be displayed)
 * @param errorMessage (optional) message to display instead of the error itself
 * @returns {boolean} true if there was an error
 */
function displayError(error, errorMessage) {
  if(error) {
    document.getElementById("status-label").innerHTML = '<span class="text-danger">' + (errorMessage?errorMessage:error) + '</span>';
  }
  return !!error;
}

/**
 * ensure that a URL begins with http(s)://
 * @param url
 * @returns {string}
 */
function prefixHttp(url) {
  return httpRegex.test(url)?url:'http://'+inputUrl;
}

function analyze() {

  var statusLabel = document.getElementById("status-label");
  var output = document.getElementById("output");

  statusLabel.innerHTML = "";
  document.getElementById("algo-spinner").classList.remove("hidden");

  // Get the URL of the feed
  var inputUrl = prefixHttp(document.getElementById("inputStrings").value);

  // Clear table to prep for new data
  output.innerHTML = "";
  statusLabel.innerHTML = "";

  // Query RSS scraper algorithm
  Algorithmia.query("/tags/ScrapeRSS", Algorithmia.api_key, inputUrl, function(error, items) {
    document.getElementById("algo-spinner").classList.add("hidden");
    // Print debug output
    if(displayError(error, 'Failed to load RSS feed; please check that it is a valid URL')) {return;}
    document.getElementById("results").classList.remove("hidden");

    // Trim items
    items.length = Math.min(items.length,6);

    // Iterate over each item returned from ScrapeRSS
    for(var i in items) {

      // Create closure to capture item
      (function() {
        var index = i;
        var item = items[i];
        var itemUrl = item.url

        // Create table and elements into which we will stick the results of our algorithms
        var row = document.createElement("section");
        output.appendChild(row);
        var itemHTML = '<div class="row whitespace-none rss-result">';
        itemHTML += '<div class="col-md-12 col-lg-9">';
        itemHTML += '<p class="item-title">ARTICLE TITLE</p>';
        itemHTML += '<h4 class="result"><a href="' + itemUrl + '">' + item.title + '</a></h4>';
        itemHTML += '<p class="item-title">GENERATED SUMMARY</p>';
        itemHTML += '<p class="summary"><span class="aspinner"></span></p>';
        itemHTML += '<p class="item-title">GENERATED TAGS</p>';
        itemHTML += '<div class="tags"><span class="aspinner"></span></div>';
        itemHTML += '<p class="item-title">SENTIMENT ANALYSIS</p>';
        itemHTML += '<div class="sentiment"><span class="aspinner"></span></div>';
        itemHTML += '</div>';
        row.innerHTML += itemHTML;

        var summaryElement = row.getElementsByClassName("summary")[0];
        var tagsElement = row.getElementsByClassName("tags")[0];
        var sentimentElement = row.getElementsByClassName("sentiment")[0];

        // Use a utility algorithm to fetch page text
        Algorithmia.query("/util/Html2Text", Algorithmia.api_key, itemUrl, function(error, itemText) {
          if(displayError(error, 'Error fetching ' + itemUrl +': '+error)) {return;}
          // Run NLP algos on the links
          summarize(itemText, summaryElement);
          autotag(itemText, tagsElement);
          sentiment(itemText, sentimentElement);
        });
      })();
    }
  });
}

function summarize(itemText, summaryElement) {
  // Query summarizer analysis
  Algorithmia.query("/nlp/Summarizer", Algorithmia.api_key, itemText, function(error, summaryText) {
    if(displayError(error)) {return;}
    summaryElement.textContent = summaryText;
  });
}

function autotag(itemText, tagsElement) {

  var topics = [];
  var topicLabels = [];

  if(typeof(itemText) == "string") {
    itemText = itemText.split("\n");
  } else {
    itemText = [];
  }

  // Query autotag analysis
  Algorithmia.query("/nlp/AutoTag", Algorithmia.api_key, itemText, function(error, topics) {
    if(!displayError(error)) {
      for (var key in topics) {
        topicLabels.push('<span class="label label-info">' + topics[key] + '</span> ');
      }
      tagsElement.innerHTML = topicLabels.join('');
    }
  });
}

function sentiment(itemText, sentimentElement) {

  // Query sentiment analysis
  Algorithmia.query("/nlp/SentimentAnalysis", Algorithmia.api_key, {document:itemText}, function(error, result) {

    if(displayError(error)) {return;}

    var sentimentScore = result[0].sentiment;

    var sentimentType = 'neutral';
    if (sentimentScore>=0.2) {
      sentimentType = 'positive'
    } else if (sentimentScore<=-0.2) {
      sentimentType = 'negative'
    }
    var sentimentStrength = Math.abs(sentimentScore)>=0.4?'very ':'';

    sentimentElement.innerHTML = '<p>'+(Math.round(sentimentScore*100))/100+' ('+sentimentStrength+sentimentType+')</p>';

  });

}