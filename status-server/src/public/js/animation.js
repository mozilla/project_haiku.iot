function sampleColorAtTime(keyFrames, elapsedTime, duration) {
  // elapsed time as a %age of total duration
  var progress = elapsedTime/duration * 100;
  var currKeyFrame, nextKeyFrame;
  var currKeyFramePcent, nextKeyFramePcent;
  var pcent;
  for(var name in keyFrames) {
    pcent = parseFloat(name);
    if (pcent <= progress) {
      currKeyFrame = name;
      currKeyFramePcent = pcent;
      continue;
    }
    if (pcent > progress) {
      nextKeyFrame = name;
      nextKeyFramePcent = pcent;
      break;
    }
  }
  // console.log("curr %s, next: %s", currKeyFramePcent, nextKeyFramePcent);
  var elapsedKeyFrameTime = elapsedTime;
  var keyFrameDuration = duration * (nextKeyFramePcent - currKeyFramePcent)/100;
  // figure out time elapsed since the last keyframe
  if (currKeyFramePcent) {
    elapsedKeyFrameTime -= (duration * currKeyFramePcent/100);
  }
  elapsedKeyFrameTime = clamp(elapsedKeyFrameTime, 0, keyFrameDuration);
  // console.log("elapsedKeyFrameTime:", elapsedKeyFrameTime);

  var startColor = keyFrames[currKeyFrame];
  var endColor = keyFrames[nextKeyFrame];
  if (!startColor) {
    throw new Error('missing startColor at frame: '+ currKeyFrame + ', progress: ' + progress);
  }
  if (!endColor) {
    throw new Error('missing endColor at frame: '+ nextKeyFrame + ', progress: ' + progress);
  }

  var easedProgress = gAnimateState.easingFn(elapsedKeyFrameTime, 0, 1, keyFrameDuration);
  var easedRGB = vectorLerp(
    startColor,
    endColor,
    clamp(easedProgress, 0, 1)
  );
  return easedRGB;
}

// the animation-specific update function
function allOff(delta) {
  var offColor = new Color(0,0,41);
  for(var i=0; i<gAnimateState.pixels.length; i++) {
    gAnimateState.pixels[i].color = offColor;
  }
  // just a single frame animation
  gAnimateState.stopped = 1;
}

function getNearestPixelsIndices(count) {
  var sign = 1;
  var currIndex = gAnimateState.currPixelIndex || 0;
  var distance = 0;
  var nearestIndices = [];
  count = Math.min(count, gPixels.length);
  for(var i=0; i<count; i++) {
    nearestIndices.push(wrap(currIndex + distance, gPixels.length));
    if (distance >= 0) {
      distance++;
    }
    distance *= -1;
  }
  return nearestIndices;
}
// the animation-specific, key-frame example of an update function
function linearKeyFrameAnimation(delta) {
  gAnimateState.elapsedTime += delta;
  if (gAnimateState.elapsedTime >= gAnimateState.duration) {
    return;
  }
  var elapsedTime = clamp(gAnimateState.elapsedTime, 0, gAnimateState.duration);

  // animate which pixels?
  // var pixelIndices = getNearestPixelsIndices(gAnimateState.pixelCount || 1);
  var pixels = gAnimateState.pixels;
  var currPixelIndex = clamp(gAnimateState.currPixelIndex, 0, pixels.length-1);
  // each pixel is offset by some number of ms
  var pixelTimeOffset = gAnimateState.pixelTimeOffset; // ms;
  pixels.forEach((pixel, i) => {
    var idx = pixel.index;
    var distance = 1+Math.abs(idx - currPixelIndex);
    var sign = idx >= currPixelIndex ? 1 : -1;
    var timeOffset = distance * sign * pixelTimeOffset;
    var elapsedTime = wrap(gAnimateState.elapsedTime + timeOffset, gAnimateState.duration);
    var color = sampleColorAtTime(gAnimateState.keyFrames,
                                  elapsedTime,
                                  gAnimateState.duration);
    pixel.color = color;
    // just capture for the current/center pixel
    if (i === 0) {
      gAnimateState.steps.push({
        time: elapsedTime,
        color: color
      });
    }
  });
}

var gAnimateStateDefaults = {
  startTime: 0,
  prevTime: 0,
  elapsedTime: 0,
  duration: 1000,
  currColor: new Color(0,0,0),
  currPixelIndex: 2,
  direction: 1,
  pixelTimeOffset: 100,
  easingFn: easeInOutQuad
};
var gAnimateState = null;

