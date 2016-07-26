(function(exports) {

  function Strip(nodes) {
    this._leds = [];
    for(var i=0; nodes && i<nodes.length; i++) {
      this._leds[i] = new LED(nodes[i]);
    }
    this.length = this._leds.length;
  }
  Strip.prototype.setPixelColor = function(i, color) {
    this._leds[i].setColor(color);
  }

  function Color(r,g,b) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
  }
  Color.prototype = Object.prototype;
  Color.prototype.toString = function() {
    return JSON.stringify({ r: this.r, g: this.g, b: this.b });
  };

  function LED(node) {
    this._r = 0;
    this._g = 0;
    this._b = 0;
    if (node && node.getContext) {
      this.node = node;
      this.context = node.getContext('2d');
    }
  }
  LED.prototype.setColor = function(r,g,b) {
    if (typeof r == 'object') {
      var color = r;
      this._r = color.r;
      this._g = color.g;
      this._b = color.b;
    } else {
      this._r = r;
      this._g = g;
      this._b = b;
    }
    if (this.node && this.context) {
      var colorStr = 'rgb('+this._r.toFixed(0)+','+this._g.toFixed(0)+','+this._b.toFixed(0)+')';
      // console.log('setColor: ', colorStr);
      this.context.fillStyle = colorStr;
      this.context.fillRect(0,0, this.node.width, this.node.height);
    } else if(this.node) {
      var colorStr = 'rgb('+this._r.toFixed(0)+','+this._g.toFixed(0)+','+this._b.toFixed(0)+')';
      // console.log('setColor: ', colorStr);
      this.node.style.backgroundColor = colorStr;
    }
  }
  exports.Strip = Strip;
  exports.LED = LED;

})(window);
