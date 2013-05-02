function createWaterfallSlideTitles(obj){
  var chart = {},
      chart_width = 1024,
      chart_height= 150;
  //
  //create the SVG container for the titles(s)
  //

  chart.svg = d3.select('#'+obj.container)
      .append("svg")
      .attr("width", chart_width)
      .attr("height", chart_height);

  //
  // add the slide titles
  //

  if(obj.title1){
    chart.svg.append("text")
      .attr("x",0)
      .attr("y",20)
      .attr("class","firstHeader")
      .text(obj.title1);    
  }

  if(obj.title2){
    chart.svg.append("text")
      .attr("x",0)
      .attr("y",52)
      .attr("class","secondHeader")
      .text(obj.title2);  
  }

  if(obj.title3){
    chart.svg.append("text")
      .attr("x",0)
      .attr("y",80)
      .attr("class","firstHeader")
      .text(obj.title3);  
  }

  if(obj.title4){
    chart.svg.append("text")
      .attr("x",0)
      .attr("y",112)
      .attr("class","secondHeader")
      .text(obj.title4);
  }
}

//
//
// the waterfall chart
//
//

function createWaterfall(wtf){
  var chart = {},
      chart_width = wtf.pills ? 565 : 440,
      chart_height= 768;
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

  if(wtf.pills){
    wtf.startX = 135;
    wtf.endX = 540;
    wtf.endChartX = 540;
  }else{
    wtf.startX = 10;
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
  // pills
  //


  if(wtf.pills){
    chart.svg.selectAll(".chartLbl")
      .data(wtf.pills)
      .enter().append("rect")
      .attr("class","chartLbl")
      .attr("x",wtf.startX - 90)
      .attr("y",function(d){ return d.y})
      .attr("width",100)
      .attr("height",50)
      .attr("rx",7)
      .attr("ry",7);

    chart.svg.selectAll(".chartContainerTitleTxt")
      .data(wtf.pills)
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

  if(wtf.yAxisLabel){
    chart.svg.append("text")
      .attr("x",10)
      .attr("y",400)
      .attr("class","verticalLabel")
      .attr("transform","rotate(270 20,400)")
      .text("Diffferences in ... 2")  
  }
  
  //
  // chart container
  //


  chart.svg.selectAll(".chartContainer")
    .data(wtf.chartContainerTitles)
    .enter().append("rect")
    .attr("class","chartContainer")
    .attr("x",wtf.startX)
    .attr("y",0)
    .attr("width",wtf.endX - 115)
    .attr("height",wtf.endX + 10)
    .attr("rx",wtf.borderRadius)
    .attr("ry",wtf.borderRadius);

  chart.svg.selectAll(".chartContainerTitleBG")
    .data(wtf.chartContainerTitles)
    .enter().append("rect")
    .attr("class","chartContainerTitleBG")
    .attr("x",wtf.startX)
    .attr("y",0)
    .attr("width",wtf.endX - 115)
    .attr("height",80)
    .attr("rx",wtf.borderRadius)
    .attr("ry",wtf.borderRadius);

  chart.svg.selectAll(".chartTitles")
    .data(wtf.chartContainerTitles)
    .enter().append("text")
    .attr("x",wtf.startX +15)
    .attr("y",30)
    .attr("class","chartContainerTitleTxt")
      .append("tspan")
      .attr("x",wtf.startX + 15)
      .attr("y",30)
      .text(function(d){return d.title})
      .append("tspan")
      .attr("x",wtf.startX + 15)
      .attr("y",55)
      .text(function(d){return d.title2});

  //
  // this background is needed in order to slice the 
  // bottom rounded corners of bot the title
  // and the pills
  //
  // left chart white background
  if(wtf.chartContainerTitles){
    chart.svg.selectAll(".chartContainerBG")
      .data(wtf.chartContainerTitles)
      .enter().append("rect")
      .attr("x",wtf.startX + 1) 
      .attr("y",70)
      .attr("width",wtf.endX - 117) 
      .attr("height",wtf.endX - 100)
      .attr("class","chartContainerBG");  
  }
  

  //
  // inner chart pills
  //

  if(wtf.innerChartPills){
    chart.svg.selectAll(".innerPills")
      .data(wtf.innerChartPills)
      .enter().append("rect")
      .attr("class","chartLbl")
      .attr("x",wtf.startX + 10)
      .attr("y",function(d){return d.y})
      .attr("width",100)
      .attr("height",50)
      .attr("rx",7)
      .attr("ry",7);

    chart.svg.selectAll(".chartLblTxt")
      .data(wtf.innerChartPills)
      .enter().append("text")
      .attr("class","chartLblTxt")
      .attr("x",wtf.startX + 15)
      .attr("y",function(d){return d.y + 30})
      .attr("dx",function(d){return d.dx})
      .text(function(d){return d.name}); 
  }
  


  //
  //horizontal grid lines
  //

  if(wtf.horizontalGridLines){
    //create the grids

    wtf.horizontalGridLines = [
      {"x1":wtf.startX + 10, "y1":155, "x2":wtf.startX+415, "y2":155},
      {"x1":wtf.startX + 10, "y1":230, "x2":wtf.startX+415, "y2":230},
      {"x1":wtf.startX + 10, "y1":305, "x2":wtf.startX+415, "y2":305},
      {"x1":wtf.startX + 10, "y1":380, "x2":wtf.startX+415, "y2":380},
      {"x1":wtf.startX + 10, "y1":455, "x2":wtf.startX+415, "y2":455}
    ];
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
    .attr("y1",wtf.chartStartY)
    .attr("x2",function(d){return xScale(d)+wtf.xPadding})
    .style("stroke","#000")
    .style("stroke-width",wtf.axisWidth)
    .attr("y2",wtf.chartEndY+wtf.rectGutter)

  //
  // the waterfall rectangles
  //
  chart.svg.selectAll(".waterfallRect")
    .data(wtf.series)
    .enter().append("rect")
    .attr("x",function(d,i){ 
      if(i == wtf.series.length-1 || i == 0){
        var val = xScale(d.start)
        if(val > 0) return wtf.xPadding + wtf.axisWidth + xScale(0);
        else return wtf.xPadding + wtf.axisWidth + xScale(0) - xScale(d.start);
      } 
      
      return wtf.xPadding + xScale(d.start) 
    })
    .attr("y",function(d,i){ 
      if(i == 0) return wtf.chartStartY + wtf.rectGutter;
      else return wtf.horizontalGridLines[i-1].y1 + wtf.rectGutter;
    })
    .attr("width",function(d){ return xScale(d.width) })
    .attr("fill",function(d,i){
      if(i == wtf.series.length -1 || i == 0) return "#CCCCCC"; //first and last bars are gray
      if(d.value < 0) return "#C4322E";
      else return "#1E9E53";

    })
    .attr("height",65)
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
        //handle first and last
        if(i == wtf.series.length-1 || i == 0){
          var val = xScale(d.start)
          if(val > 0) return wtf.xPadding + wtf.axisWidth + xScale(0);
          else return wtf.xPadding + wtf.axisWidth + xScale(0) - xScale(d.start);
        }
        return (wtf.xPadding + xScale(d.start)) + (xScale(d.width)/7) 
      })
      .attr("y",function(d,i){ 
        if(i == 0) return wtf.chartStartY + wtf.rectGutter*5;
        else return wtf.horizontalGridLines[i-1].y1 + wtf.rectGutter*5;
      })
      .attr("height",20)
      .attr("fill",function(d){
        return "white"
      })
      .attr("width",function(d){ 
        if(d.value > 0)
          return d.value.toString().length*10 
        else return d.value.toString().length*10
      });

  chart.svg.selectAll(".lblRect")
    .data(wtf.series)
    .enter().append("text")
    .text(function(d){return formatValue(d.value)})
    .attr("class","rectLabel")
    .attr("x",function(d,i){ 
      if(i == wtf.series.length-1 || i == 0){
        var val = xScale(d.start)
        if(val > 0) return wtf.xPadding + wtf.axisWidth + xScale(0);
        else return wtf.xPadding + wtf.axisWidth + xScale(0) - xScale(d.start);
      }else if(d.value<0){
        return wtf.xPadding + xScale(d.start) + d.value.toString().length*2;
      }else{
        return wtf.xPadding + xScale(d.start)+d.value.toString().length;
      }
        

    })
    .attr("dx",2)
    .attr("y",function(d,i){ 
      if(i == 0) return wtf.chartStartY + wtf.rectGutter*8;
      else return wtf.horizontalGridLines[i-1].y1 + wtf.rectGutter*8;
    })

  //
  // the waterfall connectors between the rectangles
  //
  chart.svg.selectAll(".connectors")
    .data(wtf.series)
    .enter().append("line")
    .attr("class","connectors")
    .attr("x1",function(d,i){ 
      if(i == wtf.series.length -2){
        return wtf.xPadding + xScale(d.start) + wtf.axisWidth;
      }
      if(i == wtf.series.length-1){
        //return wtf.xPadding + xScale(d.start) + wtf.axisWidth + xScale(d.width)-1;  
      }else if(xScale(d.value)>0){
        return wtf.xPadding + xScale(d.start) + wtf.axisWidth + xScale(d.width)-1;  
      }else if(xScale(d.value)<0){
        return wtf.xPadding + xScale(d.start);  
      }
      
    })
    .attr("y1",function(d,i){ 
      if(i == 0) return 150
      if(i == wtf.series.length-1 || wtf.series.length - 2) return
      else return wtf.horizontalGridLines[i-1].y1 + wtf.rectGutter + 65;
    })
    .attr("x2",function(d,i){
      if(i == wtf.series.length -2){
        return wtf.xPadding + xScale(d.start) + wtf.axisWidth;
      }
      if(i == wtf.series.length-1){
        //return wtf.xPadding + xScale(d.start) + wtf.axisWidth + xScale(d.width)-1;  
      }else if(xScale(d.value)>0){
        return wtf.xPadding + xScale(d.start) + wtf.axisWidth + xScale(d.width)-1;  
      }else if(xScale(d.value)<0){
        return wtf.xPadding + xScale(d.start);  
      }
    })
    .attr("y2",function(d,i){ 
      if(i == 0) return 160  
      if(i == wtf.series.length -1 || wtf.series.length - 2)return
      else return wtf.horizontalGridLines[i-1].y1 + wtf.rectGutter + 75;
    })
    .attr("stroke-width",1.5)
    .attr("stroke","#D3D3D3")




  //
  // acum potato with bezier curves
  //

  if(wtf.beziers){

    wtf.beziers = [
      {"x1":wtf.endChartX - 120, "x2":wtf.endChartX - 110, "y1":155, "y2":160},
      {"x1":wtf.endChartX - 110, "x2":wtf.endChartX - 110, "y1":160, "y2":300},
      {"x1":wtf.endChartX - 110, "x2":wtf.endChartX - 100, "y1":300, "y2":305},
      {"x1":wtf.endChartX - 100, "x2":wtf.endChartX - 110, "y1":305, "y2":310},
      {"x1":wtf.endChartX - 110, "x2":wtf.endChartX - 110, "y1":310, "y2":450},
      {"x1":wtf.endChartX - 110, "x2":wtf.endChartX - 120, "y1":450, "y2":455}
    ]
    chart.svg.selectAll(".curve")
      .data(wtf.beziers)
      .enter().append("line")
      .attr("class","curve")
      .attr("x1",function(d){ return d.x1 })
      .attr("x2",function(d){ return d.x2 })
      .attr("y1",function(d){ return d.y1 })
      .attr("y2",function(d){ return d.y2 })



    // get the value for the potato
    var sumOfData = [];
    for(var i=1; i<wtf.series.length-1; i++){ sumOfData.push(wtf.series[i]) };
    sumOfData = d3.sum(sumOfData, function(d) { return d.value });

    //potato
    chart.svg.append("ellipse")
      .attr("cx",wtf.startX + 360)
      .attr("cy",(wtf.chartEndY - wtf.chartStartY*2.8))
      .attr("rx",50)
      .attr("ry",25)
      .style("fill", function(){ 
        return sumOfData > 0 ? "#1e9e53" : "#c4322e" 
      });

    // potato value
    chart.svg.append("text")
      .attr("x",function(){
        var v = sumOfData.toString()
        return v.length > 3 ? wtf.startX + 315 : wtf.startX +  340;
      })
      .attr("y",(wtf.chartEndY - wtf.chartStartY*2.7))
      .attr("class","potatoValue")
      .text(function(){return sumOfData > 0 ? "+ "+formatValue(sumOfData) : "- "+Math.abs(formatValue(sumOfData))})

    // potato title
    chart.svg.append("text")
      .attr("x",wtf.startX + 320)
      .attr("y",(wtf.chartEndY - wtf.chartStartY*2.2))
      .attr("class","potatoTitle")
      .append("tspan")
      .attr("x",wtf.startX + 320)
      .attr("y",(wtf.chartEndY - wtf.chartStartY*2.2))
      .text(wtf.potatoLbl[0])
      .append("tspan")
      .attr("x",wtf.startX + 320)
      .attr("y",(wtf.chartEndY - wtf.chartStartY*1.9))
      .text(wtf.potatoLbl[1]); 
  }
  

}
  