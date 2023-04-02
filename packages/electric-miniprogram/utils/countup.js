
export default function (that, target, startVal, endVal, decimals, duration, options) {

  var timer = {};
  var lastTime = 0;
  timer.requestAnimationFrame = function (callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = setTimeout(function () { callback(currTime + timeToCall); },
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
  timer.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };

  var self = this;

  function formatNumber(num) {
    num = num.toFixed(self.decimals);
    num += '';
    var x, x1, x2, rgx;
    x = num.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? self.options.decimal + x[1] : '';
    rgx = /(\d+)(\d{3})/;
    if (self.options.useGrouping) {
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + self.options.separator + '$2');
      }
    }
    return self.options.prefix + x1 + x2 + self.options.suffix;
  }
  function easeOutExpo(t, b, c, d) {
    return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
  }
  function ensureNumber(n) {
    return (typeof n === 'number' && !isNaN(n));
  }

  self.options = {
    useEasing: true,
    useGrouping: true,
    separator: ',',
    decimal: '.',
    easingFn: easeOutExpo,
    formattingFn: formatNumber,
    prefix: '',
    suffix: ''
  };

  if (options && typeof options === 'object') {
    for (var key in self.options) {
      if (options.hasOwnProperty(key) && options[key] !== null) {
        self.options[key] = options[key];
      }
    }
  }

  if (self.options.separator === '') self.options.useGrouping = false;

  self.initialize = function () {
    if (self.initialized) return true;
    self.d = target;
    if (!self.d) {
      console.error('[CountUp] target is null or undefined', self.d);
      return false;
    }
    self.startVal = Number(startVal);
    self.endVal = Number(endVal);
    // error checks
    if (ensureNumber(self.startVal) && ensureNumber(self.endVal)) {
      self.decimals = Math.max(0, decimals || 0);
      self.dec = Math.pow(10, self.decimals);
      self.duration = Number(duration) * 1000 || 2000;
      self.countDown = (self.startVal > self.endVal);
      self.frameVal = self.startVal;
      self.initialized = true;
      return true;
    }
    else {
      console.error('[CountUp] startVal or endVal is not a number', self.startVal, self.endVal);
      return false;
    }
  };

  // Print value to target
  self.printValue = function (value) {
    var result = self.options.formattingFn(value);
    var obj = {};

    obj[self.d] = result;

    that.setData(obj);
  };

  self.count = function (timestamp) {

    if (!self.startTime) { self.startTime = timestamp; }

    self.timestamp = timestamp;
    var progress = timestamp - self.startTime;
    self.remaining = self.duration - progress;

    if (self.options.useEasing) {
      if (self.countDown) {
        self.frameVal = self.startVal - self.options.easingFn(progress, 0, self.startVal - self.endVal, self.duration);
      } else {
        self.frameVal = self.options.easingFn(progress, self.startVal, self.endVal - self.startVal, self.duration);
      }
    } else {
      if (self.countDown) {
        self.frameVal = self.startVal - ((self.startVal - self.endVal) * (progress / self.duration));
      } else {
        self.frameVal = self.startVal + (self.endVal - self.startVal) * (progress / self.duration);
      }
    }

    if (self.countDown) {
      self.frameVal = (self.frameVal < self.endVal) ? self.endVal : self.frameVal;
    } else {
      self.frameVal = (self.frameVal > self.endVal) ? self.endVal : self.frameVal;
    }

    self.frameVal = Math.round(self.frameVal * self.dec) / self.dec;

    self.printValue(self.frameVal);

    if (progress < self.duration) {
      self.rAF = timer.requestAnimationFrame(self.count);
    } else {
      if (self.callback) self.callback();
    }
  };
  self.start = function (callback) {
    if (!self.initialize()) return;
    self.callback = callback;
    self.rAF = timer.requestAnimationFrame(self.count);
  };
  self.pauseResume = function () {
    if (!self.paused) {
      self.paused = true;
      timer.cancelAnimationFrame(self.rAF);
    } else {
      self.paused = false;
      delete self.startTime;
      self.duration = self.remaining;
      self.startVal = self.frameVal;
      timer.requestAnimationFrame(self.count);
    }
  };
  self.reset = function () {
    self.paused = false;
    delete self.startTime;
    self.initialized = false;
    if (self.initialize()) {
      timer.cancelAnimationFrame(self.rAF);
      self.printValue(self.startVal);
    }
  };
  self.update = function (newEndVal) {
    if (!self.initialize()) return;
    if (newEndVal === self.frameVal) return;
    timer.cancelAnimationFrame(self.rAF);
    self.paused = false;
    delete self.startTime;
    self.startVal = self.frameVal;
    self.endVal = Number(newEndVal);
    if (ensureNumber(self.endVal)) {
      self.countDown = (self.startVal > self.endVal);
      self.rAF = timer.requestAnimationFrame(self.count);
    } else {
      console.error('[CountUp] update() - new endVal is not a number', newEndVal);
    }
  };

  if (self.initialize()) self.printValue(self.startVal);
};
