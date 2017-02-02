// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simeyUbLXQ/R8Qga/3ZCRGcr2oR1');

var algorithms = {
  autotag: '/nlp/AutoTag/1.0.1',
  url2text: '/util/Url2Text/0.1.4',
  getlinks: '/web/GetLinks/0.1.5',
  pagerank: '/thatguy2048/PageRank/0.1.0',
  summarizer: '/nlp/Summarizer/0.1.6'
};

var colorScale = d3.scale.linear().domain([0, 0.4, 1]).range(["yellow", "red", "#5000be"]);
var graphObj = null;
var pending = [];
var depthLimit = 3;
var maxWidth = 20;
var siteMap = {};
var pageRanks = {};
var pagesDisplayed = 0;
var cleanupTimer = null;

/**
 * once DOM is ready, update vars amd set initial URL
 */
$(document).ready(function() {
  setInviteCode('sitemapper');
  $('#siteUrl').val("http://algorithmia.com/");
  $('#depthLimit').val(depthLimit).change(function(){this.value=Math.max(1,Math.min(this.value,5));});
  $('#siteUrl').change(function(){this.value=cleanUrl(this.value);});
});

/**
 * initiate site scrape
 */
var startScrape = function() {
  var url = $('#siteUrl').val();
  if(!url) {return;}
  depthLimit = $('#depthLimit').val();
  siteMap = {};
  pageRanks = {};
  pagesDisplayed = 0;
  $('#scrape-status').html('&nbsp;<span class="aspinner demo-spinner"></span>Analyzing site...');
  $('#pagerank-sorted').html('&nbsp;&nbsp;&nbsp;&nbsp;<span class="aspinner demo-spinner"></span>');
  hideLink();
  $('#results').show();
  $('a[href="#viz"]').click();
  startViz();
  enqueueRankPages();
  doScrape(1, [url]);
};

/**
 * get up to maxWidth links for each url, and recurse until depthLimit
 * @param depth
 * @param urls
 */
var doScrape = function(depth, urls) {
  for (var i in urls) {
    var url = urls[i];
    if (!siteMap[url]) {
      algoClient.algo(algorithms.getlinks).pipe([url, true]).then(function (output) {
        if (output.error) {
          //fail silently while recursing
          if(depth<=1) {showError(output.error);}
          console.error(output)
        } else {
          if (depth > depthLimit) {
            enqueueRankPages();
          } else if(!siteMap[url]) {
            //recurse on maxWidth links, not including self
            var newUrls = output.result;
            for (var j in newUrls) {
              newUrls[j] = cleanUrl(newUrls[j]);
            }
            newUrls = newUrls.filter(function(e) {return e != url;}).slice(0, maxWidth);
            siteMap[url] = newUrls;
            doScrape(depth+1, newUrls);
            updateGraph();
          }
        }
      });
    }
  }
};

/**
 * run rankPages if it has not been run in the last 1000ms
 */
function enqueueRankPages() {
  if (cleanupTimer) {clearTimeout(cleanupTimer);}
  cleanupTimer = setTimeout(rankPages, 1000);
}

/**
 * hide the link-details section
 */
var hideLink = function() {
  $('#link-url').empty().removeAttr('href');
  $('#link-summary, #link-tags, #link-rank').empty();
  $('#link-details').hide();
};

/**
 * show the link-details and retrieve rank, summary, and tags
 * @param url
 * @param scrollToDetails
 */
var loadLink = function(url, scrollToDetails) {
  if($('#link-url').text()!=url) { // don't flush content unless url has changed
    $('#link-url').text(url).attr('href', url);
    $('#link-summary, #link-tags').html('<span class="aspinner demo-spinner"></span>');
  }
  $('#link-rank').text(pageRanks[url] ? round(pageRanks[url]) : '');
  $('#link-details').show();
  if(scrollToDetails) {
    $('html, body').animate({
      scrollTop: $("#link-details").offset().top
    }, 1000);
  }
  algoClient.algo(algorithms.url2text).pipe(url).then(function(output) {
    if (output.error) {return showError(output.error);}
    algoClient.algo(algorithms.summarizer).pipe(output.result).then(function(output) {
      if($('#link-url').text()==url) { //avoid race condition if called again on different url
        $('#link-summary').text(output.error?"Error retrieving page":output.result);
      }
    });
    return algoClient.algo(algorithms.autotag).pipe([output.result]).then(function(output) {
      if($('#link-url').text()==url) { //avoid race condition
        var resultHtml = '';
        if (output.error) {
          resultHtml = "Error retrieving page";
        } else for (i in output.result) {
          resultHtml += '<span class="label label-purple">'+output.result[i]+'</span> ';
        }
        $('#link-tags').html(resultHtml);
      }
    });
  });
};

