d3.chart.scatter = function() {
  var size = [1, 1],
      duration = 0,
      domain = null,
      tickFormat = null,
      x = d3_chart_scatterX,
      y = d3_chart_scatterY,
      xAxis = d3.chart.axis().orient("bottom").tickCount(3),
      yAxis = d3.chart.axis().orient("left").tickCount(3);

  function scatter(g) {
    g.each(function(d, i) {
      var g = d3.select(this),
          xMin = Infinity, xMin = Infinity,
          xMax = -Infinity, xMax = -Infinity,
          dx = x.call(this, d, i),
          dy = y.call(this, d, i),
          xd = domain && domain.call(this, d, i) || [d3.min(dx), d3.max(dx)], // new x-domain
          yd = domain && domain.call(this, d, i) || [d3.min(dy), d3.max(dy)], // new y-domain
          x1 = d3.scale.linear().domain(xd).range([0, size[0]]), // new x-scale
          y1 = d3.scale.linear().domain(yd).range([size[1], 0]), // new y-scale
          x0 = this.__chart__ && this.__chart__.x || x1, // old x-scale
          y0 = this.__chart__ && this.__chart__.y || y1; // old y-scale

      // x-axis
      var gx = g.selectAll(".x.axis").data([,]);
      gx.enter().append("svg:g").attr("class", "x axis");
      gx.attr("transform", "translate(0," + height + ")").call(xAxis.scales([x0, x1]));

      // y-axis
      var gy = g.selectAll(".y.axis").data([,]);
      gy.enter().append("svg:g").attr("class", "y axis")
      gy.call(yAxis.scales([y0, y1]));

      // Stash the new scales.
      this.__chart__ = {x: x1, y: y1};

      // Update scatter plots.
      var datum = g.selectAll("g.datum")
          .data(dx);

      var t = function(d, i) { return "translate(" + x1(d) + "," + y1(dy[i]) + ")"; };

      datum.enter().append("svg:g")
          .attr("class", "datum")
          .attr("transform", function(d, i) { return "translate(" + x0(d) + "," + y0(dy[i]) + ")"; })
          .style("opacity", 1e-6)
        .transition()
          .duration(duration)
          .attr("transform", t)
          .style("opacity", 1);

      datum.transition()
          .duration(duration)
          .attr("transform", t)
          .style("opacity", 1);

      datum.exit().transition()
          .duration(duration)
          .attr("transform", t)
          .style("opacity", 1e-6)
          .remove();

      d3.timer.flush();
    });
  }

  scatter.size = function(x) {
    if (!arguments.length) return size;
    size = x;
    return scatter;
  };

  scatter.duration = function(x) {
    if (!arguments.length) return duration;
    duration = x;
    return scatter;
  };

  scatter.domain = function(x) {
    if (!arguments.length) return domain;
    domain = x == null ? x : d3.functor(x);
    return scatter;
  };

  scatter.x = function(z) {
    if (!arguments.length) return x;
    x = z;
    return scatter;
  };

  scatter.y = function(z) {
    if (!arguments.length) return y;
    y = z;
    return scatter;
  };

  scatter.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    xAxis.tickFormat(tickFormat);
    yAxis.tickFormat(tickFormat);
    return scatter;
  };

  return scatter;
};

function d3_chart_scatterX(d) {
  return d.x;
}

function d3_chart_scatterY(d) {
  return d.y;
}
