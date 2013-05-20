d3.createWaterfall = function(wtf){
  var svg = {},
      xScale,
      formatValue = d3.format(","),
      gutterGrid = wtf.height/wtf.series.length,
      data = [],
      init = function(){
        makeScaleAndWaterfallObject();
        addPropertiesToObject();
        makeContainerAndGrids();
        makeRectangles();
        makeLabels();
      }

  return init();

  function makeScaleAndWaterfallObject(){
    var max = 0, min = 0, temp = 0;
    for(var j=0; j<wtf.series.length; j++){
      temp+=wtf.series[j].value;
      if(temp<min) min = temp;
      if(temp>max) max = temp;
      data.push(wtf.series[j]);
    }

    xScale = d3.scale.linear().domain([min,max]).range([0,wtf.width]);
  }

  function addPropertiesToObject(){
    var acum = 0;

    for(var i=0; i<data.length; i++) {
      data[i].start = data[i].value < 0 ? acum + data[i].value : acum;
      data[i].width = Math.abs(data[i].value);
      data[i].startY = gutterGrid*i;
      data[i].height = gutterGrid - wtf.gutter*2;
      data[i].color = data[i].value < 0 ? wtf.colors.negative : wtf.colors.positive;
      data[i].connector = {
        x: data[i].value < 0 ? data[i].start : data[i].start + data[i].width,
        y: data[i].startY + wtf.gutter + data[i].height
      };
      acum+=data[i].value;
    }
  }


  function makeContainerAndGrids(){
    svg = d3.select('#'+wtf.container)
      .append("svg")
      .attr("width", wtf.width)
      .attr("height", wtf.height); 


    //create the grids
    svg.selectAll(".gridLine")
      .data(data)
      .enter().append("line")
      .attr("class","gridLine")
      .attr("stroke-dasharray","3, 4")
      .attr("x1",function(d,i){ return i === 0 ? "" : wtf.xPadding })
      .attr("y1",function(d,i){ return data[i].startY })
      .attr("x2",function(d,i){ return i === 0 ? "" : wtf.width - wtf.xPadding })
      .attr("y2",function(d,i){ return data[i].startY });

    // create the axis
    svg.selectAll(".axis")
      .data([0])
      .enter().append("line")
      .attr("x1",function(d){ return xScale(d)})
      .attr("y1",0)
      .attr("x2",function(d){return xScale(d)})
      .style("stroke",wtf.axis.color)
      .style("stroke-width",wtf.axis.width)
      .attr("y2",wtf.height); 

  }



  function makeRectangles(){
    svg.selectAll(".waterfallRect")
    .data(data)
    .enter().append("rect")
    .attr("class","waterfallRect")
    .attr("x",function(d,i){ return xScale(d.start) })
    .attr("y",function(d,i){ return d.startY + wtf.gutter })
    .attr("width",function(d){ return xScale(d.width) })
    .attr("fill",function(d,i){ return d.color })
    .attr("height",function(d){ return d.height });

    svg.selectAll(".connectors")
    .data(data)
    .enter().append("line")
    .attr("x1",function(d){return xScale(d.connector.x) })
    .attr("y1",function(d){return d.connector.y })
    .attr("x2",function(d){return xScale(d.connector.x) })
    .attr("y2",function(d){return d.connector.y + wtf.gutter*2})
    .attr("stroke-width",1)
    .attr("stroke","red")
    
  }

  function makeLabels(){
    if(!wtf.showValues) return;

    var g = svg.selectAll(".waterfallLabel")
    .data(data).enter().append("g")
    .attr("x",function(d,i){ return xScale(d.start) + xScale(d.width)/2 })
    .attr("y",function(d,i){ return d.startY + wtf.gutter + d.height/4 })
    .attr("fill","white")

    g.append("rect")
    .attr("class","waterfallLabel")
    .attr("x",function(d,i){ return xScale(d.start) + xScale(d.width)/2 })
    .attr("y",function(d,i){ return d.startY + wtf.gutter + d.height/4 })
    .attr("width",function(d){ 
      var l = d.value.toString().length;
      return l * (d.height/2);
    })
    .attr("height",function(d){ return d.height/2 });

    g.append("text")
    .attr("class","rectLabel")
    .attr("x",function(d,i){ return xScale(d.start) + xScale(d.width)/2 })
    .attr("dx",5)
    .style('font-size',function(d){ 
      return d.height/2
    })
    .attr("y",function(d,i){ return d.startY + wtf.gutter + d.height/1.4 }) 
    .text(function(d){return d.value})
  }


}
  