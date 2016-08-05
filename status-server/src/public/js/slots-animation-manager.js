(function(exports) {

 "use strict";

var Slot = exports.Slot = {
  animateState: 0,
  index: -1,
  clickState: -1,
  status: -1,
  color: Object.create(RGBColor)
};

// animation manager - has animation stack, state, and a couple methods to change state and react to input
//
var SlotsAnimationManager = exports.SlotsAnimationManager = {
  lastUpdateTime: 0,
  elapsedTime: 0,
  animationStack: [],
  stateId: -1,
  nextStateId: -1,
  slots: null,
  animateRAFId: null
};

SlotsAnimationManager.init = function(slots) {
  this.slots = slots;
  for(var i=0; i<slots.length; i++) {
    slots[i] = Object.create(Slot);
    slots[i].color = Object.create(RGBColor);
    slots[i].animationStack = [
      // set initial state for each slot
      Animation.createAnimation('connecting', {})
    ];
  }
};
SlotsAnimationManager.start = function(stateId) {
  this.changeState(stateId || SlotsAnimationManager.state.INITIALIZING);
  this.animateRAFId = window.requestAnimationFrame(this.onAnimationFrame);
  setTimeout(() => {
    this.changeState(SlotsAnimationManager.state.ACTIVE);
  }, 2000);
};

SlotsAnimationManager.stop = function() {
  if (this.animateRAFId) {
    window.cancelAnimationFrame(this.animateRAFId);
    this.animateRAFId = null;
  }
};

SlotsAnimationManager.onAnimationFrame = function() {
  var now = Date.now();
  var deltaTime = this.lastUpdateTime ? now - this.lastUpdateTime : 0;
  this.update(deltaTime);

  this.render();
  this.lastUpdateTime = now;
  this.animateRAFId = window.requestAnimationFrame(this.onAnimationFrame);
}.bind(SlotsAnimationManager);

SlotsAnimationManager.changeState = function(stateId) {
  if (stateId == this.stateId) {
    return;
  }
  console.log('changeState: changing to ', stateId);
  this.nextStateId = stateId;
  switch (stateId) {
    case SlotsAnimationManager.state.INITIALIZING: {
      let animation = Animation.createAnimation('initializing', {});
      console.log('pushing initializing animation onto stack')
      this.animationStack.splice(0, this.animationStack.length, animation);
      break;
    }
    case SlotsAnimationManager.state.ACTIVE: {
      this.slots[0].status = 1;
      let animation = Animation.createAnimation('ledStatus', {});
      console.log('pushing ledStatus animation onto stack')
      this.animationStack.splice(0, this.animationStack.length, animation);
      break;
    }
    case SlotsAnimationManager.state.INACTIVE: {
      this.slots[0].status = 0;
      this.animationStack.splice(0, this.animationStack.length,
                                 Animation.createAnimation('allOff', {}));
      break;
    }
  }
  this.stateId = stateId;
};
SlotsAnimationManager.changeSlotStatus = function(slotIndex, statusValue) {
  var slot = this.slots[slotIndex];
  if (statusValue == slot.status) {
    // no actual change
    return;
  }
  if (isNaN(statusValue) || statusValue < 0 || statusValue > 1) {
    throw new Error("changeSlotStatus: Unexpected statusValue: " + statusValue);
  }
  slot.status = statusValue;
  if (slotIndex === 0) {
    this.changeState(statusValue ? SlotsAnimationManager.state.ACTIVE : SlotsAnimationManager.state.INACTIVE);
    return;
  }
  if (this.stateId !== SlotsAnimationManager.state.ACTIVE) {
    return;
  }
  var animation;
  if (statusValue) {
    animation = Animation.createAnimation('available', {});
  } else {
    animation = Animation.createAnimation('notAvailable', {});
  }
  // replace the whole animation stack with this new animation
  slot.animationStack.splice(0, slot.animationStack.length, animation);
  console.log('changeSlotStatus, animationStack for slot is: ', slot.animationStack.map(a => a.name));
};

SlotsAnimationManager.playMessage = function(msgValue) {
  switch (msgValue) {
    // TODO: implement other message/animation types?
    default:
      console.log('adding rainbow to animationStack');
      this.animationStack.push(Animation.createAnimation('rainbow', {
        iterationCount: 2,
        duration: 600
      }));
      break;
  }
};

SlotsAnimationManager.update = function(delta) {
  var animation = this.animationStack.pop();
  if (!animation) {
    return;
  }
  this.elapsedTime += delta;
  animation.updateFn(delta, animation, this.slots);

  if (!animation.stopped) {
    this.animationStack.push(animation);
  }
};

// TODO: button press handling, message receiving etc.
SlotsAnimationManager.state = {};
SlotsAnimationManager.state.INITIALIZING = 0;
SlotsAnimationManager.state.ACTIVE = 1;
SlotsAnimationManager.state.INACTIVE = 2;

SlotsAnimationManager.animation = {};
SlotsAnimationManager.animation.STATUS_DISPLAY = 0;
SlotsAnimationManager.animation.INITIALIZING = 1;
SlotsAnimationManager.animation.STATUS_DISPLAY = 2;
SlotsAnimationManager.animation.STATUS_CHANGE_RECEIVED = 3;
SlotsAnimationManager.animation.STATUS_CHANGE_SENT = 4;
SlotsAnimationManager.animation.MESSAGE = 5;
SlotsAnimationManager.animation.INCOMING_MESSAGE = 6;
SlotsAnimationManager.animation.OUTGOING_MESSAGE = 7;
SlotsAnimationManager.animation.AVAILABLE = 8;
SlotsAnimationManager.animation.NOT_AVAILABLE = 9;


})(window);
