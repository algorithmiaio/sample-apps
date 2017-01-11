window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = "YOUR_API_KEY"

function updateUrl() {

  var dropDown = document.getElementById("urlDD");
  var usrSel = dropDown.options[dropDown.selectedIndex].value;

  document.getElementById("inputStrings").value = usrSel;
}

function analyze() {

  var output = document.getElementById("output");
  var statusLabel = document.getElementById("status-label")

  statusLabel.innerHTML = "";
  startTask();

  // Get the URL of the feed
  var inputUrl = document.getElementById("inputStrings").value;

  // Clear table to prep for new data
  output.innerHTML = "";
  statusLabel.innerHTML = "";

  // Query RSS scraper algorithm
    Algorithmia.query("/tags/ScrapeRSS", Algorithmia.api_key, inputUrl, function(error, items) {
      finishTask();
      // Print debug output
      if(error) {
        statusLabel.innerHTML = '<span class="text-danger">Failed to load RSS feed (' + error + ')</span>';
        return;
      }

      // Trim items
      items.length = 6;
      
      // Iterate over each item returned from ScrapeRSS
      for(var i in items) {
        startTask();

        // Create closure to capture item
        (function() {
          var index = i;
          var item = items[i];
          var itemUrl = item.url

          // Create table and elements into which we will stick the results of our algorithms
          var row = document.createElement("tr");
          output.appendChild(row);
          var itemHTML = '<td>' + (Number(index) + 1) + '.&nbsp;</td>';
          itemHTML += '<td>';
          itemHTML += '<div><a href="' + itemUrl + '">' + item.title + '</a></div>';
          itemHTML += '<div class="summary small"></div>';
          itemHTML += '<div class="tags"></div>';
          itemHTML += '</td>';
          itemHTML += '<td class="sentiment" width="20"></td>';
          row.innerHTML += itemHTML;

          var summaryElement = row.getElementsByClassName("summary")[0];
          var tagsElement = row.getElementsByClassName("tags")[0];
          var sentimentElement = row.getElementsByClassName("sentiment")[0];

          // Use a utility algorithm to fetch page text
          Algorithmia.query("/util/Html2Text", Algorithmia.api_key, itemUrl, function(error, itemText) {
            finishTask();

            if(error) {
              statusLabel.innerHTML = '<span class="text-danger">Error fetching ' + itemUrl + '</span>';
              return;
            }

            // Run NLP algos on the links
            autotag(itemText, tagsElement);
            summarize(itemText, summaryElement);
            sentiment(itemText, sentimentElement);
          });
        })();
      }
    });
  }

// As you get results back, look up at the analyze() function to see the closure where we 
// actually generate our own HTML to stick into the browser. 
// You can put your results in one of those elements! 
// (Extra hint: consider using the tagsElement variable you see on line 62 for your autotag results!)

function autotag(itemText, tagsElement) {
// Fill me in!
// https://algorithmia.com/algorithms/nlp/AutoTag
}

function sentiment(itemText, sentimentElement) {
 // Fill me in!
 // https://algorithmia.com/algorithms/nlp/SentimentAnalysis

 // Hint: You can use Font Awesome for smilies that correlate to the value returned by this algorithm.
}

function summarize(itemText, summaryElement) {
// Fill me in!
// https://algorithmia.com/algorithms/nlp/Summarizer
}

var numTasks = 0;
function startTask() {
  numTasks++;
  document.getElementById("algo-spinner").classList.remove("hidden");
}
function finishTask() {
  numTasks--;
  if(numTasks <= 0) {
    document.getElementById("algo-spinner").classList.add("hidden");
  }
}