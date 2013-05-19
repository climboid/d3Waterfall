d3.createWaterfall = function(wtf){
  var svg = {},
      xScale,
      formatValue = d3.format(","),
      horizontalGridLines = [],
      gutterGrid,
      data = [],
      init = function(){
        
        makeScale();
        buildObject();
        makeContainerAndGrids();
        makeRectangles();
      }

  return init();

  function makeScale(){
    var max = 0, min = 0, temp = 0;
    for(var j=0; j<wtf.series.length; j++){
      temp+=wtf.series[j].value;
      if(temp<min) min = temp;
      if(temp>max) max = temp;
    }

     xScale = d3.scale.linear().domain([min,max]).range([wtf.xPadding,wtf.width-wtf.xPadding]);
  }

  function buildObject(){
    //the following is used to calculate the domain correctly
    for(var j=0, jj=wtf.series.length; j<jj; j+=1){
      data.push(wtf.series[j]);
    }
    var acum = 0;

    for(var i=0; i<data.length; i++) {
      if(data[i].value<0){
        //if I have a negative element before me
        //start from where it started not from where it ended so change acum
        data[i]['start'] = acum + data[i].value;
      }else{
        data[i]['start'] = acum;
      }
      data[i]['width'] = Math.abs(data[i].value); 
      acum+=data[i].value;
    }

  }


  function makeContainerAndGrids(){
    svg = d3.select('#'+wtf.container)
      .append("svg")
      .attr("width", wtf.width)
      .attr("height", wtf.height); 


    //create the grids
    gutterGrid = wtf.height/wtf.series.length;
    
    for(var k=0; k<data.length+1; k++){
      var obj = {"x1":wtf.xPadding+10,"y1":gutterGrid*k, "x2":wtf.width-5,"y2":gutterGrid*k}
      horizontalGridLines.push(obj);
    }

    svg.selectAll(".gridLine")
      .data(horizontalGridLines)
      .enter().append("line")
      .attr("class","gridLine")
      .attr("stroke-dasharray","3, 4")
      .attr("x1",function(d){ return wtf.xPadding })
      .attr("y1",function(d,i){ return gutterGrid*i })
      .attr("x2",function(d){ return wtf.width - wtf.xPadding })
      .attr("y2",function(d,i){ return gutterGrid*i });

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
    .attr("x",function(d,i){ 
      if(i==data.length - 1 && d.value > 0){
        return xScale(0) + wtf.axis.width;
      }else if(i == data.length - 1 && d.value < 0){
        return xScale(0) - xScale(d.width) - wtf.axis.width;
      }
      return xScale(d.start) 
    })
    .attr("y",function(d,i){ 
      return horizontalGridLines[i].y1 + wtf.gutter;
    })
    .attr("width",function(d){ 
      return xScale(d.width) 
    })
    .attr("fill",function(d,i){
      if(i == data.length -1) return wtf.colors.sum; //first and last bars are gray
      if(d.value < 0) return wtf.colors.negative;
      else return wtf.colors.positive;

    })
    .attr("height",function(d){
      d.rectH = gutterGrid- wtf.gutter*2;
      return d.rectH;
    })
    .attr("class","waterfallRect");  
  }


}
  