window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = "simeyUbLXQ/R8Qga/3ZCRGcr2oR1"

function updateUrl() {

  var dropDown = document.getElementById("urlDD");
  var usrSel = dropDown.options[dropDown.selectedIndex].value;

  document.getElementById("inputStrings").value = usrSel;
}

function analyze() {

  var output = document.getElementById("output");
  var statusLabel = document.getElementById("status-label");

  statusLabel.innerHTML = "";
  document.getElementById("algo-spinner").classList.remove("hidden");

  // Get the URL of the feed
  var inputUrl = document.getElementById("inputStrings").value;

  // Clear table to prep for new data
  output.innerHTML = "";
  statusLabel.innerHTML = "";

  // Query RSS scraper algorithm
    Algorithmia.query("/tags/ScrapeRSS", Algorithmia.api_key, inputUrl, function(error, items) {
      document.getElementById("algo-spinner").classList.add("hidden");
      // Print debug output
      if(error) {
        statusLabel.innerHTML = '<span class="text-danger">Failed to load RSS feed (' + error + ')</span>';
        return;
      }

      // Trim items
      items.length = 6;
      
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

            if(error) {
              statusLabel.innerHTML = '<span class="text-danger">Error fetching ' + itemUrl + '</span>';
              return;
            }

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

      if(error) {
        statusLabel.innerHTML = '<span class="text-danger">' + error + '</span>';
        return;
      }

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

      if(error) {
        statusLabel.innerHTML = '<span class="text-danger">' + error + '</span>';
        return;
      }

      for (var key in topics) {
         topicLabels.push('<span class="label label-info">' + topics[key] + '</span> ');
      }

      tagsElement.innerHTML = topicLabels.join('');
    });
  }


function sentiment(itemText, sentimentElement) {

  var smileys = [
    '<i class="fa fa-frown-o"></i>',
    '<i class="fa fa-frown-o"></i>',
    '<i class="fa fa-meh-o"></i>',
    '<i class="fa fa-smile-o"></i>',
    '<i class="fa fa-smile-o"></i>'
  ];

  // Query sentiment analysis
  Algorithmia.query("/nlp/SentimentAnalysis", Algorithmia.api_key, {document:itemText}, function(error, result) {

    if(error) {
      statusLabel.innerHTML = '<span class="text-danger">' + error + '</span>';
      return;
    }

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