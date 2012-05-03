define(["dojo", "dojox/charting/plot2d/default"], function(dojo, def){
   
   return dojo.declare(def, {
       
       showAxisLine: true, 
       
       formatter: function(idx, chart){
           
       },
       
       constructor: function(chart, args){
           dojo.mixin(this, args);
           this._connects = [
                dojo.connect(chart.node, "onmouseenter", this, "_enter"),
                dojo.connect(chart.node, "onmouseleave", this, "_leave")
           ];
       },
       
       _enter: function(e){
           console.log("mouse enter");
           if(this._moving){ dojo.disconnect(this._moving); }
           this._moving = dojo.connect(this.chart.node, "onmousemove", this, "_mover");
       },
       
       _mover: function(e){
           console.log("mouse moving...");
           if(this.showAxisLine){
               
           }
       },
       
       _leave: function(e){
           console.log("mouse leave");
           dojo.disconnect(this._moving);
       },
       
       render: function(dim, offsets){
           console.log("renderme");
           if(this.showAxisLine){
               
               
               
               
               
           }
       },
       
       _showTooltip: function(idx){
           
           
           
           
       }

   });
    
});