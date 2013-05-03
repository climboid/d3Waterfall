D3 WATERFALL CHART
===================
<p>v.0.0.1</p>
<p>
You basically provide an object to the Waterfall function and it will spit out a waterfall chart.
You will need a container in you HTML which ID matches the container property of the config object like so
</p>
<pre>
  <code>
    &lsaquo;body&rsaquo;
       &lsaquo;div id="chart"&rsaquo; &lsaquo;/div&rsaquo;
       &lsaquo;script src="libs/d3.v3.min.js"&rsaquo; &lsaquo;/script&rsaquo;
     &lsaquo;/body&rsaquo;
  </code>
</pre>
Once the HTML is set you create the config object as follows
<pre>
  <code>
  var waterfall = {
      container:'chart',
      width:400,
      height:800,
      fontSize:10,
      borderRadius:5,
      horizontalGridLines:true,
      series:[
        {'value':253},
        {'value':417},
        {'value':1440},
        .
        .
        .
        .
      ]
    }
  </code>
</pre>

After creating the conf object you simply pass it as a parameter to createWaterfall() function like so

<pre>
  <code>
    createWaterfall(waterfall);
  </code>
</pre>

#Todos
- Need to add support for labels on each row
- Need to add connectors
- Add config for colors
- Add config for format
- Add config for horizontal display
- Add config for animation
