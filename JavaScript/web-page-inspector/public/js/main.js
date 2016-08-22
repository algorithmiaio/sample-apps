window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = "simnxB3dwTN8kds9p6SGMpGoOJC1"
var numTasks = 0;

function callAlgorithm() {
  // begin taks
  startTask();
  // Get the img URL
  var url = document.getElementById("url").value;
  // Remove any whitespace from url
  url = url.trim();

  // Validate the URL
  ValidURL(url);
};

function ValidURL(url) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'); // port and path
  // '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  // '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  if(!pattern.test(url)) {
    // Error Handling
    var statusLabel = document.getElementById("status-label")
    statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh Oh! Please enter a valid URL.</div>';
    taskError();
  } else {
    console.log("URL is valid");
    // Call algorithm
    getMeta(url);
  }
}

function getMeta(url){
  console.log("calling algorithm")
  Algorithmia.client(Algorithmia.api_key)
   .algo("algo://outofstep/MegaAnalyzeURL/0.1.5")
   .pipe(url)
   .then(function(output) {
      if (output.error) {
        console.log("There was an error", output.error.message);
        // Error Handling
        var statusLabel = document.getElementById("status-label")
        statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh Oh! Something went wrong: ' + output.error.message + ' </div>';
        taskError();
      } else {
        console.log("Adding Metadata");
        // Add results to page
        addMeta(output.result);
      }
   });
};

function addMeta(data){
  console.log("Adding Metadata");
  document.getElementById("code").textContent = JSON.stringify(data, null, 4);
  hljs.highlightBlock(document.getElementById("code"));
  document.getElementById("title").textContent = data.metadata.title;
  document.getElementById("thumb").src = data.metadata.thumbnail;
  document.getElementById("shortsummary").textContent = data.metadata.summary;
  document.getElementById("longsummary").textContent = data.summary;
  document.getElementById("fulltext").textContent = data.metadata.text;
  document.getElementById("timestamp").textContent = data.metadata.date;
  document.getElementById("statuscode").textContent = data.metadata.statusCode;

// Add URL
  var url = document.getElementById("userurl")
  url.setAttribute('href', data.metadata.url);
  url.innerHTML = data.metadata.url;

// Add Sentiment Analysis
  if (data.socialsentiment){
    var posi = (data.socialsentiment[0].positive * 100).toFixed(2);
    var neutra = (data.socialsentiment[0].neutral * 100).toFixed(2);
    var negi = (data.socialsentiment[0].negative * 100).toFixed(2);
    posi = posi+"%";
    neutra = neutra+"%";
    negi = negi+"%";
    document.getElementById("positive").innerHTML = "<div class=\"progress-bar progress-bar-success\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "+posi+"\">"+posi+" Positive</div>";
    document.getElementById("neutral").innerHTML = "<div class=\"progress-bar progress-bar-warning\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "+neutra+"\">"+neutra+" Neutral</div>";
    document.getElementById("negative").innerHTML = "<div class=\"progress-bar progress-bar-danger\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "+negi+"\">"+negi+" Negative</div>";
  } 

// Add Tags
  var tags = document.getElementById("tags")
  for (var i in data.tags) {
    var newSpan = document.createElement('span');
    newSpan.className = "label label-default";
    newSpan.innerHTML = i;
    
    var space = document.createTextNode(" ");
    
    tags.appendChild(newSpan);     
    tags.appendChild(space);
  };

// Add Links
  var links = document.getElementById("links");
  for (var i in data.links) {
    var listItem = document.createElement('li');
    var listLink = document.createElement('a');
    listLink.setAttribute('href', data.links[i]);
    listLink.innerHTML = data.links[i];
        
    links.appendChild(listItem);     
    listItem.appendChild(listLink);
  };

// Add social shares
  var shares = document.getElementById("socialshares");
  if (data.socialshares.facebook_likes > 0) {
    var span = document.createElement('span');
    span.className = "label label-default";
    span.textContent = "Facebook Likes: ";

    var innerSpan = document.createElement('span');
    innerSpan.className = "badge";
    innerSpan.innerHTML = data.socialshares.facebook_likes;
    
    var space = document.createTextNode(" ");

    span.appendChild(innerSpan);
    shares.appendChild(span);
    shares.appendChild(space);
  }

  if (data.socialshares.facebook_shares > 0) {
    var span = document.createElement('span');
    span.className = "label label-default";
    span.textContent = "Facebook Shares: ";

    var innerSpan = document.createElement('span');
    innerSpan.className = "badge";
    innerSpan.innerHTML = data.socialshares.facebook_shares;
    
    var space = document.createTextNode(" ");

    span.appendChild(innerSpan);
    shares.appendChild(span);
    shares.appendChild(space);
  }

  if (data.socialshares.facebook_comments > 0) {
    var span = document.createElement('span');
    span.className = "label label-default";
    span.textContent = "Facebook Comments: ";

    var innerSpan = document.createElement('span');
    innerSpan.className = "badge";
    innerSpan.innerHTML = data.socialshares.facebook_comments;
    
    var space = document.createTextNode(" ");

    span.appendChild(innerSpan);
    shares.appendChild(span);
    shares.appendChild(space);
  }

  if (data.socialshares.linkedIn > 0) {
    var span = document.createElement('span');
    span.className = "label label-default";
    span.textContent = "LinkedIn Shares: ";

    var innerSpan = document.createElement('span');
    innerSpan.className = "badge";
    innerSpan.innerHTML = data.socialshares.linkedIn;
    
    var space = document.createTextNode(" ");

    span.appendChild(innerSpan);
    shares.appendChild(span);
    shares.appendChild(space);
  }

  if (data.socialshares.pinterest > 0) {
    var span = document.createElement('span');
    span.className = "label label-default";
    span.textContent = "Pinterest Shares: ";

    var innerSpan = document.createElement('span');
    innerSpan.className = "badge";
    innerSpan.innerHTML = data.socialshares.pinterest;
    
    var space = document.createTextNode(" ");

    span.appendChild(innerSpan);
    shares.appendChild(span);
    shares.appendChild(space);
  }

// Add images
  var imgs = document.getElementById("images");
  for (var i in data.images) {
    // Check is images are valid
    if (data.images[i].match(/\.(jpeg|jpg|gif|png|svg)$/) != null) {
      var div = document.createElement('div');
      div.className = "col-md-3";

      var img = document.createElement('img');
      img.setAttribute('src', data.images[i]);
      img.className = "center-block thumbnail img-responsive";

      imgs.appendChild(div);
      div.appendChild(img);
    }
  };

  console.log(data);
  // Finish adding to DOM
  finishTask();
};

