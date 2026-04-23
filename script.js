(function() {
  const data = [
    { condition: "Anxiety",    count: 628 },
    { condition: "PTSD",       count: 624 },
    { condition: "Depression", count: 580 },
    { condition: "Bipolar",    count: 573 }
  ];
  const total = data.reduce((s, d) => s + d.count, 0);
  const colors = { Anxiety: "#7A9E7E", PTSD: "#C9A84C", Depression: "#C97B84", Bipolar: "#85B7EB" };

  const margin = { top: 20, right: 30, bottom: 60, left: 70 };
  const container = document.getElementById("d3-container");
  const W = Math.min(container.offsetWidth || 700, 860);
  const width = W - margin.left - margin.right;
  const height = 340 - margin.top - margin.bottom;

  const svg = d3.select("#d3-container").append("svg")
    .attr("width", W).attr("height", height + margin.top + margin.bottom)
    .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand().domain(data.map(d => d.condition)).range([0, width]).padding(0.35);
  const y = d3.scaleLinear().domain([0, 700]).range([height, 0]);

  svg.append("g").call(d3.axisLeft(y).tickSize(-width).tickFormat(""))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll("line").attr("stroke", "#e8e8e0").attr("stroke-dasharray", "3,3"));

  svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x))
    .call(g => g.select(".domain").attr("stroke", "#ccc"))
    .call(g => g.selectAll("text").style("font-family","DM Sans").style("font-size","13px").attr("fill","#4A5568"));

  svg.append("g").call(d3.axisLeft(y).ticks(6))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll("text").style("font-family","DM Sans").style("font-size","12px").attr("fill","#718096"));

  svg.append("text").attr("x", width/2).attr("y", height+48)
    .attr("text-anchor","middle").style("font-family","DM Sans").style("font-size","13px").attr("fill","#4A5568")
    .text("Mental Health Condition");
  svg.append("text").attr("transform","rotate(-90)").attr("x",-height/2).attr("y",-54)
    .attr("text-anchor","middle").style("font-family","DM Sans").style("font-size","13px").attr("fill","#4A5568")
    .text("Number of Respondents");

  const tooltip = document.getElementById("d3-tooltip");

  svg.selectAll(".d3-bar").data(data).enter().append("rect")
    .attr("class","d3-bar")
    .attr("x", d => x(d.condition)).attr("width", x.bandwidth())
    .attr("y", d => y(d.count)).attr("height", d => height - y(d.count))
    .attr("fill", d => colors[d.condition]).attr("rx", 5)
    .on("mouseover", function(event, d) {
      const pct = ((d.count/total)*100).toFixed(1);
      tooltip.style.opacity = 1;
      tooltip.innerHTML = `<strong>${d.condition}</strong><br>${d.count} respondents (${pct}%)`;
      d3.select(this).attr("opacity", 0.75);
    })
    .on("mousemove", function(event) {
      tooltip.style.left = (event.clientX + 14) + "px";
      tooltip.style.top  = (event.clientY - 36) + "px";
    })
    .on("mouseout", function() {
      tooltip.style.opacity = 0;
      d3.select(this).attr("opacity", 1);
    });

  svg.selectAll(".bar-label").data(data).enter().append("text")
    .attr("x", d => x(d.condition) + x.bandwidth()/2).attr("y", d => y(d.count) - 7)
    .attr("text-anchor","middle").style("font-family","DM Sans").style("font-size","13px").style("font-weight","500")
    .attr("fill","#1A1A2E").text(d => d.count);
})();
