void setup(){
size(600,600);
noFill();
}

//   Variables  //////////////////////////////////////////////////////////////
/* @pjs preload="jet.png"; */
/* @pjs preload="flyjet.gif"; */

var Flying=true;
imageMode(CENTER);
var jet = loadImage("jet.png");
var flyjet = loadImage("flyjet.gif");
var score = 0;
var obstacleList=[];
var ground=500;
var y =100;
var dy=0;
var dx = 2;
var x = width/4;
var obSpeed=1;
var health = 40;
var spawnChance;
var particleList[];
var cpu = false;

//   Sound definitions   //////////////////////////////////////////////////////////
var sound = new Howl({
	urls: ['224917_Journey_to_the_East.mp3'],
	loop:true,
	volume:0.3
}).play();

var bomb = new Howl({
	urls:['bomb.mp3'],
	sprite:{blast:[8000,2000]},
	volume:0.1


})



//Ball types///////////////////////////////////////////////////////////
//////Regular///////////////////////////////////////////////////////////
function obstacle(){
	this.detectRadius=10;
	this.used=false;
	this.x=width;
	this.y=random(0,height);
	this.colour= color(random(0,255),random(0,255),random(0,255));
	this.move=function(){this.x-=obSpeed;}
	this.draw=function(){
		fill(this.colour);
		ellipse(this.x,this.y,10,10);
	}
	this.detect=function(){
		if (sqrt(sq(y-this.y)+sq(x-this.x))<this.detectRadius &&!this.used){
			background(255,0,0);
			health -=1;
			this.used=true;
			bomb.play('blast');	
		}
	}
	this.all=function(){
		this.move();
		this.draw();
		this.detect();
	}
}

//////Particle,random speed, used in bomb///////////////////////////////////////////

function particle(xOrigin,yOrigin,xSpeed,ySpeed){
	this.detectRadius=9;
	this.move=function(){
		this.y+=ySpeed;
		this.x+=xSpeed;
	}
	this.x=xOrigin;
	this.y=yOrigin;
	this.colour= color(random(0,255),random(0,255),random(0,255));
	
}

//////Bomb, releases (10*obSpeed) particles on hit//////////////////////////////////

function bombb(){
	this.x=width;
	this.y=random(0,height);
	this.colour= color(random(0,255),random(0,255),random(0,255));
	this.strokeColour= color(random(0,255),random(0,255),random(0,255));
	this.draw=function(){
		this.strokeColour= color(random(0,255),random(0,255),random(0,255));
		stroke(this.strokeColour);
		fill(this.colour);
		strokeWeight(5);
		ellipse(this.x,this.y,10,10);
		stroke(0,0,0);
		strokeWeight(1);
	}

	this.detect=function(){
		if (sqrt(sq(y-this.y)+sq(x-this.x))<10 &&!this.used){
			background(255,0,0);
			for(var i=0;i<obSpeed*10;i+=1){
				
				obstacleList.unshift(new particle(this.x,this.y,random(-3,3),random(-3,3)));
			}
			this.used=true;
			bomb.play('blast');	
		}
	}


}





//Inheritance part///////////////////////////////////////////////////////////////

particle.prototype=new obstacle();
bombb.prototype=new obstacle();

//Spawning function////////////////////////////////////////////////////////////

var makeObstacle=function(){
	if(random(0,1)<spawnChance){
		if(random(0,1)<0.1){
			obstacleList.unshift(new particle(random(0,width),random(0,height),random(-3,3),random(-3,3)));
		}
		else if(random(0,1)<0.8){
			obstacleList.unshift(new obstacle());
		}
		else{
			obstacleList.unshift(new bombb());
			
		}
		
		
	}
	
};





var UpdateObstacles= function(){
	for(var ii=0;ii<obstacleList.length;ii++){
		obstacleList[ii].all();
	}

};


void draw(){

	obSpeed+=0.001
	spawnChance=obSpeed/10;
	background(255,255,255);
	makeObstacle();
	UpdateObstacles();
	while(obstacleList.length>=150){
		obstacleList.pop();
		
	};



	if(y>ground)dy=0;

	if(keyCode===UP&&keyPressed){
		Flying=false;
		dy=-3;
	}
	else{
		Flying=true;

	}

	if (y<0)dy=20;

	if(y<ground)dy+=0.3;

	y+=dy;

	if(keyCode===68)health = 0;
	score+=1;
	if(health<=0){
		noLoop();
		fill(0,0,0);
		textSize(20);
		textAlign(CENTER,CENTER);
		text("GAME OVER",width/2,height/2);
		text("Score: "+score,width/2,height/2+30);
		Howler.mute();
	}

	fill(0,0,0);
	//ellipse(x,y,30,30);
	
	if(Flying){
	image(jet,x,y);
	}

	else{
	image (flyjet,x,y);
	}
	line(0,0,width,0);
	line(0,0,0,height);
	line(0,height-1,width-1,height-1);
	line(width-1,0,height-1,width-1);
	fill(0,0,0);
	text(health,200,200);
	//text(obstacleList.length,100,100);
	
	

};
