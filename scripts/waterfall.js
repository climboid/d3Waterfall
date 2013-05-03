function createWaterfall(wtf){
  var chart = {},
      chart_width = wtf.width,
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
  
  wtf.startX = 1;
  wtf.xPadding = wtf.width/2;
  wtf.chartStartY = 80;
  wtf.chartEndY = 525;
  wtf.waterfallChartWidth = wtf.width/2.5;
  wtf.axisWidth = 1;
  wtf.rectGutter = 5;

  if(!wtf.colors){
    wtf.colors["#C4322E","steelblue","rgb(204,204,204)"]
  }

  if(!wtf.connectorColor){
    wtf.connectorColor = "#d3d3d3";
  }
  

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
      if(i==wtf.series.length - 1 && d.value > 0){
        return wtf.xPadding + xScale(0) + wtf.axisWidth;
      }else if(i == wtf.series.length - 1 && d.value < 0){
        return wtf.xPadding + xScale(0) - xScale(d.width) - wtf.axisWidth;
      }
      return wtf.xPadding + xScale(d.start) 
    })
    .attr("y",function(d,i){ 
      return wtf.horizontalGridLines[i].y1 + wtf.rectGutter;
    })
    .attr("width",function(d){ 
      return xScale(d.width) 
    })
    .attr("fill",function(d,i){
      if(i == wtf.series.length -1) return wtf.colors[2]; //first and last bars are gray
      if(d.value < 0) return wtf.colors[0];
      else return wtf.colors[1];

    })
    .attr("height",function(d){
      d.rectH = gutterGrid- wtf.rectGutter*2;
      return d.rectH;
    })
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
        var xPos;
        if(i== wtf.series.length - 1 && d.value > 0){
          xPos = wtf.xPadding + xScale(0)+ wtf.axisWidth + 2;
        }else if( i == wtf.series.length - 1 && d.value < 0){
          xPos = wtf.xPadding + xScale(0) - xScale(d.width) - wtf.axisWidth;
        }else{
          xPos = (wtf.xPadding + xScale(d.start)) + (xScale(d.width)/7);
        }
        d.xPos = xPos;
        return xPos;
      })
      .attr("y",function(d,i){ 
        var yPos = wtf.horizontalGridLines[i].y1 + gutterGrid/2 - wtf.fontSize + 2;
        d.yPos = yPos;
        return yPos;
      })
      .attr("height",function(){
        if((wtf.height/wtf.series.length)/4 < 9) return 12;
        else return (wtf.height/wtf.series.length)/4
      })
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
    .attr("x",function(d,i){ 
      return d.xPos+2;
    })
    .attr("dx",2)
    .style("font-size",function(d){
      var fSize;
      if((wtf.height/wtf.series.length)/4 < 9) fSize = 10;
      else fSize = (wtf.height/wtf.series.length)/4;
      if(fSize > 24) fSize = 24 //caps the font at 24
      d.fSize = fSize;
      return fSize;
    })
    .attr("y",function(d,i){
      if(d.fSize == 10) return d.yPos + d.fSize;
      else
        return d.yPos + d.fSize-3;
      
    })
    .text(function(d){return formatValue(d.value)})

  //
  // the waterfall connectors between the rectangles
  //
  chart.svg.selectAll(".connectors")
    .data(wtf.series)
    .enter().append("line")
    .attr("class","connectors")
    .attr("x1",function(d,i){ 
      if(i == wtf.series.length -1 || i == wtf.series.length - 2) return;
      if(d.value<0) return wtf.xPadding + xScale(d.start);
      return wtf.xPadding + xScale(d.start) + xScale(d.width);
    })
    .attr("y1",function(d,i){ 
      if(i == wtf.series.length -1 || i == wtf.series.length - 2) return;
      return wtf.horizontalGridLines[i+1].y1 - wtf.rectGutter;
    })
    .attr("x2",function(d,i){
      if(i == wtf.series.length -1 || i == wtf.series.length - 2) return;
      if(d.value<0) return wtf.xPadding + xScale(d.start);
     return wtf.xPadding + xScale(d.start) + xScale(d.width);
    })
    .attr("y2",function(d,i){ 
      if(i == wtf.series.length -1 || i == wtf.series.length - 2) return;
      return wtf.horizontalGridLines[i+1].y1 + wtf.rectGutter;
    })
    .attr("stroke-width",1.5)
    .attr("stroke",wtf.connectorColor)




  
  

}
  