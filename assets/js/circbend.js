// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license
 
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

function addEvents(canvas, moveHandler){
    var startX, startY;

    // Touch just started
    function handleTouchStart(evt) {
        var touches = evt.targetTouches;
        var touch = evt.changedTouches[0];

        evt.preventDefault();

        canvas.addEventListener('touchmove', moveHandler);

        startX = touch.pageX;
        startY = touch.pageY;

        // Do touch start stuff here
    }

    // Touch ended
    function handleTouchEnd(evt) {
        var touches = evt.targetTouches;
        var touch = evt.changedTouches[0];
        var x = touch.pageX;
        var y = touch.pageY;

        evt.preventDefault();

        canvas.removeEventListener('touchmove', moveHandler);
        canvas.removeEventListener('touchend', handleTouchEnd);

        // Do touch end stuff here
    }

    canvas.addEventListener('touchstart', handleTouchStart);
}

// makeClass - By John Resig (MIT Licensed)
function makeClass(){
  return function(args){
    if ( this instanceof arguments.callee ) {
      if ( typeof this.init == "function" )
        this.init.apply( this, args.callee ? args : arguments );
    } else
      return new arguments.callee( arguments );
  };
}

var Circle = makeClass();
Circle.prototype.init = function(w, h, r, v) {
    this.x = rand(w);
    this.y = rand(h);
    this.radius = rand(r);
    this.color = randRGBA();
    this.velocity = {
        x : rand(v) - Math.floor(v/2),
        y : rand(v) - Math.floor(v/2)
    };
}
// testing a commit on other machine
var cirs = [];

function randoHexColor() {
    return Math.random().toString(16).substring(2,8);
}

function randRGBA() {
    var nums = [rand(255), rand(255), rand(255), Math.round((Math.random() * 100)) / 100];
    return 'rgba(' + nums.join(',') + ')';
}

function rand(num) {
    return Math.floor(Math.random() * num);
}

$(document).ready(function() {
    var jitter = 1;
    var canvasBg = document.getElementById('can-bg')
      , bg
      , bgWidth
      , bgHeight
      , bgRadius;

    addEvents(canvasBg, function(evt) {
        var touches = evt.targetTouches;
        var touch = evt.changedTouches[0];
        var x = jitter = touch.pageX / window.innerWidth;
        var y = window.innerHeight / touch.pageY;

        evt.preventDefault();
    });

    function initSize() {
        bgWidth = document.body.clientWidth;
        bgHeight = document.body.clientHeight;
        canvasBg.width = bgWidth;
        canvasBg.height = bgHeight;
        bgRadius = Math.floor(bgHeight / 2);
        bg = canvasBg.getContext('2d');
    }

    initSize();

    for (var i = 0; i < 400; i++) {
        cirs.push(Circle(bgWidth, bgHeight, bgRadius, 40));
    }

    function drawCircles() {
        bg.clearRect(0,0,bgWidth,bgHeight);
        for (var i = 0; i < cirs.length; i++) {
            // draw circle
            bg.beginPath();
            bg.arc(cirs[i].x, cirs[i].y, cirs[i].radius * jitter, 0, 2 * Math.PI, false);
            bg.closePath();
            bg.fillStyle = cirs[i].color;
            bg.fill();

            // set new position
            cirs[i].x += cirs[i].velocity.x;
            cirs[i].y += cirs[i].velocity.y;
            var rad = cirs[i].radius;
            if (cirs[i].x < 0 - rad) cirs[i].x = bgWidth + rad;
            if (cirs[i].y < 0 - rad) cirs[i].y = bgHeight + rad;
            if (cirs[i].x > bgWidth + rad) cirs[i].x = 0 - rad;
            if (cirs[i].y > bgHeight + rad) cirs[i].y -= 0 - rad;
        }

        requestAnimationFrame(drawCircles);
    }

    drawCircles();

});
