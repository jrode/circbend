// paul irish MIT license
function addEvents(e,t){function i(i){var s=i.targetTouches,o=i.changedTouches[0];i.preventDefault();e.addEventListener("touchmove",t);n=o.pageX;r=o.pageY}function s(n){var r=n.targetTouches,i=n.changedTouches[0],o=i.pageX,u=i.pageY;n.preventDefault();e.removeEventListener("touchmove",t);e.removeEventListener("touchend",s)}var n,r;e.addEventListener("touchstart",i)}function makeClass(){return function(e){if(!(this instanceof arguments.callee))return new arguments.callee(arguments);typeof this.init=="function"&&this.init.apply(this,e.callee?e:arguments)}}function rand(e){return Math.floor(Math.random()*e)}(function(){var e=0,t=["ms","moz","webkit","o"];for(var n=0;n<t.length&&!window.requestAnimationFrame;++n){window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"CancelRequestAnimationFrame"]}window.requestAnimationFrame||(window.requestAnimationFrame=function(t,n){var r=(new Date).getTime(),i=Math.max(0,16-(r-e)),s=window.setTimeout(function(){t(r+i)},i);e=r+i;return s});window.cancelAnimationFrame||(window.cancelAnimationFrame=function(e){clearTimeout(e)})})();var Circle=makeClass();Circle.prototype.init=function(e,t,n,r){this.x=rand(e);this.y=rand(t);this.radius=rand(n);this.color={r:rand(255),g:rand(255),b:rand(255),a:Math.round(Math.random()*100)/100};this.velocity={x:rand(r)-Math.floor(r/2),y:rand(r)-Math.floor(r/2)}};Circle.prototype.rgba=function(){return"rgba("+[this.color.r,this.color.g,this.color.b,this.color.a].join(",")+")"};var cirs=[];$(document).ready(function(){function f(){e.width=n=window.innerWidth;e.height=r=window.innerHeight;i=Math.floor(r/2)}function c(){t.clearRect(0,0,n,r);for(var e=0;e<cirs.length;e++){t.beginPath();t.arc(cirs[e].x,cirs[e].y,cirs[e].radius*s,0,2*Math.PI,!1);t.closePath();t.fillStyle=cirs[e].rgba();t.fill();cirs[e].x+=cirs[e].velocity.x*o;cirs[e].y+=cirs[e].velocity.y*o;var i=cirs[e].radius;cirs[e].x<0-i&&(cirs[e].x=n+i);cirs[e].y<0-i&&(cirs[e].y=r+i);cirs[e].x>n+i&&(cirs[e].x=0-i);cirs[e].y>r+i&&(cirs[e].y-=0-i)}requestAnimationFrame(c)}var e=document.getElementById("can-bg"),t=e.getContext("2d"),n,r,i,s=1,o=1,u=1,a=1;addEvents(e,function(e){var t=e.targetTouches,n=e.changedTouches[0],r=s=n.pageX/window.innerWidth,i=o=n.pageY/window.innerHeight;if(e.changedTouches.length==2){var f=e.changedTouches[1];u=f.pageX/window.innerWidth;a=f.pageY/window.innerHeight}e.preventDefault()});f();window.addEventListener("resize",f);window.addEventListener("rotate",f);for(var l=0;l<400;l++)cirs.push(Circle(n,r,i,40));c()});