function analyzeDefault(url) {
	document.getElementById("url").value = url;
	callAlgorithm();
}

function startTask() {
  numTasks++;
  document.getElementById("overlay").classList.remove("hidden");

  // Clear error messages
  var statusLabel = document.getElementById("status-label")
  statusLabel.innerHTML = "";
  
  // Clear contents
  document.getElementById("title").textContent = " ";
  document.getElementById("thumb").src = " ";
  document.getElementById("shortsummary").textContent = " ";
  document.getElementById("longsummary").textContent = " ";
  document.getElementById("fulltext").textContent = " ";
  document.getElementById("timestamp").textContent = " ";
  document.getElementById("statuscode").textContent = " ";
  document.getElementById("images").innerHTML = " ";
  document.getElementById("socialshares").innerHTML = " ";
  document.getElementById("tags").innerHTML = " ";
  document.getElementById("links").innerHTML = " ";
  document.getElementById("userurl").innerHTML = " ";
  document.getElementById("positive").innerHTML = " ";
  document.getElementById("neutral").innerHTML = " ";
  document.getElementById("negative").innerHTML = " ";
};

function finishTask() {
  numTasks--;
  if(numTasks <= 0) {
    document.getElementById("overlay").classList.add("hidden");
    document.getElementById("results").classList.remove("hidden");
  }
};

function taskError() {
  numTasks = 0;
  document.getElementById("overlay").classList.add("hidden");
  document.getElementById("results").classList.add("hidden");
};
