// clouds https://images.unsplash.com/16/unsplash_525a7e89953d1_1.JPG
// hills https://images.unsplash.com/29/cloudy-hills.jpg
// rock https://images.unsplash.com/reserve/yZfr4jmxQyuaE132MWZm_stagnes.jpg
// paris https://images.unsplash.com/33/YOfYx7zhTvYBGYs6g83s_IMG_8643.jpg

window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = "sim4m8jnVOF3086ujBXdiYteIS01";
var numTasks = 0;

function callAlgorithm() {
  var statusLabel = document.getElementById("status-label");
  statusLabel.innerHTML = "";

  // Get the search query URL
  var query = document.getElementById("search-query").value.trim();

  if(typeof(query) == "string" && query !== "") {
    startTask();
    search(query);
  }

};

function search(query) {
  console.log("Searching for tag", query);

  // renderSearchResults([
  //   {title: "Deadmau5 - Ghosts N Stuff", videoId: "3Gb3faOzvBk", firstFrame: 10, lastFrame: 100},
  //   {title: "Sean Mackey - Discover", videoId: "Ts2I4ffd4p8", firstFrame: 20, lastFrame: 200}
  // ]);
  // finishTask();

  var algoInput = {
    "collections": ["s3+madeByJames://video-processing1/json"],
    "keyword": query,
    "minConfidence": 0.10
  };
  Algorithmia.client(Algorithmia.api_key)
    .algo("algo://algorithmiahq/VideoClassificationDemo/0.5.5")
    .pipe(algoInput)
    .then(function(output) {
      if(output.error) {
        // Error Handling
        var statusLabel = document.getElementById("status-label")
        statusLabel.innerHTML = '<div class="alert alert-danger" role="alert">Uh Oh! Something went wrong: ' + output.error.message + ' </div>';
        taskError();
      } else {
        console.log("got output", output.result);

        // Render search results
        try {
          renderSearchResults(output.result);
        } catch(e) {
          console.log("error rendering", e);
        }
        finishTask();
      }
    });
}

function renderSearchResults(results) {
  console.log("renderSearchResults", results);
  var output = document.getElementById("search-results");
  output.innerHTML = "";
  for(var i = 0; i < results.length; i++) {
    var doc = results[i];
    console.log("renderSearchResults doc", doc);
    var li = document.createElement("li");

    var thumb = document.createElement("img");
    thumb.src = "http://img.youtube.com/vi/" + doc.videoId + "/0.jpg"
    thumb.classList.add("thumb")

    var info = document.createElement("div");
    info.classList.add("video-info");

    // Main youtube link
    var link = document.createElement("a");
    link.innerText = doc.title;
    link.onclick = jumpToVideo(doc, 0);
    var linkDiv = document.createElement("div");
    linkDiv.classList.add("video-title");
    linkDiv.appendChild(link);
    info.appendChild(linkDiv);

    // Stats and metadata
    var linkFirst = document.createElement("a");
    linkFirst.innerText = formatTime(doc.startFrame);
    linkFirst.onclick = jumpToVideo(doc, doc.startFrame);
    var linkLast = document.createElement("a");
    linkLast.innerText = formatTime(doc.stopFrame);
    linkLast.onclick = jumpToVideo(doc, doc.stopFrame);

    info.appendChild(document.createTextNode("Appearance: "));
    info.appendChild(linkFirst);
    info.appendChild(document.createTextNode(" - "));
    info.appendChild(linkLast);
    // info.appendChild(document.createTextNode(")"));

    // Score
    var scoreDiv = document.createElement("div");
    scoreDiv.appendChild(document.createTextNode("Score: " + doc.avgConfidence.toFixed(3)));
    info.appendChild(scoreDiv);

    li.appendChild(thumb);
    li.appendChild(info);
    output.appendChild(li);
  }
}

function formatTime(seconds) {
  var mod60 = Math.floor(seconds % 60);
  if (mod60 < 10) {
    mod60 = "0" + mod60;
  }
  return Math.floor(seconds / 60) + ":" + mod60;
}

function jumpToVideo(doc, time) {
  return function() {
    console.log("Jumping to " + doc.title + " @ " + time);
    player.loadVideoById(doc.videoId);
    player.seekTo(time);
    player.playVideo();
  };
}

function startTask() {
  numTasks++;
  document.getElementById("overlay").classList.remove("hidden");
}

function finishTask() {
  numTasks--;
  if(numTasks <= 0) {
    document.getElementById("overlay").classList.add("hidden");
    document.getElementById("explainer").classList.add("hidden");
    document.getElementById("results").classList.remove("hidden");
  }
}

function taskError() {
  numTasks = 0;
  document.getElementById("overlay").classList.add("hidden");
  document.getElementById("explainer").classList.add("display");
  document.getElementById("explainer").classList.remove("hidden");
  document.getElementById("results").classList.add("hidden");
}

document.getElementById("search-form").onsubmit = function(e) {
  console.log("onsubmit");
  e.preventDefault();
  callAlgorithm();
  return false;
}


window.player = null;

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
  console.log("YT ready");
  player = new YT.Player('player', {
    // height: '390',
    // width: '640',
    // videoId: '3Gb3faOzvBk',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  console.log("player ready");
  // event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
  // if (event.data == YT.PlayerState.PLAYING &&) {
  //   setTimeout(stopVideo, 6000);
  // }
}
