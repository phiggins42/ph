define([
    "dojo/_base/declare",
    "dojox/charting/plot2d/Lines",
    "dojo/_base/lang",
    "dojox/charting/plot2d/common",
    "dojox/lang/functional",
     "dojox/lang/functional/reversed",
     "dojox/lang/utils",
     "dojox/gfx/fx",
     "dojo/_base/array"
], function(declare, Plot, lang, dc, df, dfr, du, fx, arr){

    return declare(Plot, {
        // summary: A Plot type that shades the difference between two series data points, treating one as "positive" and the other
        // as a "negative" (eg: revenue v. cost), when rev > cost, shading is green. otherwise, shading is red.
        
        constructor: function(chart, args){
            this.__positive = args.positive;
            this.__negative = args.negative;
        },
        
        
        render: function(dim, offsets){
            
            this._positive = this._negative = null;
            arr.forEach(this.chart.series, function(series){
                
                if(series.name == this.__positive){
                    this._positive = series;
                }else if(series.name == this.__negative){
                    this._negative = series;
                }
                
            }, this);
            

            if(!this._positive || !this._negative){ return; }
            
            var s = this.chart.surface;
            
            try{
                var hScaler = this._hAxis.getScaler(),
                    vScaler = this._vAxis.getScaler(),
                    ht = hScaler.scaler.getTransformerFromModel(hScaler),
                    vt = vScaler.scaler.getTransformerFromModel(vScaler),
                    ticks = this._hAxis.getTicks();
                    
                if(ticks){

                    dojo.forEach(ticks.major, function(tick, idx, ar){
                        
                        var color, p = this._positive.data[idx], n = this._negative.data[idx];
                        if(p > n){
                            color = "green"
                        }else if(p < n){
                            color = "red"
                        }
                        
                        console.log(p, n);
                        
                        if(color){
                            
                            var x = offsets.l + ht(tick.value);
                            var y1 = dim.height - offsets.b - vt(p),
                                y2 = dim.height - offsets.b - vt(n);
                                s.createLine({
                                    x1: x, x2: x, 
                                    y1: y1, y2: y2
                                }).setStroke({
                                    color: color
                                })
                            
                            
                            
                        }
                        
                       

                    }, this);
                }
            }catch(e){
                console.warn(e);
                // squelch
            }
            this.dirty = false;
            return this;    //  dojox.charting.plot2d.Grid
            
            
        }
        
        
    })
    
})