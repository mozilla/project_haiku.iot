(function(exports) {
 "use strict";
 var Animation = exports.Animation = {};

function sampleColorAtTime(keyFrames, elapsedTime, duration, easingFn) {
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

  var easedProgress = easingFn(elapsedKeyFrameTime, 0, 1, keyFrameDuration);
  var easedRGB = vectorLerp(
    startColor,
    endColor,
    clamp(easedProgress, 0, 1)
  );
  return easedRGB;
}
Animation.sampleColorAtTime = sampleColorAtTime;

// the animation-specific update function
function allOff(delta, animateState, pixels) {
  animateState.elapsedTime += delta;

  var elapsedTime = clamp(animateState.elapsedTime, 0, animateState.duration);
  if (elapsedTime >= animateState.duration) {
    if (--animateState.iterationCount) {
      // reset to start over at 0%
      elapsedTime = animateState.elapsedTime = 0;
    } else {
      animateState.stopped = true;
      return;
    }
  }
  var offColor = Object.create(RGBColor);
  offColor.b = 41;
  for(var i=0; i<pixels.length; i++) {
    pixels[i].color = offColor;
  }
}

// animate a pixel's color through a set of key-framed values
function keyFrameAnimation(delta, animateState, pixel) {
  animateState.elapsedTime += delta;

  var elapsedTime = clamp(animateState.elapsedTime, 0, animateState.duration);
  if (elapsedTime >= animateState.duration) {
    if (--animateState.iterationCount) {
      // reset to start over at 0%
      elapsedTime = animateState.elapsedTime = 0;
    } else {
      animateState.stopped = true;
      return;
    }
  }
  var color = sampleColorAtTime(animateState.keyFrames,
                                elapsedTime,
                                animateState.duration,
                                animateState.easingFn);
  pixel.color = color;
}

// the animation-specific, key-frame example of an update function
function pixelGroupKeyFrameAnimation(delta, animateState, pixels) {
  animateState.elapsedTime += delta;
  var elapsedTime = clamp(animateState.elapsedTime, 0, animateState.duration);
  if (elapsedTime >= animateState.duration) {
    if (--animateState.iterationCount) {
      // reset to start over at 0%
      elapsedTime = animateState.elapsedTime = 0;
      console.log('over duration, iterationCount now: ', animateState.iterationCount);
    } else {
      animateState.stopped = true;
      // FIXME: do we never get to 100% this way?
      console.log('over duration, stopping at: ', animateState.iterationCount);
      return;
    }
  }

  var centerPixelIndex = isNaN(animateState.centerPixelIndex) ?
      0 : clamp(animateState.centerPixelIndex, 0, pixels.length-1);
  // each pixel is offset by some number of ms
  var pixelTimeOffset = animateState.pixelTimeOffset; // ms;
  pixels.forEach((pixel, idx) => {
    var distance = 1+Math.abs(idx - centerPixelIndex);
    var sign = idx >= centerPixelIndex ? 1 : -1;
    var timeOffset = distance * sign * pixelTimeOffset;
    var elapsedTime = wrap(animateState.elapsedTime + timeOffset, animateState.duration);
    var color = sampleColorAtTime(animateState.keyFrames,
                                  elapsedTime,
                                  animateState.duration,
                                  animateState.easingFn);
    pixel.color = color;
    // just capture for the current/center pixel
    if (idx === 0) {
      animateState.steps.push({
        time: elapsedTime,
        color: color
      });
    }
  });
}
Animation.pixelGroupKeyFrameAnimation = pixelGroupKeyFrameAnimation;

function eachPixel(delta, groupAnimateState, pixels) {
  // update any animating pixels
  // this is just a facade to update animations on the individual pixels
  // and is expected to run continually until its explicitly stopped

  pixels.forEach((pixel, i) => {
    if (!pixel) {
      // slots can be empty/unassigned
      return;
    }
    var animation = pixel.animationStack.pop();
    if (!animation) {
      return;
    }
    animation.updateFn(delta, animation, pixel);

    if (!animation.stopped) {
      pixel.animationStack.push(animation);
    } else {
      console.log('eachPixel: %s: not restoring animation: ', i, animation);
    }
    animation.steps.push({
      time: animation.elapsedTime,
      color: pixel.color
    });
  });
}

var gAnimateStateDefaults = {
  startTime: 0,
  prevTime: 0,
  elapsedTime: 0,
  duration: 1000,
  centerPixelIndex: 2,
  direction: 1,
  pixelTimeOffset: 100,
  iterationCount: 1,
  easingFn: easeInOutQuad
};

// the animation loop
function createAnimation(animName, config) {
  var animateState = Object.create(gAnimateStateDefaults);
  animateState.prevTime = animateState.startTime = Date.now();
  // steps are just for charting/debugging
  animateState.steps = [];
  switch (animName) {
    case 'available':
      animateState.updateFn = keyFrameAnimation;
      animateState.name = animName;
      animateState.keyFrames = {
        '0%': Color.create(0,103,32),
        '50%': Color.create(0,153,32),
        '100%': Color.create(0,103,32)
      };
      animateState.duration = 2500;
      animateState.iterationCount = Infinity;
      // TODO: also handle transition states, error states etc?
      break;
    case 'notAvailable':
      animateState.updateFn = keyFrameAnimation;
      animateState.name = animName;
      animateState.keyFrames = {
        '00%': Color.create(0,0,0),
        '65%': Color.create(0,0,80),
        '100%': Color.create(0,0,0)
      };
      animateState.duration = 2000;
      animateState.iterationCount = 1;
      break;
    case 'connecting':
      animateState.updateFn = keyFrameAnimation;
      animateState.name = animName;
      animateState.keyFrames = {
        '0%': Color.create(51,51,153),
        '50%': Color.create(153,204,255),
        '100%': Color.create(51,51,153)
      };
      animateState.duration = 2000;
      animateState.iterationCount = Infinity;
      break;
    case 'ledStatus':
      animateState.updateFn = eachPixel;
      animateState.name = animName;
      animateState.iterationCount = Infinity;
      break;
    case 'allOff':
      animateState.duration = 1;
      animateState.updateFn = allOff;
      animateState.name = animName;
      break;
    case 'initializing':
      animateState.updateFn = pixelGroupKeyFrameAnimation;
      animateState.name = animName;
      animateState.easingFn = easeLinear;
      animateState.keyFrames = {
        '0%': HSVColor.create(30, 1, 255),
        '100%': HSVColor.create(120, 1, 255)
      };
      animateState.currKeyFrame = '0%';
      animateState.duration = 800;
      animateState.pixelTimeOffset = 300;
      animateState.iterationCount = Infinity;
      break;
    case 'breathe':
      animateState.updateFn = keyFrameAnimation;
      animateState.name = animName;
      animateState.keyFrames = {
        '0%': Color.create(0,0,0),
        '55%': Color.create(0,103,32),
        '100%': Color.create(0,0,0),
      };
      animateState.duration = 4000;
      animateState.currKeyFrame = '0%';
      animateState.iterationCount = Infinity;
      break;
    case 'breatheAll':
      animateState.updateFn = pixelGroupKeyFrameAnimation;
      animateState.name = animName;
      animateState.keyFrames = {
        '0%': Color.create(0,0,0),
        '55%': Color.create(0,103,32),
        '100%': Color.create(0,0,0),
      };
      animateState.duration = 4000;
      animateState.currKeyFrame = '0%';
      animateState.iterationCount = Infinity;
      break;
    case 'rainbow':
      animateState.updateFn = pixelGroupKeyFrameAnimation;
      animateState.name = animName;
      animateState.keyFrames = {
        '0%': Color.create(238, 130, 238),
        '14.3%': Color.create(255, 0, 0),
        '28.6%': Color.create(255, 165, 0),
        '42.9%': Color.create(255, 255, 0),
        '57.1%': Color.create(0, 128, 0),
        '71.4%': Color.create(0, 0, 255),
        '85.7%': Color.create(75, 0, 130),
        '100%': Color.create(238, 130, 238)
      };
      animateState.centerPixelIndex = 3;
      animateState.pixelTimeOffset = 500;
      animateState.currKeyFrame = '0%';
      animateState.duration = 1100;
      break;
    case 'hueHighlight':
      animateState.updateFn = pixelGroupKeyFrameAnimation;
      animateState.name = animName;
      animateState.easingFn = easeLinear;
      animateState.keyFrames = {
        '0%': HSVColor.create(150, 1, 255),
        '20%': HSVColor.create(180, 1, 255),
        '40%': HSVColor.create(255, 1, 255),
        '60%': HSVColor.create(255, 0.5, 255),
        '80%': HSVColor.create(255, 1, 255),
        '100%': HSVColor.create(150, 0.5, 255)
      };
      animateState.currKeyFrame = '0%';
      animateState.duration = 1000;
      animateState.pixelTimeOffset = 300;
      break;
  }
  if (config) {
    for(var key in config) {
      animateState[key] = config[key];
    }
  }
  return animateState;
}
Animation.createAnimation = createAnimation;

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
Animation.plotAnimation = plotAnimation;

})(window);