/**
 * ensure prefix, remove anchors and trailing /
 * @param url
 * @returns {string}
 */
var cleanUrl = function (url) {
  return getUrlCore(prefixHttp(url));
};

/**
 * display an error to the user
 * @param error
 */
var showError = function(error) {
  console.error(error);
  $('#scrape-status').html('<div class="text-danger">'+error.message.replace('java.net.UnknownHostException','Invalid URL')+'</div>');
};

/**
 * round to 2 decimal places
 * @param n
 * @returns {float}
 */
var round = function(n) {
  return (Math.floor(n * 100) / 100).toFixed(2);
};

/**
 * initialize d3 graph
 */
var startViz = function() {
  graphObj = new Algorithmia.viz.Graph(
    d3.select("svg.viz"),
    $("#viz-panel").width(),
    $("#viz-panel").height(),
    function(d) {return d.rank >= 0? colorScale(d.rank) : "blue";}, //color calculation
    function(d) {return d.rank >= 0? 6+d.rank*6 : 6}, //radius calculation
    function(d) {loadLink(d.name, true);} //link handler
  );
};

/**
 * update d3 graph with current siteMap
 */
var updateGraph = function() {
  graphObj.update(
    { //graph
      nodes: getNodes(),
      links: siteMap
    },
    function(name) { //rank function
      return pageRanks[name]?pageRanks[name]:0;
    }
  );
};

/**
 * calculate rank across all pages, update graph, list links, and show summary for first link
 */
var rankPages = function() {
  var nodes = getNodes();
  if(nodes.length==0) {return $('#results').hide();}
  var graphMatrix = graphObjectToMatrix(siteMap, nodes);
  algoClient.algo(algorithms.pagerank).pipe(graphMatrix).then(function(output) {
    if (output.error) {return showError(output.error);}
    var result = normalize(output.result);
    var ranking = {};
    for (var i = 0; i < result.length; i++) {
      ranking[nodes[i]] = result[i];
    }
    $('#scrape-status').text("");
    var pagerankSorted = sortMap(ranking);
    var pagerankSortedHtml = '';
    for (var j in pagerankSorted) {
      pageRanks[pagerankSorted[j].url] = pagerankSorted[j].rank;
      pagerankSortedHtml += '<div class="col-xs-3 col-sm-2"><p>' + round(pagerankSorted[j].rank) + '</p></div>';
      pagerankSortedHtml += '<div class="col-xs-9 col-sm-10 pagerank-links"><p class="pagerank-url"><a onclick="loadLink(\'' + pagerankSorted[j].url + '\', true)">' + pagerankSorted[j].url + '</a></p></div>';
    }
    $('#pagerank-sorted').html(pagerankSortedHtml);
    updateGraph();
    graphObj.updateRanking(function(d) {
      return ranking[d];
    });
    if(pagesDisplayed!=pagerankSorted.length) {
      enqueueRankPages();
    }
    pagesDisplayed = pagerankSorted.length;
    var currentUrl = $('#link-url').text();
    loadLink(currentUrl?currentUrl:pagerankSorted[0].url);
  });
};

/**
 * list all URLs from siteMap (keys and values)
 * @returns {Array}
 */
var getNodes = function() {
  var pageMap = [];
  for (var page in siteMap) {
    var links = siteMap[page];
    if (pageMap.indexOf(page) === -1) {
      pageMap.push(page);
    }
    for (var i = 0; i < links.length; i++) {
      if (pageMap.indexOf(links[i]) === -1) {
        pageMap.push(links[i]);
      }
    }
  }
  return pageMap;
};

/**
 * get matrix of link relationships
 * @param graph
 * @param nodes
 */
var graphObjectToMatrix = function(graph, nodes) {
  var transformedGraph = nodes.map(function() {return [];});
  for (var page in graph) {
    transformedGraph[nodes.indexOf(page)] = graph[page].map(function(link) {
      return nodes.indexOf(link);
    });
  }
  return transformedGraph;
};

var normalize = function(data) {
  var max, min;
  min = Math.min.apply(Math, data);
  max = Math.max.apply(Math, data);
  return data.map(function(d) {
    return (d - min) / (max - min);
  });
};

var sortMap = function(input) {
  var k, list, v;
  list = (function() {
    var _results;
    _results = [];
    for (k in input) {
      v = input[k];
      _results.push({
        url: k,
        rank: v
      });
    }
    return _results;
  })();
  list.sort(function(a, b) {
    return b.rank - a.rank;
  });
  return list;
};