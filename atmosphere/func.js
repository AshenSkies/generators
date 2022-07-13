var pathPoints = []
var lineCount = 0;

function setup() {
  createCanvas(600, 600); 
  background(0);
} 

function draw() {
  pathPoints = circlePoints();
  
  for(var j=0;j<6;j++){
	pathPoints = complexifyPath(pathPoints);
  }

  stroke(255,15);
  if(lineCount <= 300000){for(var i=0;i<pathPoints.length -1;i++){
    var v1 = pathPoints[i];
    var v2 = pathPoints[i+1];
    line(v1.x,v1.y,v2.x,v2.y);
		lineCount++;
  }}
}

function complexifyPath(pathPoints){
  var newPath = [];
  
  for(var i=0;i<pathPoints.length -1;i++){
    var v1 = pathPoints[i];
    var v2 = pathPoints[i+1];
    var midPoint = p5.Vector.add(v1, v2).mult(0.5);
    var distance =  v1.dist(v2);
    
    var standardDeviation = 0.125*distance;
    var v = createVector(randomGaussian(midPoint.x,standardDeviation),randomGaussian(midPoint.y,standardDeviation))
   	append(newPath,v1);
    append(newPath,v);
  }
  
  append(newPath,pathPoints[pathPoints.length-1]);
  return newPath;  
}

function circlePoints() {
  var r = width/3;
  var theta1 = randomGaussian(0,PI/4);
  var theta2 = theta1 + randomGaussian(0,PI/3);
  var v1 = createVector(width/2 + r*cos(theta1),width/2 + r*sin(theta1));
  var v2 = createVector(width/2 + r*cos(theta2),width/2 + r*sin(theta2));
  
  return [v1,v2];
}