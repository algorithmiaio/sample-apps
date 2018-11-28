(function() {
  var animateDemo, client, cx, cy, dotwidth, edgeMapToEdgeList, generateAndSolveMaze, generateMaze, goal, graph, height, padding, path, pathplan, pathwidth, randomStartGoal, randomVertex, sizeX, sizeY, spacing, start, svg, updateD3, width, x1, x2, y1, y2;

  graph = {
    vertices: {
      "v[0][0]": [0, 0]
    },
    edges: {}
  };

  path = [];

  start = "v[0][0]";

  goal = "v[0][0]";

  svg = null;

  width = 800;

  height = 450;

  padding = 12;

  spacing = 20;

  sizeX = Math.floor((width - 2 * padding) / spacing);

  sizeY = Math.floor((height - 2 * padding) / spacing);

  pathwidth = 16;

  dotwidth = 7;

  // this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
  client = Algorithmia.client('simPSqzLtgY2Dt4GQnRzcDvXcFV1');

  window.addEventListener("load", function() {
    svg = d3.select("svg.viz");
    width = $(".viz-container").width();
    height = $(".viz-container").height();
    sizeX = Math.floor((width - 2 * padding) / spacing);
    sizeY = Math.floor((height - 2 * padding) / spacing);
    generateAndSolveMaze();
    return animateDemo();
  });

  updateD3 = function() {
    var bottomLayer, topLayer;
    bottomLayer = svg.select("g.bottom");
    Algorithmia.viz.drawLines(bottomLayer, edgeMapToEdgeList(graph.edges), "edge", pathwidth, "#5d9cec", "square", x1, y1, x2, y2);
    bottomLayer = svg.select("g.middle");
    Algorithmia.viz.drawPath(bottomLayer, path, "5px", "blue", "round", x1, y1, x2, y2);
    topLayer = svg.select("g.top");
    Algorithmia.viz.drawPoints(topLayer, [start], "start", dotwidth, "#4f0", cx, cy);
    return Algorithmia.viz.drawPoints(topLayer, [goal], "goal", dotwidth, "red", cx, cy);
  };

  cx = function(d) {
    return graph.vertices[d][0] * spacing + padding;
  };

  cy = function(d) {
    return graph.vertices[d][1] * spacing + padding;
  };

  x1 = function(d) {
    return graph.vertices[d[0]][0] * spacing + padding;
  };

  y1 = function(d) {
    return graph.vertices[d[0]][1] * spacing + padding;
  };

  x2 = function(d) {
    return graph.vertices[d[1]][0] * spacing + padding;
  };

  y2 = function(d) {
    return graph.vertices[d[1]][1] * spacing + padding;
  };

  edgeMapToEdgeList = function(successors) {
    var edgeList, neighbors, v1;
    edgeList = [];
    for (v1 in successors) {
      neighbors = successors[v1];
      neighbors.forEach(function(v2) {
        return edgeList.push([v1, v2]);
      });
    }
    return edgeList;
  };

  generateMaze = function(cb) {
    var algorithmInput;
    $("#demo-status").text("");
    $("#maze-out").text = "";
    $("#path-in").text = "";
    $("#path-out").text = "";
    algorithmInput = [sizeX, sizeY];
    $("#maze-in").html("<pre>" + JSON.stringify(algorithmInput, null, 2) + "</pre>");
    return client.algo("/kenny/MazeGen?redis=1").pipe(algorithmInput).then(function(result) {
      if (result.error) {
        $("#maze-out").html('<span class="text-danger">' + (result.error.message || result.error) + '</span>');
        $("#demo-status").html('<span class="text-danger">' + (result.error.message || result.error) + '</span>');
        return;
      }
      graph = result.result;
      $("#maze-out").html("<pre>" + JSON.stringify(graph, null, 2) + "</pre>");
      if (!graph) {
        $("#demo-status").text("No maze found");
        return;
      }
      $("#demo-status").text("");
      start = randomVertex();
      goal = randomVertex();
      while (Object.keys(graph.vertices).length > 1 && start === goal) {
        goal = randomVertex();
      }
      path = [];
      updateD3();
      if (cb) {
        return cb();
      }
    });
  };

  randomVertex = function() {
    var i, keys;
    keys = Object.keys(graph.vertices);
    i = Math.floor(Math.random() * keys.length);
    return keys[i];
  };

  pathplan = function() {
    var algorithmInput;
    $("#demo-status").text("");
    $("#path-out").text = "";
    algorithmInput = [graph.vertices, graph.edges, start, goal];
    $("#path-in").html("<pre>" + JSON.stringify(algorithmInput, null, 2) + "</pre>");
    client.algo("/kenny/Dijkstra?redis=1").pipe(algorithmInput).then(function(result) {
      if (result.error) {
        $("#path-out").html('<span class="text-danger">' + (result.error.message || result.error) + '</span>');
        $("#demo-status").html('<span class="text-danger">' + (result.error.message || result.error) + '</span>');
        return;
      }
      path = result.result;
      $("#path-out").html('<pre>' + JSON.stringify(path, null, 2) + '</pre>');
      if (!path) {
        $("#demo-status").text("No path found");
      }
      updateD3();
    });
  };

  generateAndSolveMaze = function() {
    return generateMaze(function() {
      return pathplan();
    });
  };

  randomStartGoal = function() {
    start = randomVertex();
    goal = randomVertex();
    while (Object.keys(graph.vertices).length > 1 && start === goal) {
      goal = randomVertex();
    }
    path = [];
    updateD3();
    return pathplan();
  };

  animateDemo = function() {
    var updater;
    return updater = setInterval(randomStartGoal, 5500);
  };

  if (!window.Algorithmia) {
    window.Algorithmia = {};
  }

  if (!window.Algorithmia.demo) {
    window.Algorithmia.demo = {};
  }

  window.Algorithmia.demo.animateDemo = animateDemo;

  window.Algorithmia.demo.generateMaze = generateAndSolveMaze;

  window.Algorithmia.demo.randomStartGoal = randomStartGoal;

}).call(this);

//# sourceMappingURL=pathplan.js.map