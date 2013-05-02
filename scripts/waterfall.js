function createWaterfall(wtf){
  var chart = {},
      chart_width = wtf.rowLabels ? wtf.width + 565 : wtf.width,
      chart_height= wtf.height;
  // //
  // //create the SVG container for the chart(s)
  // //
  chart.svg = d3.select('#'+wtf.container)
      .append("svg")
      .attr("width", chart_width)
      .attr("height", chart_height);

  // //
  // // add the necessary constants
  // //

  if(wtf.rowLabels){
    wtf.startX = 135;
    wtf.endX = 540;
    wtf.endChartX = 540;
  }else{
    wtf.startX = 1;
    wtf.endX = 540;
    wtf.endChartX = 400;
  }

  if(wtf.startX){
    wtf.xPadding = wtf.startX + 185;
    wtf.chartStartY = 80;
    wtf.chartEndY = 525;
    wtf.waterfallChartWidth = 75;
    wtf.axisWidth = 1;
    wtf.rectGutter = 5;
  }


  //
  // rowLabels
  //


  if(wtf.rowLabels){
    chart.svg.selectAll(".chartContainerTitleTxt")
      .data(wtf.rowLabels)
      .enter().append("text")
      .attr("class","chartContainerTitleTxt")
      .attr("x",wtf.startX - 85)
      .attr("y",function(d){ return d.y + 32})
      .text(function(d){ return d.name })
        .append("tspan")
        .attr("x",function(d){return d.x + 51})
        .attr("y",function(d){ return d.y + 25})
        .attr("class","sub")
        .text(function(d){ return d.sub});
  }
  
  //
  // chart container
  //




  //
  //horizontal grid lines
  //

  if(wtf.horizontalGridLines){
    //create the grids
    var gutterGrid = wtf.height/wtf.series.length;
    wtf.horizontalGridLines = [];
    for(var k=0; k<wtf.series.length+1; k++){
      var obj = {"x1":wtf.startX+10,"y1":gutterGrid*k, "x2":wtf.width-5,"y2":gutterGrid*k}
      wtf.horizontalGridLines.push(obj);
    }

    chart.svg.selectAll(".gridLine")
      .data(wtf.horizontalGridLines)
      .enter().append("line")
      .attr("class","gridLine")
      .attr("stroke-dasharray","3, 4")
      .attr("x1",function(d){ return d.x1 })
      .attr("x2",function(d){ return d.x2 })
      .attr("y1",function(d){ return d.y1 })
      .attr("y2",function(d){ return d.y2 })  
  }
  

  //
  //
  // create the waterfall chart
  //
  //


  
  //the following is used to calculate the domain correctly
  var max = 0, min = 0, temp = 0;
  for(var j=1; j<wtf.series.length; j++){
    temp+=wtf.series[j].value;
    if(temp<min) min = temp;
    if(temp>max) max = temp;
  }

  var acum = 0;

  for(var i=0; i<wtf.series.length; i++) {
    if(wtf.series[i].value<0){
      //if I have a negative element before me
      //start from where it started not from where it ended so change acum
      wtf.series[i]['start'] = acum + wtf.series[i].value;
      wtf.series[i]['width'] = Math.abs(wtf.series[i].value); 
    }else{
      wtf.series[i]['start'] = acum;
      wtf.series[i]['width'] = wtf.series[i].value; 
    }
    acum+=wtf.series[i].value;
  }

  //
  // now that we have the correct domain we can create the scales
  //
    
  var xScale = d3.scale.linear().domain([0,max-min]).range([0,wtf.waterfallChartWidth]);
  

  //
  // create the yAxis
  //
  var yAxis = chart.svg.selectAll(".axis")
    .data([0])
    .enter().append("line")
    .attr("x1",function(d){ return xScale(d)+wtf.xPadding})
    .attr("y1",0)
    .attr("x2",function(d){return xScale(d)+wtf.xPadding})
    .style("stroke","#000")
    .style("stroke-width",wtf.axisWidth)
    .attr("y2",wtf.height)

  //
  // the waterfall rectangles
  //
  chart.svg.selectAll(".waterfallRect")
    .data(wtf.series)
    .enter().append("rect")
    .attr("x",function(d,i){ 
      return wtf.xPadding + xScale(d.start) 
    })
    .attr("y",function(d,i){ 
      return wtf.horizontalGridLines[i].y1 + wtf.rectGutter;
    })
    .attr("width",function(d){ return xScale(d.width) })
    .attr("fill",function(d,i){
      if(i == wtf.series.length -1 || i == 0) return "#CCCCCC"; //first and last bars are gray
      if(d.value < 0) return "#C4322E";
      else return "steelblue";

    })
    .attr("height",gutterGrid- wtf.rectGutter*2)
    .attr("class","waterfallRect");

  //
  // the waterfall rectangle labels
  //

  var formatValue = d3.format(",");

  chart.svg.selectAll(".lblRect")
    .data(wtf.series)
    .enter().append("g")
    .attr("x",function(d){ return wtf.xPadding + xScale(d.start) })
    .attr("y",function(d,i){ return i == 0 ? wtf.chartStartY : (i*69)+(wtf.chartStartY+(i*8)) })
      .append("rect")
      .attr("x",function(d,i){ 
        return (wtf.xPadding + xScale(d.start)) + (xScale(d.width)/7) 
      })
      .attr("y",function(d,i){ 
        return wtf.horizontalGridLines[i].y1 + gutterGrid/2 - wtf.fontSize + 2;
      })
      .attr("height",20)
      .attr("fill",function(d){
        return "white"
      })
      .attr("width",function(d){ 
        if(d.value > 0)
          return d.value.toString().length*11 
        else return d.value.toString().length*11
      });

  chart.svg.selectAll(".lblRect")
    .data(wtf.series)
    .enter().append("text")
    .attr("class","rectLabel")
    .attr("x",function(d,i){ 
      if(d.value<0){
        return wtf.xPadding + xScale(d.start) + d.value.toString().length*2+2;
      }else{
        return wtf.xPadding + xScale(d.start)+d.value.toString().length+2;
      }
    })
    .attr("dx",2)
    .attr("y",function(d,i){ 
      return wtf.horizontalGridLines[i].y1 + gutterGrid/2+wtf.fontSize;
    })
    .text(function(d){return formatValue(d.value)})

  //
  // the waterfall connectors between the rectangles
  //
  // chart.svg.selectAll(".connectors")
  //   .data(wtf.series)
  //   .enter().append("line")
  //   .attr("class","connectors")
  //   .attr("x1",function(d,i){ 
  //     if(i == wtf.series.length -2){
  //       return wtf.xPadding + xScale(d.start) + wtf.axisWidth;
  //     }
  //     if(i == wtf.series.length-1){
  //       //return wtf.xPadding + xScale(d.start) + wtf.axisWidth + xScale(d.width)-1;  
  //     }else if(xScale(d.value)>0){
  //       return wtf.xPadding + xScale(d.start) + wtf.axisWidth + xScale(d.width)-1;  
  //     }else if(xScale(d.value)<0){
  //       return wtf.xPadding + xScale(d.start);  
  //     }
      
  //   })
  //   .attr("y1",function(d,i){ 
  //     if(i == 0) return 150
  //     if(i == wtf.series.length-1 || wtf.series.length - 2) return
  //     else return wtf.horizontalGridLines[i-1].y1 + wtf.rectGutter + 65;
  //   })
  //   .attr("x2",function(d,i){
  //     if(i == wtf.series.length -2){
  //       return wtf.xPadding + xScale(d.start) + wtf.axisWidth;
  //     }
  //     if(i == wtf.series.length-1){
  //       //return wtf.xPadding + xScale(d.start) + wtf.axisWidth + xScale(d.width)-1;  
  //     }else if(xScale(d.value)>0){
  //       return wtf.xPadding + xScale(d.start) + wtf.axisWidth + xScale(d.width)-1;  
  //     }else if(xScale(d.value)<0){
  //       return wtf.xPadding + xScale(d.start);  
  //     }
  //   })
  //   .attr("y2",function(d,i){ 
  //     if(i == 0) return 160  
  //     if(i == wtf.series.length -1 || wtf.series.length - 2)return
  //     else return wtf.horizontalGridLines[i-1].y1 + wtf.rectGutter + 75;
  //   })
  //   .attr("stroke-width",1.5)
  //   .attr("stroke","#D3D3D3")




  
  

}
  