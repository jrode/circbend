
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

        for (var t = 0; t < touches.length; t++) {
            //console.log('got end touch ' + touches[t].identifier)
            removeTouch(touches[t].identifier);
        }
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

// random integer between 0 and num
function rand(num) {
    return Math.floor(Math.random() * num);
}

var Circle = makeClass();
Circle.prototype.init = function(w, h, r, v) {
    this.x = rand(w);
    this.y = rand(h);
    this.radius = rand(r);
    this.color = {
        r : rand(255),
        g : rand(255),
        b : rand(255),
        a : Math.round((Math.random() * 100)) / 100
    }
    this.velocity = {
        x : rand(v) - Math.floor(v/2),
        y : rand(v) - Math.floor(v/2)
    };
}
Circle.prototype.rgba = function() {
    return 'rgba(' + [this.color.r, this.color.g, this.color.b, this.color.a].join(',') + ')';
}

var cirs = [];
var currentTouches = [];

$(document).ready(function() {
    var canvasBg = document.getElementById('can-bg')
      , bg = canvasBg.getContext('2d')
      , bgWidth
      , bgHeight
      , bgRadius
      , radJitter = 1
      , speedJitter = 1
      , colorJitter = 0
      , alphaJitter = 0
      , jitter = [];

    addEvents(canvasBg, function(evt) {
        var touches = evt.changedTouches;

        // set all touch jitters
        for (var t = 0; t < touches.length; t++) {
            var touch = currentTouches[findTouch(touches[t].identifier)];
            touch.jitterX = (touch.startX - touches[t].pageX) / window.innerWidth;
            touch.jitterY = (touch.startY - touches[t].pageY) / window.innerHeight;

            if (t == 0) {
                radJitter = touch.jitterX + 1; 
                speedJitter = touch.jitterY + 1;
                //console.log('speed ' + speedJitter + ', size ' + radJitter);
            }
            if (t == 1) {
                colorJitter = touch.jitterX;
                alphaJitter = touch.jitterY;
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
        cirs.push(Circle(bgWidth, bgHeight, bgRadius, 40));
    }

    function drawCircles() {
        bg.clearRect(0,0,bgWidth,bgHeight);
        for (var i = 0; i < cirs.length; i++) {
            // draw circle
            bg.beginPath();
            bg.arc(cirs[i].x, cirs[i].y, cirs[i].radius * radJitter, 0, 2 * Math.PI, false);
            bg.closePath();
            bg.fillStyle = cirs[i].rgba();
            bg.fill();

            // set new position
            cirs[i].x += cirs[i].velocity.x * speedJitter;
            cirs[i].y += cirs[i].velocity.y * speedJitter;
            var rad = cirs[i].radius;
            cirs[i].color.b += (colorJitter > 0 ? 255 - cirs[i].color.b : cirs[i].color.b) * colorJitter;
            cirs[i].color.a += (alphaJitter > 0 ? 1 - cirs[i].color.a : cirs[i].color.a) * alphaJitter;
            if (cirs[i].x < 0 - rad) cirs[i].x = bgWidth + rad;
            if (cirs[i].y < 0 - rad) cirs[i].y = bgHeight + rad;
            if (cirs[i].x > bgWidth + rad) cirs[i].x = 0 - rad;
            if (cirs[i].y > bgHeight + rad) cirs[i].y -= 0 - rad;
        }

        requestAnimationFrame(drawCircles);
    }

    drawCircles();

});
