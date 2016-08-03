(function(exports) {

  function Color(r,g,b) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
  }
  Color.prototype = Object.prototype;
  Color.prototype.toString = function() {
    return JSON.stringify({ r: this.r, g: this.g, b: this.b });
  };
  exports.Color = Color;

  function HSVColor(h,s,v) {
    this.h = h || 0;
    this.s = s || 0;
    this.v = v || 0;
  }
  HSVColor.prototype = Object.prototype;
  HSVColor.prototype.toString = function() {
    return JSON.stringify({ h: this.h, s: this.s, v: this.v });
  };
  exports.HSVColor = HSVColor;

// r,g,b values are from 0 to 1
// h = [0,360], s = [0,1], v = [0,1]
//    if s == 0, then h = -1 (undefined)

Color.RGBtoHSV = function RGBtoHSV(r,g,b)
{
  if (typeof r == 'object') {
    var rgb = r;
    r = rgb.h;
    g = rgb.s;
    b = rgb.v;
  }
  var hsv = { h: 0, s: 0, v: 0 };
  var min, max, delta;

  min = Math.min(r, g, b);
  max = Math.max(r, g, b);
  hsv.v = max;

  var delta = max - min;

  if( max != 0 )
    hsv.s = delta / max;   // s
  else {
    // r = g = b = 0    // s = 0, v is undefined
    hsv.s = 0;
    hsv.h = -1;
    return hsv;
  }

  if( r == max )
    hsv.h = ( g - b ) / delta;   // between yellow & magenta
  else if( g == max )
    hsv.h = 2 + ( b - r ) / delta; // between cyan & yellow
  else
    hsv.h = 4 + ( r - g ) / delta; // between magenta & cyan

  hsv.h *= 60;       // degrees
  if( hsv.h < 0 )
    hsv.h += 360;

  return hsv;
}

Color.HSVtoRGB = function HSVtoRGB(h, s, v)
{
  if (typeof h == 'object') {
    var hsv = h;
    h = hsv.h;
    s = hsv.s;
    v = hsv.v;
  }
  var rgb = new Color(0,0,0);
  var i;
  var f, p, q, t;

  if( s == 0 ) {
    // achromatic (grey)
    rgb.r = rgb.g = rgb.b = v;
    return rgb;
  }

  h /= 60;      // sector 0 to 5
  i = Math.floor( h );
  f = h - i;      // factorial part of h
  p = v * ( 1 - s );
  q = v * ( 1 - s * f );
  t = v * ( 1 - s * ( 1 - f ) );

  switch( i ) {
    case 0:
      rgb.r = v;
      rgb.g = t;
      rgb.b = p;
      break;
    case 1:
      rgb.r = q;
      rgb.g = v;
      rgb.b = p;
      break;
    case 2:
      rgb.r = p;
      rgb.g = v;
      rgb.b = t;
      break;
    case 3:
      rgb.r = p;
      rgb.g = q;
      rgb.b = v;
      break;
    case 4:
      rgb.r = t;
      rgb.g = p;
      rgb.b = v;
      break;
    default:    // case 5:
      rgb.r = v;
      rgb.g = p;
      rgb.b = q;
      break;
  }
  return rgb;
}


})(window);
