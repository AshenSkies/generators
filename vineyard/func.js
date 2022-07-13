var points = [];
var ratio = 0.0006;
var R = 150;
var max_life = 1000;
var h1;
var h2;
var s1;
var s2;
var b1;
var b2;
var resetFlag = false;
var num = 200;

function setup() {
    createCanvas(640,640);
    background(0);
    noiseDetail(random(3,7));
    colorMode(HSB,360,100,100);

    for (var i = 0; i < num; i++) {
        points.push(new Point(randomGaussian(width/2,100),randomGaussian(height/2,100),max_life,ratio));
    }
    h1 = random(360);
    let deltaH = random(60,90);
    if (h1 - deltaH < 0) {
        h2 = h1 + deltaH;
    }else {
        h2 = h1 - deltaH;
    }
    s1 = random(100);
    s2 = random(100);
    b1 = 100;
    b2 = 100;
    fill(3);
    ellipse(width/2,height/2,R*2,R*2);
}

function draw() {
    noStroke();
    if (resetFlag) {
        background(0);
        noiseDetail(random(3,7));
        ratio = random(0.0002,0.002);
        points = [];
        for (var i = 0; i < num; i++) {
            points.push(new Point(randomGaussian(width/2,100),randomGaussian(height/2,100),max_life,ratio));
        }
        h1 = random(360);
        let deltaH = random(60,90);
        if (h1 - deltaH < 0) {
            h2 = h1 + deltaH;
        }else {
            h2 = h1 - deltaH;
        }
        s1 = random(100);
        s2 = random(100);
        b1 = 100;
        b2 = 100;
        resetFlag = false;
    }

    for(var i = 0;i < points.length; i++){
        var h = map(points[i].x,width/2-R,width/2+R,h1,h2);
        var s = map(points[i].y,height/2-R,height/2+R,s1,s2);
        var b = map(points[i].x,height/2-R,height/2+R,b1,b2);
        var a = map(points[i].life,0,max_life,0,1);
        fill(h,s,b,a);
        points[i].move();
        if ((dist(points[i].x,points[i].y,width/2,height/2) < R - 1 ) && points[i].life > 0) {
            points[i].display();
        }

    }
}

function keyPressed() {
    if (key == 's'){
        save('Vines.png');
    }else if (key == 'r') {
        resetFlag = true;
    }
}

function saveBtn() {
    return save('Vines.png');
}

function resetBtn() {
    return resetFlag = true;
}

class Point {
    constructor(tempX,tempY,tempL,tempM) {
        this.x = tempX;
        this.y = tempY;
        this.life = tempL;
        this.ratio = tempM;
    }

    display(){
        var size = map(this.life,0,max_life,0,2);
        ellipse(this.x,this.y,size,size);
    }

    move(){
        var angle = map(noise(this.x*this.ratio, this.y*this.ratio),0,1,0,720);
        this.x += cos(angle);
        this.y += sin(angle);
        this.life -= 1;
    }
}
