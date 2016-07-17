d3.csv("data/start_end_count.csv",function(data){
  var dataset=data;
  //create look up dictionary
  var dict={};
  $.each(dataset, function(index,line){
    if (line.start in dict){
      dict[line.start][line.end]=line.count
    }
    else{
      dict[line.start]={}
      dict[line.start][line.end]=line.count
    }
  });
  var station_list=Object.keys(dict).sort()
  //create square matrix from dictionary
  var matrix=[]
  $.each(station_list,function(index,i){
    matrix.push([]);
    $.each(station_list,function(index2,j){
      if (j in dict[i]){
        matrix[index].push(parseInt(dict[i][j]));
      }
      else{
        matrix[index].push(0)
      }
    });
  });

var chord = d3.layout.chord()
    .padding(.01)
    .sortSubgroups(d3.descending)
    .matrix(matrix);

var width = 1100,
    height = 800,
    innerRadius = Math.min(width, height) * .41,
    outerRadius = innerRadius * 1.1;

var fill = d3.scale.ordinal()
    .domain(d3.range(69))
    .range(['#c7b570','#c6cdc7','#335c64','#768935','#507282','#5c4a56','#aa7455','#574109','#837722','#73342d','#0a5564','#9c8f57','#7895a4','#4a5456','#b0a690','#0a3542',]);

var svg = d3.select("#circle-here").append("svg")
    .attr("width", "90%")
    .attr("height", "900px")
  .append("g")
    .attr("transform", "translate(" + width / 2 + ", 500)");

var g=svg.selectAll("g")
    .data(chord.groups)
  .enter().append("g")
  .on("mouseover", mouseover)
  .on("mouseout", mouseout);

g.append("path")
    .style("fill", function(d) { return fill(d.index); })
    .style("stroke", function(d) { return fill(d.index); })
    .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))

g.append("text")
    .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr("dy", ".35em")
    .style("fill", "#FFFFFF")
    .style("font-family", "helvetica, arial, sans-serif")
    .style("font-size", "11px")
    .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .attr("transform", function(d) {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
          + "translate(" + (outerRadius+5) + ")"
          + (d.angle > Math.PI ? "rotate(180)" : "");
    })
    .text(function(d){return station_list[d.index];});

svg.append("g")
    .attr("class", "chord")
  .selectAll("path")
    .data(chord.chords)
  .enter().append("path")
    .attr("d", d3.svg.chord().radius(innerRadius))
    .style("fill", function(d) { return fill(d.target.index); })
    .style("opacity", 1);

//appends the tooltip div
var tooltip=d3.select("#circle-here").append("div")
    .attr("class","tooltip")
    .style("opacity",1e-6)

function mouseover(d,i) {
  svg.selectAll(".chord path")
      .filter(function(d) { return d.source.index != i && d.target.index != i; })
    .transition()
      .style("opacity", 0);
  tooltip
    .text(station_list[i]+": "+parseInt(d.value)+" rides")
    .style("opacity",1)
    .style("left", (d3.event.pageX - 34) + "px")
    .style("top", (d3.event.pageY - 12) + "px");
};

function mouseout(){
  svg.selectAll(".chord path")
    .style("opacity",1);
  tooltip.style("opacity",1e-6);
}
});