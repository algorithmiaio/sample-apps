var topics = [];

// this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
var apiKey = 'sim+m8/xp0+/xKjzpBOd0cM/fzh1'

// Choose random dropdown option on load
var dropdown = document.getElementById("urlDD");
dropdown.selectedIndex = 1 + Math.floor(Math.random() * (dropdown.options.length - 1));
updateDropdown();
analyze();

function analyze() {
  document.getElementById("demo-status").innerHTML = "";
  document.getElementById("input").innerHTML = "";
  document.getElementById("output").innerHTML = "";
  document.getElementById("inputTags").innerHTML = "";

  // Build instance
  var username = document.getElementById("username").value;
  var reponame = document.getElementById("reponame").value;

  if(username && reponame) {
    var algorithmInput = [username, reponame];

    document.getElementById("input").innerHTML = "/" + username + "/" + reponame;
    showSpinner();

    // Query recommender
    Algorithmia.query("/tags/AutoTagGithub", apiKey, algorithmInput, function(error1, tags) {
      // Print debug output
      if(error1) {
        document.getElementById("demo-status").innerHTML = '<span class="text-danger">' + error1 + '</span>';
        hideSpinner();
        return;
      }
      if(tags === null) {
        // Repo not found
        document.getElementById("output").innerHTML = "Repository not found. Please choose a public git repository with a README.";
        hideSpinner();
      } else if(!tags) {
        // No recommendations found
        document.getElementById("output").innerHTML = "Insufficient README data, or no similar repos found.";
        hideSpinner();
      } else {
        // Tags generated, render tags
        var topicLabels = [];
        for(var tag in tags) {
          topicLabels.push('<span class="label label-info">' + tag + '</span> ');
        }
        document.getElementById("inputTags").innerHTML = topicLabels.join('');

        // Query recommender...
        Algorithmia.query("/tags/RecommendGitHubFromTags", apiKey, tags, function(error2, repos) {
          hideSpinner();
          // Print debug output
          if(error2) {
            document.getElementById("demo-status").innerHTML = '<span class="text-danger">' + error2 + '</span>';
            return;
          }
          var repoLabels = [];
          for(var i in repos) {
            var repo = repos[i];
            repoLabels.push('<li><a href="http://github.com' + repo + '" target="_blank"><i class="fa fa-git"></i> ' + repo + '</a>');
          }
          document.getElementById("output").innerHTML = repoLabels.join('');

        });
      }
    });
  } else {
    document.getElementById("demo-status").innerHTML = '<span class="text-danger">Please enter a public github repository</span>';
  }
};

function updateDropdown() {
  var e = document.getElementById("urlDD");
  var repo_url = e.options[e.selectedIndex].value;
  var username = repo_url.split("/")[1];
  var reponame = repo_url.split("/")[2];

  document.getElementById("username").value = username;
  document.getElementById("reponame").value = reponame;

  // GO!
  analyze();
}

function showSpinner() {
  document.getElementById("algo-spinner").classList.remove("hidden");
}
function hideSpinner() {
  document.getElementById("algo-spinner").classList.add("hidden");
}
