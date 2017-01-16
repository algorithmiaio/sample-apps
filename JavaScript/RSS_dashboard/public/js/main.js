window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = 'simeyUbLXQ/R8Qga/3ZCRGcr2oR1';

var httpRegex = new RegExp('^(http|https)://', 'i');
var statusLabel, output;

/**
 * once DOM is ready, update vars amd set initial URL
 */
$(document).ready(function() {
  statusLabel = $('#status-label');
  output = $('#output');
  updateUrl();
});

/**
 * copy URL of RSS feed from dropdown into input text
 */
function updateUrl() {
  $('#inputStrings').val($('#urlDD :selected').val());
}

/**
 * Display error message to user; can also be used to test if error is present
 * @param error (optional) if error is not present, returns immediately (nothing will be displayed)
 * @param errorMessage (optional) message to display instead of the error itself
 * @returns {boolean} true if there was an error
 */
function displayError(error, errorMessage) {
  if(error) {
    $('#status-label').html('<span class="text-danger">' + (errorMessage?errorMessage:error) + '</span>');
  }
  return !!error;
}

/**
 * ensure that a URL begins with http(s)://
 * @param url
 * @returns {string}
 */
function prefixHttp(url) {
  return httpRegex.test(url)?url:'http://'+url;
}

/**
 * convert a sentiment score [-1 to 1] to natural language [(very) negative / (very) positive / neutral] by quintile
 * @param sentimentScore
 * @returns {string}
 */
function sentimentScoreToText(sentimentScore) {
  var sentimentType = 'neutral';
  if (sentimentScore >= 0.2) {
    sentimentType = 'positive'
  } else if (sentimentScore <= -0.2) {
    sentimentType = 'negative'
  }
  return Math.abs(sentimentScore) >= 0.4 ? 'very '+sentimentType : sentimentType;
}

/**
 * scrape the RSS feed and analyze its entries
 */
var processFeed = function() {
  output.empty();
  statusLabel.empty();
  $('#algo-spinner').removeClass('hidden');
  var feedUrl = prefixHttp($('#inputStrings').val());
  // Query RSS scraper algorithm
  Algorithmia.query('/tags/ScrapeRSS', Algorithmia.api_key, feedUrl, function(error, items) {
    $('#algo-spinner').addClass('hidden');
    if (displayError(error, 'Failed to load RSS feed; please check that it is a valid URL')) {return;}
    $('#results').removeClass('hidden');
    // process no more than 6 RSS entries
    items.slice(0,6).forEach(processFeedEntry);
  });

};

var processFeedEntry = function(entry) {
  // Create table and elements into which we will stick the results of our algorithms
  var row = $('<section><div class="row whitespace-none rss-result">'
    + '<div class="col-md-12 col-lg-9">'
    + '<p class="item-title">ARTICLE TITLE</p>'
    + '<h4 class="result"><a href="' + entry.url + '">' + entry.title + '</a></h4>'
    + '<p class="item-title">GENERATED SUMMARY</p>'
    + '<p class="summary"><span class="aspinner"></span></p>'
    + '<p class="item-title">GENERATED TAGS</p>'
    + '<div class="tags"><span class="aspinner"></span></div>'
    + '<p class="item-title">SENTIMENT ANALYSIS</p>'
    + '<div class="sentiment"><span class="aspinner"></span></div>'
    + '</div></section>');
  output.append(row);
  // fetch text from the page to which this entry points, and extract summary, tags, and sentiment
  Algorithmia.query('/util/Html2Text', Algorithmia.api_key, entry.url, function (error, text) {
    if (displayError(error, 'Error fetching ' + entry.url + ': ' + error)) {
      return;
    }
    summarizeFeedEntry(text, row.find('.summary:first'));
    autotagFeedEntry(text, row.find('.tags:first'));
    sentimentAnalyzeFeedEntry(text, row.find('.sentiment:first'));
  });
};

function summarizeFeedEntry(itemText, summaryElement) {
  // Query summarizer analysis
  Algorithmia.query('/nlp/Summarizer', Algorithmia.api_key, itemText, function(error, summaryText) {
    if(displayError(error)) {return;}
    summaryElement.text(summaryText);
  });
}

function autotagFeedEntry(itemText, tagsElement) {
  var topicLabels = [];
  itemText = typeof(itemText)=='string'? itemText.split('\n') : [];
  // Query autotag analysis
  Algorithmia.query('/nlp/AutoTag', Algorithmia.api_key, itemText, function(error, topics) {
    if(!displayError(error)) {
      for (var key in topics) {
        topicLabels.push('<span class="label label-info">' + topics[key] + '</span> ');
      }
      tagsElement.html(topicLabels.join(''));
    }
  });
}

function sentimentAnalyzeFeedEntry(itemText, sentimentElement) {
  // Query sentiment analysis
  Algorithmia.query('/nlp/SentimentAnalysis', Algorithmia.api_key, {document:itemText}, function(error, result) {
    if(displayError(error)) {return;}
    var sentimentScore = result[0].sentiment;
    sentimentElement.html('<p>'+(Math.round(sentimentScore*100))/100+' ('+sentimentScoreToText(sentimentScore)+')</p>');
  });

}