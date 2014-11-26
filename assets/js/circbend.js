
// paul irish MIT license
(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                   || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

function findTouch(id) {
  for (var i = 0; i < currentTouches.length; i++) {
    if (currentTouches[i].id === id) {
      return i;
    }
  }
  return -1;
}

function removeTouch(id) {
  var i = findTouch(id);
  if (i > -1) currentTouches.splice(i, 1);
}

function addEvents(canvas, moveHandler){

  // Touch just started
  function handleTouchStart(evt) {
    var touches = evt.changedTouches;
    evt.preventDefault();

    canvas.addEventListener('touchmove', moveHandler);
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);

    for (var t = 0; t < touches.length; t++) {
      //console.log('got start touch ' + touches[t].identifier)
      currentTouches.push({
        id: touches[t].identifier,
        startX: touches[t].pageX,
        startY: touches[t].pageY,
        jitterX: 0,
        jitterY: 0
      });
    }
  }

  // Touch ended
  function handleTouchEnd(evt) {
    var touches = evt.changedTouches;
    evt.preventDefault();

    canvas.removeEventListener('touchmove', moveHandler);
    canvas.removeEventListener('touchend', handleTouchEnd);
    canvas.removeEventListener('touchcancel', handleTouchEnd);

    /*
    for (var key in lastJitter) {
      lastJitter[key] = (lastJitter[key] + 1) * (currJitter[key] + 1) - 1;
      currJitter[key] = 0;
    }
    */

    lastJitter.radius = (lastJitter.radius + 1) * (currJitter.radius + 1) - 1;
    lastJitter.speed = (lastJitter.speed + 1) * (currJitter.speed + 1) - 1;
    currJitter.radius = 0;
    currJitter.speed = 0;

    for (var t = 0; t < touches.length; t++) {
      //console.log('got end touch ' + touches[t].identifier)
      removeTouch(touches[t].identifier);
    }
  }

  canvas.addEventListener('touchstart', handleTouchStart);
}


// random integer between 0 and num
function rand(num) {
  return Math.floor(Math.random() * num);
}

function makeCircle(w, h, r, v) {
  var circle = {};
  circle.x = rand(w);
  circle.y = rand(h);
  circle.radius = rand(r);
  circle.color = {
    r : rand(255),
    g : rand(255),
    b : rand(255),
    a : Math.round((Math.random() * 100)) / 100
  };
  circle.rgba = 'rgba(' + [
      circle.color.r,
      circle.color.g,
      circle.color.b,
      circle.color.a
    ].join(',') + ')';
  circle.velocity = {
    x : rand(v) - Math.floor(v/2),
    y : rand(v) - Math.floor(v/2)
  };
  return circle;
}

var cirs = []
  , currentTouches = []
  , lastJitter = {
    radius: -0.5,
    speed: 0.5,
    color: 0,
    alpha: 0
    }
  , currJitter = {
    radius: 0,
    speed: 0,
    color: 0,
    alpha: 0
    };

(function() {
  var canvasBg = document.getElementById('can-bg')
    , bg = canvasBg.getContext('2d')
    , bgWidth
    , bgHeight
    , bgRadius;

  addEvents(canvasBg, function(evt) {
    var touches = evt.changedTouches;

    // set all touch jitters
    for (var t = 0; t < touches.length; t++) {
      var touch = currentTouches[findTouch(touches[t].identifier)];
      touch.jitterX = (touches[t].pageX - touch.startX) / window.innerWidth;
      touch.jitterY = (touches[t].pageY - touch.startY) / window.innerHeight;

      if (t == 0) {
        currJitter.speed = touch.jitterX;
        currJitter.radius = touch.jitterY;
      }
      if (t == 1) {
        currJitter.color = touch.jitterX;
        currJitter.alpha = touch.jitterY;
      }
    }

    evt.preventDefault();
  });

  function initSize() {
    canvasBg.width = bgWidth = window.innerWidth;
    canvasBg.height = bgHeight = window.innerHeight;
    bgRadius = Math.floor(bgHeight / 2);
  }

  initSize();
  window.addEventListener('resize', initSize);
  window.addEventListener('rotate', initSize);

  for (var i = 0; i < 400; i++) {
    cirs.push(makeCircle(bgWidth, bgHeight, bgRadius, 40));
  }

  function reportValues() {
    setTimeout(function() {
      console.log('speed ∆ ' + (currJitter.speed + lastJitter.speed));
      reportValues();
    }, 1000);
  }

  function drawCircles() {
    bg.clearRect(0,0,bgWidth,bgHeight);
    for (var i = 0; i < cirs.length; i++) {
      var rad = cirs[i].radius * (currJitter.radius + 1) * (lastJitter.radius + 1);
      bg.beginPath();
      bg.arc(cirs[i].x, cirs[i].y, rad, 0, 2 * Math.PI, false);
      bg.closePath();
      bg.fillStyle = cirs[i].rgba;
      bg.fill();

      var speedDelta = currJitter.speed + lastJitter.speed;
      cirs[i].x += cirs[i].velocity.x * speedDelta;
      cirs[i].y += cirs[i].velocity.y * speedDelta;
      var colorJitter = currJitter.color;
      var alphaJitter = currJitter.alpha;
      //cirs[i].color.b += (colorJitter > 0 ? 255 - cirs[i].color.b : cirs[i].color.b) * colorJitter;
      //cirs[i].color.a += (alphaJitter > 0 ? 1 - cirs[i].color.a : cirs[i].color.a) * alphaJitter;
      if (cirs[i].x < 0 - rad) cirs[i].x = bgWidth + rad;
      if (cirs[i].y < 0 - rad) cirs[i].y = bgHeight + rad;
      if (cirs[i].x > bgWidth + rad) cirs[i].x = 0 - rad;
      if (cirs[i].y > bgHeight + rad) cirs[i].y = 0 - rad;
    }

    requestAnimationFrame(drawCircles);
  }

  drawCircles();

})();
