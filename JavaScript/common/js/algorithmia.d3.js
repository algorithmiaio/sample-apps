(function() {
  var Graph, drawHistogram, drawLines, drawPath, drawPoints, drawRect, drawTable, drawTopics, edgeMapToEdgeList, vertexListToEdgeList;

  drawPoints = function(layer, data, className, size, color, d1, d2) {
    var circle, points, transition;
    points = layer.selectAll("circle." + className).data(data);
    circle = points.enter().append("circle");
    circle.attr("class", className);
    circle.attr("r", size);
    transition = points.transition();
    if (d1 && d2) {
      transition.attr("cx", d1);
      transition.attr("cy", d2);
    } else {
      transition.attr("cx", function(d) {
        return d[0];
      });
      transition.attr("cy", function(d) {
        return d[1];
      });
    }
    transition.style("fill", (typeof color === 'function' ? function(d) {
      return color(d[2]);
    } : color));
    points.exit().remove();
  };

  drawLines = function(layer, data, className, size, color, linecap, x1, y1, x2, y2) {
    var line, lines, transition;
    lines = layer.selectAll("line." + className).data(data);
    line = lines.enter().append("svg:line");
    line.attr("class", className);
    line.style("stroke-linecap", linecap);
    line.style("stroke-width", size);
    line.style("stroke", color);
    transition = lines.transition();
    transition.attr("x1", x1);
    transition.attr("y1", y1);
    transition.attr("x2", x2);
    transition.attr("y2", y2);
    lines.exit().remove();
  };

  drawPath = function(layer, path, size, color, linecap, x1, y1, x2, y2) {
    var line, paths, transition;
    paths = layer.selectAll("line.path").data(vertexListToEdgeList(path));
    line = paths.enter().append("svg:line");
    line.attr("class", "path");
    line.style("stroke-linecap", linecap);
    line.style("stroke-width", size);
    line.style("stroke", color);
    transition = paths.transition();
    transition.attr("x1", x1);
    transition.attr("y1", y1);
    transition.attr("x2", x2);
    transition.attr("y2", y2);
    paths.exit().remove();
  };

  vertexListToEdgeList = function(vertexList) {
    var edgeList, i, v, _i, _len;
    edgeList = [];
    if (vertexList) {
      for (i = _i = 0, _len = vertexList.length; _i < _len; i = ++_i) {
        v = vertexList[i];
        if (i > 0) {
          edgeList.push([vertexList[i - 1], vertexList[i]]);
        }
      }
    }
    return edgeList;
  };

  drawTopics = function(svg, topics, width, height) {
    var circle, group, node, nodes, pack, pivot, pivotData, text, transition;
    pivotData = function(data) {
      var k, v, _results;
      _results = [];
      for (k in data) {
        v = data[k];
        _results.push({
          word: k,
          count: v
        });
      }
      return _results;
    };
    pivot = topics.map(pivotData);
    nodes = svg.data([pivot]).selectAll("g.node");
    pack = d3.layout.pack();
    pack.value(function(d) {
      return d.count;
    });
    pack.size([width, height]);
    pack.padding(10);
    pack.children(function(d) {
      return d;
    });
    node = nodes.data(function(d) {
      return pack.nodes(d);
    });
    group = node.enter().append("g");
    group.attr("class", function(d) {
      if (d.length) {
        return "node";
      } else {
        return "node leaf";
      }
    });
    group.attr("transform", function(d) {
      return "translate(" + (d.x || 0) + "," + (d.y || 0) + ")";
    });
    node.exit().remove();
    circle = group.append("circle");
    circle.attr("r", function(d) {
      return d.r || 0;
    });
    text = node.append("text");
    text.attr("dy", ".3em");
    text.attr("font-size", "8pt");
    text.attr("text-anchor", "middle");
    text.text(function(d) {
      return d.word;
    });
    transition = node.transition();
    transition.attr("transform", function(d) {
      return "translate(" + (d.x || 0) + "," + (d.y || 0) + ")";
    });
  };

  Graph = function(svg, width, height, colors, radius, clickHandler) {
    var force;
    force = d3.layout.force();
    force.charge(-100);
    force.linkDistance(40);
    force.size([width, height]);
    force.gravity(0.5);
    force.start();
    setTimeout(((function(_this) {
      return function() {
        return _this.doUpdate();
      };
    })(this)), 0);
    this.update = function(graph, ranking) {
      var foundNode, link, links, name, nodes, oldNode, rank, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      nodes = force.nodes();
      links = force.links();
      _ref = graph.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        foundNode = null;
        for (_j = 0, _len1 = nodes.length; _j < _len1; _j++) {
          oldNode = nodes[_j];
          if (oldNode.name === name) {
            foundNode = oldNode;
          }
        }
        rank = ranking ? ranking(name) : -1;
        if (foundNode) {
          foundNode.rank = rank;
        } else {
          nodes.push({
            name: name,
            rank: rank
          });
        }
      }
      links.length = 0;
      _ref1 = edgeMapToEdgeList(graph.nodes, graph.links);
      for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
        link = _ref1[_k];
        links.push(link);
      }
      this.doUpdate();
    };
    this.updateRanking = function(ranking) {
      var node, nodes, _i, _len;
      nodes = force.nodes();
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        node.rank = ranking(node.name);
      }
      this.doUpdate();
    };
    this.doUpdate = function() {
      var bottom, circle, circleTr, line, link, links, middle, node, nodes, title;
      force.start();
      nodes = force.nodes();
      links = force.links();
      bottom = svg.select(".bottom");
      link = bottom.selectAll("line.link").data(links);
      line = link.enter().append("line");
      line.attr("class", "link");
      line.style("stroke-width", 1);
      line.style("stroke", "#5d9cec");
      link.exit().remove();
      middle = svg.select(".middle");
      node = middle.selectAll("circle.node").data(nodes);
      circle = node.enter().append("circle");
      circle.attr("class", "node");
      circle.attr("r", radius);
      circle.style("fill", colors);
      circle.on("click", clickHandler);
      title = circle.append("title");
      title.text(function(d) {
        return d.name;
      });
      circle.call(force.drag);
      circleTr = node.transition();
      circleTr.style("fill", colors);
      circleTr.attr("r", radius);
      node.exit().remove();
      force.on("tick", function() {
        link.attr("x1", function(d) {
          return d.source.x;
        });
        link.attr("y1", function(d) {
          return d.source.y;
        });
        link.attr("x2", function(d) {
          return d.target.x;
        });
        link.attr("y2", function(d) {
          return d.target.y;
        });
        node.attr("cx", function(d) {
          return d.x;
        });
        node.attr("cy", function(d) {
          return d.y;
        });
      });
    };
  };

  edgeMapToEdgeList = function(nodes, links) {
    var edgeList, neighbors, v1, v2, _i, _len;
    edgeList = [];
    for (v1 in links) {
      neighbors = links[v1];
      for (_i = 0, _len = neighbors.length; _i < _len; _i++) {
        v2 = neighbors[_i];
        edgeList.push({
          source: nodes.indexOf(v1),
          target: nodes.indexOf(v2),
          value: 1
        });
      }
    }
    return edgeList;
  };

  drawRect = function(rects, className, color, x1, y1, x2, y2) {
    var rect, transition;
    rect = rects.enter().append("svg:rect");
    rect.attr("class", className);
    rect.style("fill", color);
    transition = rects.transition();
    transition.attr("x", x1);
    transition.attr("y", y1);
    transition.attr("width", x2 - x1);
    transition.attr("height", y2 - y2);
    rects.exit().remove();
  };

  drawTable = function(table, data, rowNames, colNames, color) {
    var cells, colLabel, colLabels, row, rowLabel, rows, tbody, td, thead;
    thead = table.select("thead").select("tr");
    tbody = table.select("tbody");
    colLabels = thead.selectAll("th").data(colNames);
    colLabel = colLabels.enter().append("th");
    colLabel.text(function(d) {
      return d;
    });
    rows = tbody.selectAll("tr").data(data);
    row = rows.enter().append("tr");
    rowLabel = row.append("th");
    rowLabel.text(function(d, i) {
      return rowNames[i];
    });
    rows.exit().remove();
    cells = rows.selectAll("td").data(function(row) {
      return row;
    });
    td = cells.enter().append("td");
    td.text(function(d) {
      return d.toFixed(2);
    });
    td.style("background-color", color);
    cells.exit().remove();
  };

  drawHistogram = function(svg, data) {
    var bars, rect;
    bars = svg.selectAll("rect.bar").data(data);
    rect = bars.enter().append("rect");
    rect.attr("class", bar);
  };

  if (!window.Algorithmia) {
    window.Algorithmia = {};
  }

  window.Algorithmia.viz = {
    drawPoints: drawPoints,
    drawLines: drawLines,
    drawPath: drawPath,
    drawTopics: drawTopics,
    Graph: Graph,
    drawRect: drawRect,
    drawTable: drawTable
  };

}).call(this);

//# sourceMappingURL=algorithmia.d3.js.map
