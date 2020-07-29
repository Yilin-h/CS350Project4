const MAXPOINTS = 5; 
const UPDATECOLOR = 0.8; 
const UPDATEPOS = 0.75; 
const UPDATESHAPE = 0.9;
const SPEED = 250;

var points = new Array();
var shapes = new Array('rectangle', 'square', 'circle', 'oval', 'triangle', 'line');
var colors = new Array('red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple');
var interval;

var state = "hidden"; 


function showGame() {
  state = "stopped";
  var buttonStart = document.getElementById("game-play-show");
  buttonStart.style.display = "none";
  var canvas = document.getElementById("game-play");
  var ctx = canvas.getContext("2d");
  var menu = document.getElementById("game-controlls");
  var controllButtons = '<input type="button" class="button" value="Refresh" onclick="refreshCanvas();">';
  controllButtons += '<input type="button"  class="button" value="Exit" onclick="clearCanvas();">';
  
  canvas.style.display = "inline-block"; 
  canvas.style.margin = '0px';
  ctx.canvas.width  = document.body.offsetWidth;
  ctx.canvas.height = document.body.offsetWidth;
  canvas.style.backgroundColor = "white";
  gameInstructions(ctx);
  menu.style.display = "block";
  menu.innerHTML = controllButtons;
}

function resizeCanvas() {
  if (state != "hidden") {
    var ctx = document.getElementById("game-play").getContext("2d");
    ctx.canvas.width  = document.body.offsetWidth;
    ctx.canvas.height = document.body.offsetWidth;
    if (state == "running") {
      for(let point of points) { point.updatePos(ctx.canvas, true); }
    }
    else if (state == "stopped") {
      refreshCanvas();
    }
  }
} 

function refreshCanvas() {
  state = "stopped";
  var canvas = document.getElementById("game-play");
  var ctx = canvas.getContext("2d");
  wipeCanvasClean(canvas);
  gameInstructions(ctx);

  if (interval != undefined) { clearInterval(interval); }
  points.length = 0;
  Point.resetCount();
}

function clearCanvas() {
  refreshCanvas();
  var buttonStart = document.getElementById("game-play-show");
  buttonStart.style.display = "inline-block";
  var canvas = document.getElementById("game-play");
  var menu = document.getElementById("game-controlls");
  canvas.style.display = "none";
  menu.style.display = "none";
} 

function gameInstructions(ctx) {
  ctx.fillText("Please click on 5 arbitrary spots within this box to begin", 5, 10);
} 


function wipeCanvasClean(canvas) {
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = 'black';
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
} 

function captureClick(e) {
  if (Point.getCount() != MAXPOINTS) {
    var canvas = document.getElementById("game-play");
    if (Point.getCount() < MAXPOINTS) {
      if (Point.getCount() == 0) { wipeCanvasClean(canvas); }
      points[Point.getCount()] = new Point(e.offsetX, e.offsetY, canvas);
    }
    if (Point.getCount() == MAXPOINTS) {
      state = "running";
      interval = setInterval(runOverPoints, SPEED, canvas);
    }
  }
  else {
    e.stopPropagation();
  }
}

function runOverPoints(canvas) {
  var ctx = canvas.getContext("2d");
  wipeCanvasClean(canvas);
  for(let point of points) {
    drawThings(point, canvas);
    point.maybeUpdate(canvas);
  }
}

function drawThings(point, canvas){
  var ctx = canvas.getContext("2d");
  var info = point.getShapeInfo();

  ctx.fillStyle = point.getColor();
  ctx.strokeStyle = point.getColor();
  switch (point.getShape()) {
    case 'rectangle':
      ctx.fillRect(info.centerX, info.centerY, info.width, info.height);
      break;
    case 'square':
      ctx.fillRect(info.centerX, info.centerY, info.width, info.width);
      break;
    case 'circle':
      ctx.beginPath();
      ctx.arc(info.centerX, info.centerY, info.radius, info.startAngle, info.endAngle); 
      ctx.fill();
      ctx.stroke();
      break;
    case 'oval':
      ctx.beginPath();
      ctx.ellipse(info.centerX, info.centerY, info.radiusX, info.radiusY, info.rotation, info.startAngle, info.endAngle);
      ctx.fill();
      ctx.stroke();
      break;
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(info.oneX, info.oneY);
      ctx.lineTo(info.twoX, info.twoY);
      ctx.lineTo(info.thrX, info.thrY);
      ctx.fill();
      break;
    case 'line':
      ctx.beginPath();
      ctx.moveTo(info.oneX, info.oneY);
      ctx.lineTo(info.twoX, info.twoY);
      ctx.stroke(); 
      break;
  }
}

