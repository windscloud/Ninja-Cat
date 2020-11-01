// Title: Ninja Cat HTML
// Programmer: Zihan Teng,Yi Zhong,Mingrong Sun ----- Ninja cat
// Date: May 2020
// Description: This is main run js file
// version 1.0(standard)
//Source code:function compare:https://www.cnblogs.com/fengxiongZz/p/6800987.html


//Zihan Teng
//Animation on the first page
var animation = setInterval(function() {
	if(Hometitle2.src.slice(-8,-4) === "cat3") return Hometitle2.src = "./img/cat4.png"
	Hometitle2.src = "./img/cat3.png"
	},250)

//Mingrong Sun
//function to start the game
function startGame(){
	clearInterval(animation)
	home.style.display = "none"
	canvas.style.display = "block"
}

//Mingrong Sun
// function to turn on/off the music
function play() {
	var audio = document.getElementById('music');
	if (audio.paused) {
		audio.play();
	}else{
		audio.pause();
		audio.currentTime = 0;//音乐从头播
	}
 }

//Zihan Teng
//Set the Canvas and load flower image
var canvas = document.getElementById("canvas");
//2d game
var ctx = canvas.getContext("2d");
var flower1 = new Image();
var flower2 = new Image();
flower2.src = "./img/flower2.png"
flower1.src = "./img/flower1.png"

