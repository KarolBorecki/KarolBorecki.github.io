let cnvs;

let canvasWidth;
let canvasHeight;

var isPlaying = false;
var points = 0;

let playBtn;
let playBtnImg;

let player;
let playerImg;

let floorImg;
let lifeImg;
let pickUpEffectImg;

var ingredientsImg = [];
var temp;
let ingredientsTypesCount = 5;

var lifesLeft = 3;

var timeToNextIngredient = 1.5;
var timeToAddingredient = 5;
var ingredientsCount = 5;

var maxSpeed = 5;

var increasingSpawn = 0.1;

function preload() {
  playBtnImg = loadImage("img/Play.png");
  playerImg = loadImage("img/pizza.png");
  for(var i = 0; i<ingredientsTypesCount; i++)
    ingredientsImg.push(loadImage("img/ingredients/ingredient" + i.toString() + ".png"));

  floorImg = loadImage("img/floor.png");
  lifeImg = loadImage("img/life.png");
  pickUpEffectImg = loadImage("img/pickUpEffect.png");

  canvasWidth = windowWidth*0.6;
  canvasHeight = canvasWidth/1.8;
}

function setup() {
  cnvs = createCanvas(canvasWidth, canvasHeight);
  cnvs.touchStarted(click);

  playBtn = new Button(canvasWidth/2 - canvasWidth/20, canvasHeight/2  - canvasWidth/20, playBtnImg, canvasWidth/10, canvasWidth/10);
  gameOver();
}

function draw() {
  background(255, 252, 212);
  if(!isPlaying){
    playBtn.display();
    return;
  }
  image(floorImg, 0, canvasHeight-canvasWidth/9, canvasWidth, canvasWidth/9);
  mouseY = 0;
  noCursor();
  player.display();

  textSize(canvasWidth/20);
  text(points, canvasWidth - canvasWidth/10, 0, canvasWidth/10, canvasWidth/10);
  for(var i=0; i<lifesLeft; i++)
    image(lifeImg, canvasWidth/31*i, 0, canvasWidth/30, canvasWidth/30);

  player.ingredients.forEach((ingredient, i) => {
    ingredient.display();
  });
}

//TODO move this function to ingredient as method
function getRandomIngredientX(){
  return random(canvasWidth/10, canvasWidth-canvasWidth/10);
}

function getRandomIngredientY(){
  return random(-canvasWidth/8, -canvasWidth/9);
}
//End of TODO

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function play(){
  isPlaying =  true;
}

function gameOver(){
  isPlaying = false;
  player = new Player(canvasWidth/4, canvasWidth/8, playerImg, [0,1,2,3,4], 5);
  player.start();
}

function mouseClicked() {
  click();
}

function click(){
  if(playBtn.over()){
    play()
    console.log("PLAY!");
  }
  return false;
}

class Player {
  constructor(width, height, img, types, typesCount){
    this.width = width;
    this.height = height;
    this.img = img;

    this.ingredientstsTypes = types;
    this.typesCount = typesCount;

    this.ingredients = [];

    this.startPosX = canvasWidth/2 - width/2;
    this.startPosY = canvasHeight - this.height;

    this.lastFall = 0;
  }

  start(){
    for(var i=0; i<ingredientsCount; i++){
      player.ingredients.push(new Ingredient(player.ingredientstsTypes[i%(this.typesCount-1)]));
      console.log(i + " - type = " + player.ingredients[i].type);
    }

    console.log("Count: " + player.ingredients.length);

    setInterval(this.fallIngredient, timeToNextIngredient*1000);
    setInterval(this.addRandomIngredient, timeToAddingredient*1000);
  }

  display(){
    image(this.img, mouseX - this.width/2, this.startPosY, this.width, this.height);
    noTint();
  }

  fallIngredient(){
    if(!isPlaying) return;
    console.log("Trying to fall with lastFall = " + player.lastFall);
    for(var i=player.lastFall; i<player.ingredients.length; i++)
      if(!player.ingredients[i].isFalling){
        player.ingredients[i].fall();
        console.log("Falling: " + player.ingredients[i].type);
        player.lastFall=getRandomInt(0, player.ingredients.length-1);
        break;
      }
  }

  addRandomIngredient(){
    if(!isPlaying) return;
    let type = player.ingredientstsTypes[getRandomInt(0, player.typesCount-1)];
    console.log("Spawning: " + type + " - - - " + player.ingredients);
    player.ingredients.push(new Ingredient(type));
    ingredientsCount++;

  }
}

class Ingredient {
  constructor(type){
    this.img = ingredientsImg[type];
    this.width = canvasWidth/10;
    this.type = type;

    this.renew();
}

  display(){
    if(!this.isFalling) return;
    if(!this.isPicked){
      this.standardY += this.speed;
      image(this.img, this.x, this.standardY, this.width, this.width);
    }else {
      image(pickUpEffect, this.x, this.y-100, this.width, this.width);
      setTimeout(this.renew, 500);
    }
    if(this.standardY > canvasHeight) {
      lifesLeft--;
      if(lifesLeft<=0) gameOver();
      this.renew();
    }
    else if(this.standardY > player.startPosY - player.width/4 &&
      this.standardY < player.startPosY + player.width/5 &&
      this.x > mouseX - player.width/2 - this.width/4 &&
      this.x < mouseX + player.width/2 + this.width/4) {
      points++;

      this.isPicked = true;
    }
  }

  fall(){
    this.isFalling = true;
  }

  renew(){
    this.standardY = getRandomIngredientY();
    this.x = getRandomIngredientX();
    this.isFalling = false;
    this.speed = random(2,maxSpeed);
    this.isPicked = false;
  }
}

class Button {
  constructor(posX, posY, img, width, height) {
    this.x = posX;
    this.y = posY;
    this.img = img;
    this.width = width;
    this.height = height;
  }

  display() {
    stroke(0);
    if (this.over()) tint(204, 0, 128);
    else noTint();

    image(this.img, this.x, this.y, this.width, this.height);
  }

  over() {
    return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
  }
}