class Point {
  
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y; 
    this.shape = shapes[Math.floor(Math.random()*shapes.length)];
    this.color = colors[Math.floor(Math.random()*colors.length)];
    this.constructShapeInfo(canvas);
    if (Point.count == undefined) {
      Point.count = 1; }
    else if (Point.count < MAXPOINTS) { 
      Point.count += 1;
    }
  }

  constructShapeInfo(canvas) {
    var width = this.getNumInRange(canvas.offsetWidth/6,canvas.offsetWidth/2);
    var height = this.getNumInRange(canvas.offsetHeight/6,canvas.offsetHeight/2);
    var points;
    switch (this.shape) {
      case 'rectangle':
        this.centerX = Math.floor(this.x - (width / 2));
        this.centerY = Math.floor(this.y - (height / 2));
        if (Math.floor(Math.random() + 0.5) == 0) {
          this.width = width;
          this.height = height;
        }
        else {
          this.width = height;
          this.height = width;
        }
        break;
      case 'square':
        this.centerX = Math.floor(this.x - (width / 2));
        this.centerY = Math.floor(this.y - (height / 2));
        this.width = width;
        this.height = height;
        break;
      case 'circle':
        this.radius = (width / 2);
        this.centerX = this.x;
        this.centerY = this.y;
        this.startAngle = 0;
        this.endAngle = 2 * Math.PI;
        break;
      case 'oval':
        this.centerX = this.x;
        this.centerY = this.y;
        if (Math.floor(Math.random() + 0.5) == 0) {
          this.radiusX = Math.floor(height/2);
          this.radiusY = Math.floor(width/2);
          this.rotation = Math.PI / 2;
          this.startAngle = 0;
          this.endAngle = 2 * Math.PI;
        }
        else {
          this.radiusX = Math.floor(width/2);
          this.radiusY = Math.floor(height/2);
          this.rotation = Math.PI / 4;
          this.startAngle = 0;
          this.endAngle = 2 * Math.PI;
        }
        break;
      case 'triangle':
        points = this.centerTriangle(this.x, this.y, this.getOtherPoint(width, 1, this.x, this.y), this.getOtherPoint(width, 2, this.x, this.y));
        this.oneX = points.oneX;
        this.oneY = points.oneY;
        this.twoX = points.twoX;
        this.twoY = points.twoY;
        this.thrX = points.thrX;
        this.thrY = points.thrY;
        break;
      case 'line':
        points = this.centerLine(this.x, this.y, this.getOtherPoint(width, null, this.x, this.y));
        this.oneX = points.oneX;
        this.oneY = points.oneY;
        this.twoX = points.twoX;
        this.twoY = points.twoY;
        break;
    }
  }

  getNumInRange(min,max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  getOtherPoint(radius, random, offX, offY) {
    var angle;
    switch (random) {
      case 1:
        angle = 60 * Math.PI / 180;
        break;
      case 2:
        angle = 120 * Math.PI / 180;
        break;
      default:
        angle = Math.random() * Math.PI * 2;
    }
    return {
      x: Math.floor(Math.cos(angle) * radius) + offX,
      y: Math.floor(Math.sin(angle) * radius) + offY
    };
  }
  centerTriangle(oX, oY, other, otherO) {
    var dY = Math.floor(oY - ((oY + other.y + otherO.y)/3));
    return {
      oneX: oX,
      oneY: oY + dY,
      twoX: other.x,
      twoY: other.y + dY,
      thrX: otherO.x,
      thrY: otherO.y + dY
    }
  }

  centerLine(oX, oY, other) {
    var dX = Math.floor((oX - other.x)/2);
    var dY = Math.floor((oY - other.y)/2);
    return {
      oneX: oX + dX,
      oneY: oY + dY,
      twoX: other.x + dX,
      twoY: other.y + dY
    }
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }


  getShape() {
    return this.shape;
  }
  getColor() {
    return this.color;
  }

  getShapeInfo() {
    switch (this.shape) {
      case 'rectangle':
        return {
          centerX: this.centerX,
          centerY: this.centerY,
          width: this.width,
          height: this.height
        }
        break;
      case 'square':
        return {
          centerX: this.centerX,
          centerY: this.centerY,
          width: this.width,
          height: this.height
        }
        break;
      case 'circle':
        return {
          radius: this.radius,
          centerX: this.centerX,
          centerY: this.centerY,
          startAngle: this.startAngle,
          endAngle: this.endAngle
        }
        break;
      case 'oval':
        return {
          centerX: this.centerX,
          centerY: this.centerY,
          radiusX: this.radiusX,
          radiusY: this.radiusY,
          rotation: this.rotation,
          startAngle: this.startAngle,
          endAngle: this.endAngle
        }
        break;
      case 'triangle':
        return {
          oneX: this.oneX,
          oneY: this.oneY,
          twoX: this.twoX,
          twoY: this.twoY,
          thrX: this.thrX,
          thrY: this.thrY
        }
        break;
      case 'line':
        return {
          oneX: this.oneX,
          oneY: this.oneY,
          twoX: this.twoX,
          twoY: this.twoY
        }
        break;
    }
  }


  updateColor() {
    if (Math.random() >= UPDATECOLOR) {
      this.color = colors[Math.floor(Math.random()*colors.length)];
    }
  }

  updatePos(canvas, force=false) {
    if (force) {
      this.x = canvas.width * Math.random();
      this.y = canvas.height * Math.random();
      this.constructShapeInfo(canvas);
    }
    else if (Math.random() >= UPDATEPOS) {
      var tempX, tempY;
      if (Math.floor(Math.random() + 0.5) == 0) {
         tempX = this.x + Math.floor(canvas.width * 0.2); 
         tempY = this.y + Math.floor(canvas.height * 0.2);
      }
      else {
         tempX = this.x + Math.floor(canvas.width * 0.2) * -1; 
         tempY = this.y + Math.floor(canvas.height * 0.2) * -1;
      }
      if (((tempX > 0) && (tempX < canvas.width)) && ((tempY > 0) && (tempY < canvas.height))) {
        this.x = tempX;
        this.y = tempY;
        this.constructShapeInfo(canvas);
      }
    }
  }

  updateShape(canvas) {
    if (Math.random() >= UPDATESHAPE) {
      this.shape = shapes[Math.floor(Math.random()*shapes.length)];
      this.constructShapeInfo(canvas);
    }
  }

  maybeUpdate(canvas) {
    this.updateColor();
    this.updatePos(canvas);
    this.updateShape(canvas);
  }

  static getCount() {
    return (Point.count == undefined) ? 0 : Point.count;
  }


  static resetCount() {
    Point.count = undefined;
  }
  
}

