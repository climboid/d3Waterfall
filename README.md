D3 WATERFALL CHART
===================
You basically provide an object to the Waterfall function and it will spit out a waterfall chart.
Conf object is as below
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
        {'value':-1918},
        {'value':30},
        {'value':222},
        {'value':253},
        {'value':417},
        {'value':1440},
        {'value':-1918},
        {'value':30},
        {'value':222}
      ]
    }
  </code>
</pre>

#Todos
- Need to add support for labels on each row
