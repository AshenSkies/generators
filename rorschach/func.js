let seed_prev;
let seed = 'starfield';
let random_i = 0;
function random(){
  return parseInt(window.sha256(`${seed};${random_i++}`).substr(-8), 16) / 0xffffffff;
}
function Choose(arr){
  return arr[Math.floor(random()*arr.length)];
}
function RandomInt(min, max) {
    return Math.floor(random() * (max - min + 1)) + min;
}
window.options = {
  size: 400,
  cellSize: 10,
  fillColor: 'hsl(0,100%,100%)',
  symetry: null,
  hue: 0,
  background: true
}

var symetries = ['x','xy'];
var steppers = [];

var canvas = document.getElementById('canv');
var ctx = canvas.getContext('2d');
function Stepper(x,y){
  this.x = x;
  this.y = y;
  this.lifeSpan = RandomInt(options.size/options.cellSize/2,options.size);
}

Stepper.prototype.step = function(){
  var wc = options.size/options.cellSize;
  this.x += RandomInt(-1, 1);
  this.y += RandomInt(-1, 1);
  this.x = (this.x > wc)?wc-1:this.x;
  this.x = (this.x < 0)?0:this.x;
  this.y = (this.y > wc)?wc-1:this.y;
  this.y = (this.y < 0)?0:this.y;
  this.lifeSpan--;
}

var counter,stepC,lint,inverter;
function init(){
  document.getElementById('seed').innerText = seed;
  
  random_i = 0;
  inverter = -1;
  if(steppers.length > 0){
    var img = generateImage(canvas);
    const seed_saved = seed_prev;
    img.addEventListener('click', () => {
      setSeed(seed_saved);
    })
    document.getElementById('collection').appendChild(img);
  }
  canvas.width = options.size;
  canvas.height = options.size*1.8;
  var steppersNumber = options.size / options.cellSize / 4;
  clearInterval(lint);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(options.background){
    ctx.beginPath();
    ctx.fillStyle='#fff';
    ctx.rect(0,0,options.size,options.size*1.8);
    ctx.fill();
  }
  
  counter = 100;
  stepC = 1/(options.size/100);
  console.log(options.size/options.cellSize);
  options.hue = 360 * random();
  options.symetry = Choose(symetries);
  //drawGrid();
  steppers.length = 0;
  var limit = options.size/options.cellSize/2;
  for(var i = 0; i < steppersNumber ; i++){
    steppers.push(new Stepper(RandomInt(0,limit),RandomInt(0,options.size/options.cellSize)));
  }
  lint = setInterval(step, 0);
}
function setSeed(seed_new){
  seed_prev = seed;
  seed = seed_new;
  init();
}

function generateImage(canvas){
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
}

function step(){
  var alive = false;
  
  counter+=stepC*inverter;
  if(counter < 0){
    inverter = 1;
  }if(counter > 99){
    inverter = -1;
  }

  options.fillColor = 'hsl('+options.hue+','+counter+'%,'+counter+'%)';
  for(var s in steppers){
    if(steppers[s].lifeSpan > 0){
      symetricFill(steppers[s].x,steppers[s].y);
      steppers[s].step();
      alive=true;
    }
  }
  console.log("step");
  if(!alive){
    clearInterval(lint);
    console.log("done");
  }
}

function drawGrid(){
  for(var x = 0 ; x <= options.size ; x+= options.cellSize){
    ctx.strokeStyle = "#252525";
    ctx.beginPath();
    ctx.moveTo(x,0);
    ctx.lineTo(x,options.size);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0,x);
    ctx.lineTo(options.size,x);
    ctx.stroke();
  }
}

function fillCell(x,y){
  ctx.fillStyle = options.fillColor;
  ctx.beginPath();
  ctx.rect(x*options.cellSize,y*options.cellSize*1.8,options.cellSize,options.cellSize*1.8);
  ctx.fill();
}

function symetricFill(x,y){
  fillCell(x,y);
  var x2 = (options.symetry.indexOf('x') !== -1)?options.size/options.cellSize-x-1:x;
  var y2 = (options.symetry.indexOf('y') !== -1)?options.size/options.cellSize-y-1:y;
  fillCell(x2,y2);
}
init();

document.getElementById('drawSeed').addEventListener('click', init);

document.getElementById('newSeed').addEventListener('click', () => {
  setSeed(window.sha256('' + Math.random()));
});

document.getElementById('setSeed').addEventListener('click', () => {
  let seed_new = prompt('Enter seed:');
  if(seed_new){
    setSeed(seed_new);
  }
});