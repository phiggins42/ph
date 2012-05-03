define([
    "dojo/_base/declare",
    "dojox/charting/plot2d/Columns",
    "dojo/_base/lang",
    "dojox/charting/plot2d/common",
    "dojox/lang/functional",
     "dojox/lang/functional/reversed",
     "dojox/lang/utils",
     "dojox/gfx/fx",
     "dojo/_base/array"
], function(declare, Plot, lang, dc, df, dfr, du, fx, arr){
    
    var purgeGroup = dfr.lambda("item.purgeGroup()");

    return declare(Plot, {
        
        render: function(dim, offsets){
			//	summary:
			//		Run the calculations for any axes for this plot.
			//	dim: Object
			//		An object in the form of { width, height }
			//	offsets: Object
			//		An object of the form { l, r, t, b}.
			//	returns: dojox.charting.plot2d.Columns
			//		A reference to this plot for functional chaining.
			if(this.zoom && !this.isDataDirty()){
				return this.performZoom(dim, offsets);
			}
			// TODO do we need to call this? This is not done in Bars.js
			this.getSeriesStats();
			this.resetEvents();
			this.dirty = this.isDirty();
			var s;
			if(this.dirty){
				arr.forEach(this.series, purgeGroup);
				this._eventSeries = {};
				this.cleanGroup();
				s = this.group;
				df.forEachRev(this.series, function(item){ item.cleanGroup(s); });
			}
			var t = this.chart.theme, f, gap, width,
				ht = this._hScaler.scaler.getTransformerFromModel(this._hScaler),
				vt = this._vScaler.scaler.getTransformerFromModel(this._vScaler),
				baseline = Math.max(0, this._vScaler.bounds.lower),
				baselineHeight = vt(baseline),
				min = Math.max(0, Math.floor(this._hScaler.bounds.from - 1)), max = Math.ceil(this._hScaler.bounds.to),
				events = this.events();
			f = dc.calculateBarSize(this._hScaler.bounds.scale, this.opt);
			gap = f.gap;
			width = f.size;
			for(var i = this.series.length - 1; i >= 0; --i){
				var run = this.series[i];
				if(!this.dirty && !run.dirty){
					t.skip();
					this._reconnectEvents(run.name);
					continue;
				}
				run.cleanGroup();
//				if(this.opt.enableCache){
//					run._rectFreePool = (run._rectFreePool?run._rectFreePool:[]).concat(run._rectUsePool?run._rectUsePool:[]);
//					run._rectUsePool = [];
//				}
				var theme = t.next("column", [this.opt, run]),
					eventSeries = new Array(run.data.length);
				s = run.group;
				var l = Math.min(run.data.length, max);
				for(var j = min; j < l; ++j){
					var value = run.data[j];
					if(value !== null){
						var v = typeof value == "number" ? value : value.y,
							vv = vt(v),
							height = vv - baselineHeight,
							h = Math.abs(height), finalTheme;
						if(this.opt.styleFunc || typeof value != "number"){
							var tMixin = typeof value != "number" ? [value] : [];
							if(this.opt.styleFunc){
								tMixin.push(this.opt.styleFunc(value));
							}
							finalTheme = t.addMixin(theme, "column", tMixin, true);
						}else{
							finalTheme = t.post(theme, "column");
						}
						if(width >= 1 && h >= 0){
						    
						    var x1 = offsets.l + ht(j + 0.5) + gap,
						        y1 = dim.height - offsets.b - (v > baseline ? vv : baselineHeight)
                            ;

						    var shape = s.createLine({
						        x1: x1,
						        x2: x1 + width,
						        y1: y1, y2: y1
						    }).setStroke(finalTheme.series.stroke);
						    
//							var rect = {
//								x: offsets.l + ht(j + 0.5) + gap,
//								y: dim.height - offsets.b - (v > baseline ? vv : baselineHeight),
//								width: width, height: h
//							};
//							var sshape;
//							if(finalTheme.series.shadow){
//								var srect = lang.clone(rect);
//								srect.x += finalTheme.series.shadow.dx;
//								srect.y += finalTheme.series.shadow.dy;
//								sshape = this.createRect(run, s,  srect).setFill(finalTheme.series.shadow.color).setStroke(finalTheme.series.shadow);
//								if(this.animate){
//									this._animateColumn(sshape, dim.height - offsets.b + baselineHeight, h);
//								}
//							}
//							var specialFill = this._plotFill(finalTheme.series.fill, dim, offsets);
//							specialFill = this._shapeFill(specialFill, rect);
//							var shape = this.createRect(run, s, rect).setFill(specialFill).setStroke(finalTheme.series.stroke);
							run.dyn.fill   = shape.getFill();
							run.dyn.stroke = shape.getStroke();
							if(events){
								var o = {
									element: "column",
									index:   j,
									run:     run,
									shape:   shape,
									shadow:  sshape,
									x:       j + 0.5,
									y:       v
								};
								this._connectEvents(o);
								eventSeries[j] = o;
							}
						}
					}
				}
				this._eventSeries[run.name] = eventSeries;
				run.dirty = false;
			}
			this.dirty = false;
			return this;
		} 
		
    });
    
});