//Zihan Teng
//Obstacle Class
function Obstacle(x, y, h, image) {
	this.x = x,
	this.y = y,
	this.width = image.width,
	this.height = h,
	this.hasFlower = Math.random()*10 < 3 ? true :false,
	this.draw = function(context, position) {
		if (position === "top") {
			context.drawImage(image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
			return
		}
		context.drawImage(image, 0,image.height - this.height,this.width,this.height,this.x, this.y, this.width, this.height);
		if(this.hasFlower) {
			if(number % 2 === 0) {
				//draw flower image 1
				context.drawImage(flower1, 0, 0, 50, 50, this.x + 10 , this.y + this.height - 5, 40, 40);
			}else {
				//draw flower image 1
				context.drawImage(flower2, 0, 0, 50, 50, this.x + 10 , this.y + this.height - 5, 40, 40);
			}
		}
	}
};

// Mingrong Sun
//The main character in the game
function Character(x, y, image,image2) {
	this.x = x,
	this.y = y,
	this.width = image.width,
	this.height = image.height,
	this.image = image;
	this.draw = function(context, state) {
		if (state === "top") {
			context.drawImage(image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
			return
		}
		context.drawImage(image2, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
	}
};

//Yi Zhong
// Money object
function Money(x, y, image) {
	this.x = x,
	this.y = y,
	this.width = image.width,
	this.height = image.height,
	this.image = image;
	this.draw = function(context) {
		context.drawImage(money,0,0,50,50,this.x  , this.y + this.height,35,35)
	}
};

// Zihan Teng,Mingrong Sun,Yi Zhong
// Game objects, using singleton mode to ensure that there is only one entity
function MyGame() {}
//put the prototype,make sure has only one object
MyGame.prototype = { 
	charater: null, // character
	bg: null, // background
	obs: null, // obstacle(障碍物)
	obsB:null,
	obsList: [],
	canvasWidth: 340, // Canvas width画布宽度
	canvasHeight: 453, // Canvas height画布高度
	startX: 85, // start position x起始位置  
	startY: 225,// start position y
	obsDistance: 150, // obstacle gap上下障碍物距离  
	obsSpeed: 2, // obstacle speed障碍物移动速度  
	obsInterval: 2000, // generate gap制造障碍物间隔ms  
	upSpeed: 8, // up speed上升速度  
	downSpeed: 3, // charater down下降速度  
	landHeight: 56, // height of land地面高度
	score: 0, // final score得分  
	touch: false, // listen touch是否触摸
	gameOver: false,
	//Zihan Teng
	//Set the initial game
	setGame() {
		//background Image背景
		this.bg = new Image();
		this.bg.src = "img/bg.jpg";
		var startBg = new Image();
		startBg.src = "img/help.jpg";
		// depict when loading is over 由于Image异步加载, 在加载完成时在绘制图像
		startBg.onload = function(){
			ctx.drawImage(startBg, 0, 0);
		};

		//new a character
		var image = new Image();
		var image2 = new Image();
		image2.src = "img/cat2.png"
		image.src = "img/cat1.png";		
		image.onload = ()=>{
			this.charater = new Character(this.startX, this.startY, image,image2);
		}

		//Obstacle 障碍物  
		this.obs = new Image();
		this.obsB = new Image();
		this.obs.src = "img/zhuzi1.png";
		this.obsB.src = "img/zhuzi2.png"
		this.obs.onload = () => {
			this.obsB.onload = () => {
				var h = 100; // The height of first obstacle默认第一障碍物上管道高度为100
				var h2 = this.canvasHeight - h - this.obsDistance;
				var obs1 = new Obstacle(this.canvasWidth, 0, h, this.obs);
				var obs2 = new Obstacle(this.canvasWidth, this.canvasHeight - h2, h2 - this.landHeight, this.obsB);
				this.obsList.push(obs1); //push in the list
				this.obsList.push(obs2);
			}
			
		};
	},

	//Mingrong Sun
	//creat Obstacle
	createObs() {
		// obstacle random height随机产生障碍物上管道高度
		var h = Math.floor(Math.random() * (this.canvasHeight - this.obsDistance - this.landHeight));
		var h2 = this.canvasHeight - h - this.obsDistance;
		var obs1 = new Obstacle(this.canvasWidth, 0, h, this.obs);
		var obs2 = new Obstacle(this.canvasWidth, this.canvasHeight - h2, h2 - this.landHeight, this.obsB);
		this.obsList.push(obs1);
		this.obsList.push(obs2);

		// remove the outside obstacle移除越界障碍物  
		if (this.obsList[0].x < this.obsList[0].width)
			this.obsList.splice(0, 2);
	},

	//Zihan Teng
	//draw the obstacle绘制障碍物
	drawObs() {  
		ctx.fillStyle = "#00ff00";
		for (var i = 0; i < this.obsList.length; i++) {
			this.obsList[i].x -= this.obsSpeed;
			if (i % 2)
				this.obsList[i].draw(ctx, "top");
			else
				this.obsList[i].draw(ctx, "bottom");
		}
	},

	//YiZhong
	// count the score计分
	CountScore() { 
		if (this.score == 0 && this.obsList[0].x + this.obsList[0].width < this.startX) {
			console.log(this.obsList[0].x + this.obsList[0].width)
			this.score = 1;
			return true;
		}
		return false;
	},

	//MingRong Sun
	displayFinal(){
		return this.score
	},
	// display the score显示分数
	ShowScore() {   
		ctx.strokeStyle = "#000";
		ctx.fillStyle = "#fff"
		ctx.lineWidth = 1;
		ctx.fillText(this.score, 10, 50);
		ctx.strokeText(this.score, 10, 50);
	},

	//Zihan Teng
	// check collision with obstacle and flowers
	Alive() { 
		if (this.charater.y < 0 || this.charater.y > this.canvasHeight - this.charater.height - this.landHeight) {
			console.log(this.canvasHeight - this.charater.height - this.landHeight)
			this.gameOver = true;
		} else {
			let boundary = [{ x: this.charater.x, y: this.charater.y}, 
				{ x: this.charater.x + this.charater.width,y: this.charater.y}, 
				{ x: this.charater.x, y: this.charater.y + this.charater.height}, 
				{ x: this.charater.x + this.charater.width, y: this.charater.y + this.charater.height}
			];
			for (let i = 0; i < this.obsList.length; i++) {
				for (let j = 0; j < 4; j++) {
					let border = this.obsList[i].y + this.obsList[i].height
					if(this.obsList[i].hasFlower) border = this.obsList[i].y + this.obsList[i].height + 20
					if (boundary[j].x >= this.obsList[i].x && boundary[j].x <= this.obsList[i].x + this.obsList[i].width && boundary[j].y >= this.obsList[i].y && boundary[j].y <= border) {
						
						this.gameOver = true;
						break;
					}
				}	
				if (this.gameOver)
					break;
			}
		}
	},

	//Zihan Teng
	//if the score>80 , change the difficulty
	checkLevel() {
		if(this.score > 80) {
			//MyGame.prototype.obsInterval = 1500
			times++
			if(times === 1) {
				clearInterval(timer)
				let obsNewTimer = setInterval(function() {
					if (game.gameOver) {
						clearInterval(obsNewTimer);
						return;
					}
					game.createObs();
				}, 1500);
			}
		}
	},
	// check touch
	checkTouch() {       
		if (this.touch) {
			this.charater.y -= this.upSpeed;
			jump.play()
			this.charater.draw(ctx, "top");
		} else {
			this.charater.y += this.downSpeed;
			this.charater.draw(ctx, "bottom");
		}
	},
	// clear the screen
	Clear() { 
		ctx.drawImage(this.bg, 0, 0);
	},
	//game over
	showOver() {
		var overImg = new Image();
		overImg.src = "img/over.png";
		overImg.onload = () => {
			ctx.drawImage(overImg, (this.canvasWidth - overImg.width) / 2, (this.canvasHeight - overImg.height) / 2 - 50);
		};
		return;
	}
};

// new a game
var game = new MyGame();
var Speed = 20;
var isPlay = false;
var GameTime = null;
var rank = null; //ranking
var timer = null; // Resolve the scope chain problem
var times = 0; // Check execution times
var number = 1; //determine display which image
window.onload = InitGame;

//Yi Zhong
//Init the game
function InitGame() {
	ctx.font = "2em Calibri";
	game.setGame();

	canvas.onmousedown = function() {
		game.touch = true;
	}
	canvas.onmouseup = function() {
		game.touch = false;
	};
	canvas.onclick = function() {
		if (!isPlay) {
			isPlay = true;
			GameTime = Run(Speed);
		}
	}
}

//Zihan Teng
//function to run the game
function Run(speed) {
	var runTimer = setInterval(function() {
		// set a timer when the charater pass first obstacle若小鸟通过第一个障碍物启动记分器
		if (game.CountScore()) {
			var scoreTimer = setInterval(function() {
				if (game.gameOver) {
					clearInterval(scoreTimer);
					return;
				}
				game.score++;
			}, game.obsInterval);
		}

		game.Alive();
		//Yi Zhong
		//put the grade in the localStorage
		if (game.gameOver) {
			game.showOver();
			deathMusic.play()
			// make a rank list
			let arr = []
			if(!window.localStorage.getItem("rank")){
				rank = 1
			}
			else{
				let score = game.displayFinal()
				let rankList = JSON.parse(window.localStorage.getItem("rank"))
				let grade = rankList.findIndex(item => {
					return item <= score
				})
				rank = grade + 1
				if(grade === -1) {
					rank = rankList.length
				}
				arr = rankList
			}
			arr.push(game.displayFinal())
			arr.sort(compare)
			window.localStorage.setItem("rank",JSON.stringify(arr))
			setTimeout(function(){
				// canvas.style.display = "none"
				credit.style.display = "block";
				displayScore.innerHTML = "Score:" + game.displayFinal()
				rankDisplay.innerHTML = "Rank:" + rank
				console.log(rank);
			},1000)
			clearInterval(runTimer);
			return;
		}
		game.Clear();
		game.checkLevel()
		game.drawObs();
		game.checkTouch();
		game.ShowScore();
	}, speed);
	var obsTimer = setInterval(function() {
		if (game.gameOver) {
			clearInterval(obsTimer);
			return;
		}
		game.createObs();
	}, game.obsInterval);
	timer = obsTimer
	var numberTimber = setInterval(function() {
		if(game.gameOver) {
			clearInterval(numberTimber);
			return 
		}
		number++
	},1000)
}

//import
//provide compare function to Array.sort method
function compare(value1, value2) {
 //return value1 - value2;
	if(value1 < value2) {
		return 1;
	} else if(value1 > value2) {
		return -1;
	} else {
		return 0;
	}
}

//Zihan Teng
//restart the game
function restart(){
	window.location.reload()
}


//Mingrong Sun
//choose level
function easy() {
	MyGame.prototype.obsDistance = 200;
}

function medium() {
	MyGame.prototype.obsDistance = 100;
}
