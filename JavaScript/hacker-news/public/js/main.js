// this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
var client = Algorithmia.client('sim3fGsmXfk6P0o1Kx8rzo2ZmAf1');

function scrape() {
  document.getElementById("output").innerHTML = "";
  document.getElementById("errors").innerHTML = "";

  // Query HackerNews scraper
  client.algo("/tags/ScrapeHN?redis=1").pipe([]).then(function(result) {
    // Print debug output
    if(result.error) {
      document.getElementById("errors").innerHTML = '<span class="text-danger">' + error + '</span>';
      return;
    }
    var items = result.result;
    console.log("items", items);

    var output = document.getElementById("output");

    // TRIM ITEMS
    // items.length = 20;

    // Query autotagger for each url
    for(var i in items) {

      // Create closure to capture item
      (function() {
        var index = i;
        var item = items[i];

        // Add to table
        var row = document.createElement("tr");
        output.appendChild(row);
        row.innerHTML += '<td>' + (Number(index) + 1) + '.</td>';
        row.innerHTML += '<td>';
        row.innerHTML += '<div><a href="' + item.url + '">' + item.title + '</a></div>';
        row.innerHTML += '<div class="subtext"><a href="' + item.comments + '">comments</a></div>';
        row.innerHTML += '</td>';

        // console.log("item", item);

        client.algo("/tags/AutoTagURL?redis=1").pipe(item.url).then(function(result) {
          // Print debug output
          if(result.error) {
            document.getElementById("errors").innerHTML = '<span class="text-danger">' + error + '</span>';
            return;
          }

          var tags = result.result;
          if(tags) {

            topics = Object.keys(tags);

            var topicLabels = [];
            for(var key in topics) {
               topicLabels.push(' <span class="label">' + topics[key] + '</span> ');
            }

            row.innerHTML += '<td>' + topicLabels.join('') + '</td>';
          }

        }); // End API call
      })(); // End closure
    } // End loop
  }); // End API call
}