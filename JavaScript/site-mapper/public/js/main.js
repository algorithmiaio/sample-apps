// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simeyUbLXQ/R8Qga/3ZCRGcr2oR1');

var algorithms = {
  autotag: '/nlp/AutoTag/1.0.1',
  url2text: '/util/Url2Text/0.1.4',
  getlinks: '/web/GetLinks/0.1.5',
  pagerank: '/thatguy2048/PageRank/0.1.0',
  summarizer: '/SummarAI/Summarizer/0.1.3'
};

var colorScale = d3.scale.linear().domain([0, 0.4, 1]).range(["yellow", "red", "#5000be"]);
var graphObj = null;
var pagerank = null;
var pagerankSorted = [];
var pending = [];
var count = 0;
var depthLimit = 3;
var siteMap = {};
var link = {};

var summarizing, tagging;

/**
 * once DOM is ready, update vars amd set initial URL
 */
$(document).ready(function() {
  setInviteCode('sitemapper');
  $('[data-toggle="popover"]').popover();
  $('#siteUrl').val("http://algorithmia.com/");
  $('#depthLimit').val(depthLimit);
  scrape();
});

var scrape = function(url) {
  if(!url) {url = $('#siteUrl').val();}
  url = prefixHttp(url);
  depthLimit = $('#depthLimit').val();
  siteMap = {};
  pagerank = null;
  pagerankSorted = [];
  link = {};
  pending = [url];
  count = 0;
  startViz();
  doScrape();
};

var doScrape = function() {
  var url;
  $('#scrape-status').text("Scraping site...");
  if (pending.length === 0 || count >= depthLimit) {
    $('#scrape-status').text("Running PageRank...");
    rankPage(siteMap, function(ranking) {
      $('#scrape-status').text("");
      pagerank = ranking;
      pagerankSorted = sortMap(ranking);
      updateRanking(ranking);
    });
    return;
  }
  url = pending.shift();
  if (!siteMap[url]) {
    count++;
    getLinks(url, function(error, links) {
      if (!error) {
        siteMap[url] = links;
        updateGraph(siteMap);
        pending = pending.concat(links);
      }
      doScrape();
    });
  } else {
    doScrape();
  }
};

var loadLink = function(url) {
  summarizing = true;
  tagging = true;
  link = {};
  link.url = url;
  $('#link-url').text(url);
  $('#link-url').href(url);
  algoClient.algo(algorithms.url2text).pipe(url).then(function(err, result) {
    if (err) {
      return;
    }
    algoClient.algo(algorithms.summarizer).pipe(result).then(function(err, result) {
      if (err) {
        return;
      }
      link.summary = result.summarized_data;
      $('#link-summary').text(result.summarized_data);
      summarizing = false;
    });
    return algoClient.algo(algorithms.autotag).pipe([result]).then(function(err, result) {
      if (err) {
        return;
      }
      tagging = false;
      link.tags = result;
      var resultHtml = '';
      for (tag in result) {
        resultHtml += '<a>'+tag+'</a>'
      }
      $('link-tags').html(resultHtml);
    });
  });
};

var round = function(n) {
  return (Math.floor(n * 100) / 100).toFixed(2);
};

var startViz = function() {
  var clickHandler, colors, height, radius, svg, width;
  svg = d3.select("svg.viz");
  width = $(".viz-container").width();
  height = $(".viz-container").height();
  colors = function(d) {
    if (d.rank === -1) {
      return "blue";
    } else {
      return colorScale(d.rank);
    }
  };
  radius = function(d) {
    if (d.rank === -1) {
      return 6;
    } else {
      return 6 + d.rank * 6;
    }
  };
  clickHandler = function(d) {
      loadLink(d.name);
  };
  graphObj = new Algorithmia.viz.Graph(svg, width, height, colors, radius, clickHandler);
};

var updateGraph = function(links) {
  var graph, svg;
  svg = d3.select("svg.viz");
  graph = {
    nodes: getNodes(links),
    links: links
  };
  graphObj.update(graph, null);
};

var updateRanking = function(ranking) {
  var weight;
  weight = function(d) {
    return ranking[d];
  };
  graphObj.updateRanking(weight);
};

var getLinks = function(url, cb) {
  var inputJson;
  inputJson = [url, true];
  algoClient.algo(algorithms.getlinks).pipe(inputJson).then(cb);
};

var rankPage = function(graph, cb) {
  var graphMatrix, nodes;
  $("#demo-status").text("");
  $("#pagerank-out").text("");
  nodes = getNodes(graph);
  graphMatrix = graphObjectToMatrix(graph, nodes);
  $("#pagerank-in").html("<pre>" + JSON.stringify(graphMatrix, null, 2) + "</pre>");
  algoClient.algo(algorithms.pagerank).pipe(graphMatrix).then(function(error, result) {
    var errorSpan, i, pre, rank, ranking, _i, _len;
    if (error) {
      errorSpan = $('<span class="text-danger">').text(error);
      $("#pagerank-out").html(errorSpan);
      $("#demo-status").html(errorSpan);
      return;
    }
    pre = $("<pre>").text(JSON.stringify(result, null, 2));
    $("#pagerank-out").html(pre);
    $("#demo-status").text("");
    if (typeof result === "string") {
      result = JSON.parse(result);
    }
    result = normalize(result);
    ranking = {};
    for (i = _i = 0, _len = result.length; _i < _len; i = ++_i) {
      rank = result[i];
      ranking[nodes[i]] = rank;
    }
    if (cb) {
      cb(ranking);
    }
  });
};

var getNodes = function(graph) {
  var link, links, page, pageMap, _i, _len;
  pageMap = [];
  for (page in graph) {
    links = graph[page];
    if (pageMap.indexOf(page) === -1) {
      pageMap.push(page);
    }
    for (_i = 0, _len = links.length; _i < _len; _i++) {
      link = links[_i];
      if (pageMap.indexOf(link) === -1) {
        pageMap.push(link);
      }
    }
  }
  return pageMap;
};

var graphObjectToMatrix = function(graph, nodes) {
  var links, page, transformedGraph;
  transformedGraph = nodes.map(function() {
    return [];
  });
  for (page in graph) {
    links = graph[page];
    transformedGraph[nodes.indexOf(page)] = links.map(function(link) {
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