// the animation loop
function createAnimation(animName, config) {
  var animateState = Object.create(gAnimateStateDefaults);
  animateState.prevTime = animateState.startTime = Date.now();
  animateState.steps = [];
  switch (animName) {
    case 'allOff':
      animateState.updateFn = allOff;
      break;
    case 'breathe':
      animateState.updateFn = linearKeyFrameAnimation;
      animateState.keyFrames = {
        '0%': new Color(0,0,0),
        '30%': new Color(0,103,32),
        '50%': new Color(0,0,0),
        '80%': new Color(0,103,32),
        '100%': new Color(0,0,0)
      };
      animateState.currKeyFrame = '0%';
      animateState.pixelTimeOffset = 0;
      animateState.duration = 8000;
      break;
    case 'rainbow':
      animateState.updateFn = linearKeyFrameAnimation;
      animateState.keyFrames = {
        '0%': new Color(238, 130, 238),
        '14.3%': new Color(255, 0, 0),
        '28.6%': new Color(255, 165, 0),
        '42.9%': new Color(255, 255, 0),
        '57.1%': new Color(0, 128, 0),
        '71.4%': new Color(0, 0, 255),
        '85.7%': new Color(75, 0, 130),
        '100%': new Color(238, 130, 238)
      };
      animateState.currKeyFrame = '0%';
      animateState.duration = 2000;
      // animateState.frameIntervalTime = 2000/8;
      break;
    case 'onOff':
      // TODO: need different treatment to animate out from a point
      // rather than cycle linearly across the strip of pixel
      animateState.updateFn = linearKeyFrameAnimation;
      animateState.keyFrames = {
        '0%': new Color(0, 0, 0),
        '50%': new Color(0, 0, 255),
        '100%': new Color(0, 0, 0)
      };
      animateState.currKeyFrame = '0%';
      animateState.duration = 1000;
      break;
    case 'hueHighlight':
      animateState.updateFn = linearKeyFrameAnimation;
      animateState.easingFn = easeLinear;
      animateState.keyFrames = {
        '0%': new HSVColor(150, 1, 255),
        '20%': new HSVColor(180, 1, 255),
        '40%': new HSVColor(255, 1, 255),
        '60%': new HSVColor(255, 0.5, 255),
        '80%': new HSVColor(255, 1, 255),
        '100%': new HSVColor(150, 0.5, 255)
      };
      animateState.currKeyFrame = '0%';
      animateState.duration = 2100;
      animateState.pixelTimeOffset = 300;
      break;
  }
  if (config) {
    for(var key in config) {
      animateState[key] = config[key];
    }
  }
  if (!(animateState.pixels && animateState.pixels.length)) {
    animateState.pixels = gPixels;
  }
  console.log('createAnimation: ', animateState);
  return animateState;
}

function plotAnimation(animateState) {
  var rSeries = [],
      gSeries = [],
      bSeries = [];
  animateState.steps.forEach(step => {
    if (typeof step.color.h !== 'undefined') {
      step.color = Color.HSVtoRGB(step.color);
    }
    rSeries.push({ x: step.time, y: step.color.r });
    gSeries.push({ x: step.time, y: step.color.g });
    bSeries.push({ x: step.time, y: step.color.b });
  });
  var chart = window.chart = new Chart(document.getElementById("plot"));
  chart.addSeries(rSeries, {lineColor: '#f99', dotColor: '#f00'});
  chart.addSeries(gSeries, {lineColor: '#9f9', dotColor: '#0f0'});
  chart.addSeries(bSeries, {lineColor: '#00f', dotColor: '#009'});
  chart.render();
}

var animationManager = {
  stack: [],
  prevTime: 0,
  play: function() {
    if (this.isPlaying) {
      return;
    }
    this.prevTime = Date.now();
    this.elapsedTime = 0;
    this.rafId = window.requestAnimationFrame(this.onAnimationFrame.bind(this));
    this.isPlaying = true;
  },
  onAnimationFrame: function() {
    var now = Date.now();
    var delta = now - this.prevTime;
    this.elapsedTime += delta;
    var animateState = window.gAnimateState = this.stack.pop();
    if (animateState) {
      animateState.updateFn(delta);
      if (this.elapsedTime >= animateState.duration) {
        if (animateState.iterationCount) {
          animateState.iterationCount--;
        } else {
          animateState.stopped = true;
        }
      }
      if (!animateState.stopped) {
        this.stack.push(animateState);
      }
    }
    if (this.stack.length) {
      this.rafId = window.requestAnimationFrame(this.onAnimationFrame.bind(this));
    } else {
      this.isPlaying = false;
      this.rafId = null;
    }
    this.prevTime = now;
    paintPixels(gPixels);
  },
  addAnimation: function(animateState) {
    this.stack.push(animateState);
  },
  replaceAnimation: function(animateState) {
    this.stack[this.stack.length-1] = animateState;
  }
}