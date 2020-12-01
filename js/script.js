const getData = async () => {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json`, { mode: 'cors' });

    const data = await response.json();

    return data;
  } catch (error) {
    alert(error);
  }
  return false;
};

const printChart = async (data) => {
  const mydata = await data;

  const svgWidth = window.innerWidth - 20;
  const svgHeight = window.innerHeight - 100;
  const svg = d3.select("#main")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);

  const barWidth = Math.ceil((svgWidth - 20) / mydata.data.length);
  const oldest = new Date(mydata.data[0][0]);
  const newest = new Date(mydata.data[mydata.data.length - 1][0]);
  const height = svgHeight - 40;
  const width = svgWidth - 80;

  svg.append("g").attr("transform", "translate(70,20)");

  const xScale = d3.scaleTime()
                   .domain([oldest, newest])
                   .range([0, width]);

  const yScale = d3.scaleLinear()
                   .domain([0, d3.max(mydata.data, function(d) { return d[1] })])
                   .range([svgHeight - 60, 0]);

  const xAxis = d3.axisBottom()
                  .scale(xScale)
                  .ticks(d3.years);

  const yAxis = d3.axisLeft()
                  .scale(yScale)
                  .ticks(10);

  svg.append("g")
     .attr("id", "x-axis")
     .attr("transform", "translate(50," + height + ")")
     .call(xAxis);

  svg.append("g")
     .attr("id", "y-axis")
     .attr("transform","translate(" + 50 + ",20)")
     .call(yAxis);

  const tooltip = d3.select("#main")
                    .append("div")
                    .attr("id", "tooltip")
                    .attr("opacity", 0)
                    .attr("visibility", "hidden");

  svg.selectAll(".bar")
     .data(mydata.data)
     .enter()
     .append("g")
     .attr("transform", "translate(" + 50 + " ,20)")
     .append("rect")
     .attr("class", "bar")
     .attr("x", function(d) { return xScale(new Date(d[0])) })
     .attr("y", function(d) { return yScale(d[1]) })
     .attr("height", function(d) { return svgHeight - 60 - yScale(d[1]) })
     .attr("width", barWidth)
     .attr("fill", "#334fff")
     .on("mouseover", function(d) {
       d3.select(this)
         .attr("fill", "#22c90d");

       let date = new Date(d[0]);
       let month = " ";

       switch(date.getMonth()) {
         case 0:
           month = 'January';
           break;
         case 3:
           month = 'April';
           break;
         case 6:
           month = 'July';
           break;
         case 9:
           month = 'October';
           break;
       };

       let posX = 0;

       if  (d3.event.pageX < width / 2) { posX = d3.event.pageX + 20 }
       else { posX = d3.event.pageX - 150 }

       tooltip.style("opacity", 0.8)
              .style("visibility", "visible")
              .style("position", "absolute")
              .style("left", 100 + "px")
              .style("top", 100 + "px")
              .style("background-color", "#878a90")
              .style("padding", "0 10px")
              .style("border-radius", "5px")
              .html("<p>" + d[1] + " billion USD</p><p>" + month + " " + date.getFullYear() + "</p>");
     })
     .on("mouseleave", function(d) {
       d3.select(this)
         .attr("fill", "#334fff");

       tooltip.style("opacity", 0)
              .style("visibility", "hidden")
              .text("test");
     });
}

window.onresize = function() {
  printChart(getData());
}

window.onload = function() {
  printChart(getData());
}
