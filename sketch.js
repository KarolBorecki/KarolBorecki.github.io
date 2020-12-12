let cnvs;

let canvasWidth;
let canvasHeight;

var isPlaying = false;
var points = 0;
var lifesLeft = 3;

var maxSpeed = 7;
var minSpeed = 4;

var timeToNextIngredient = 1300;
var timeToAddingredient = 15000;
var ingredientsCount = 5;

var time = 0;

let playBtn;
let playBtnImg;

var player;
var playersImg = [];
let playersTypesCount = 6;

var ingredientsImg = [];
let ingredientsTypesCount = 21;

//layout Img
let floorImg;
let lifeImg;
let pickUpEffectImg;

var playersIngredients = [[0, 11, 18, 19, 16], //4 sery
[10, 6, 19, 5, 2], //chicken curry
[15, 19, 1, 20, 8], //ham garlic
[3, 20, 19, 12, 14], //ham
[16, 20, 19, 7, 5], //hot salame
[14, 19, 4, 20, 3],//mushroom
]


function preload() {
  canvasWidth = windowWidth*0.6;
  canvasHeight = canvasWidth/1.8;

  playBtnImg = loadImage("img/layout/play.png");
  floorImg = loadImage("img/layout/floor.png");
  pickUpEffectImg = loadImage("img/layout/pickupEffect.png");

  //TODO wrap to one loop
  for(var i = 0; i<ingredientsTypesCount; i++)
    ingredientsImg.push(loadImage("img/ingredients/ingredient" + i.toString() + ".png"));
  for(var i = 0; i<playersTypesCount; i++)
    ingredientsImg.push(loadImage("img/players/player" + i.toString() + ".png"));
  //END OF TODO
}

function setup() {
  frameRate(40);

  cnvs = createCanvas(canvasWidth, canvasHeight);
  cnvs.touchStarted(click);

  playBtn = new Button(canvasWidth/2 - canvasWidth/20, canvasHeight/2  - canvasWidth/20,
    playBtnImg, canvasWidth/10, canvasWidth/10);
  gameOver();
}

function draw() {
  background(255, 252, 212);
  if(!isPlaying){
    playBtn.display();
    cursor(CROSS);
    return;
  }
  noCursor();
  mouseY = 0;

  image(floorImg, 0, canvasHeight-canvasWidth/9, canvasWidth, canvasWidth/9);
  
  player.display();
  player.ingredients.forEach((ingredient, i) => {ingredient.display();});

  textSize(canvasWidth/20);
  text(points, canvasWidth - canvasWidth/10, 0, canvasWidth/10, canvasWidth/10);
  time += 25;
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
  player = new Player(0, canvasWidth/4, canvasWidth/8, playerImg, playersIngredients[0], 4);
  lifesLeft = 3;
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

    //setInterval(this.fallIngredient, timeToNextIngredient*1000);
    //setInterval(this.addRandomIngredient, timeToAddingredient*1000);
  }

  display(){
    image(this.img, mouseX - this.width/2, this.startPosY, this.width, this.height);
    noTint();

    if(time%timeToNextIngredient == 0) this.fallIngredient();
    if(time%timeToAddingredient == 0) this.addRandomIngredient();
  }

  fallIngredient(){
    if(!isPlaying) return;
    console.log("Trying to fall with lastFall = " + player.lastFall);
    player.lastFall=getRandomInt(0, player.ingredients.length-1);
    for(var i=player.lastFall; i<player.ingredients.length; i++)
      if(!player.ingredients[i].isFalling){
        player.ingredients[i].fall();
        console.log("Falling: " + player.ingredients[i].type);
        break;
      }
  }

  addRandomIngredient(){
    if(!isPlaying) return;
    let type = player.ingredientstsTypes[getRandomInt(0, player.typesCount-1)];
    console.log("Spawning: " + type + " - speed: " + maxSpeed + " - timeToNextIngredient: " + timeToNextIngredient + " ingredientsCount: " + ingredientsCount);
    player.ingredients.push(new Ingredient(type));
    ingredientsCount++;
    if(timeToNextIngredient > 300)
      timeToNextIngredient-=100;
    minSpeed+=0.1;
    maxSpeed+=0.1;
  }
}

class Ingredient {
  constructor(type){
    this.img = ingredientsImg[type];
    this.width = canvasWidth/10;
    this.type = type;

    this.renew();

    this.selfTimer = 0;
}

  display(){
    if(!this.isFalling) return;
    if(!this.isPicked){
      this.standardY += this.speed;
      image(this.img, this.x, this.standardY, this.width, this.width);
      if(this.standardY > canvasHeight) {
        lifesLeft--;
        if(lifesLeft<=0) gameOver();
        this.renew();
      }
      else if(this.standardY > player.startPosY - player.width/4 &&
        this.standardY < player.startPosY + player.width/6 &&
        this.x > mouseX - player.width/2 - this.width/4 &&
        this.x < mouseX + player.width/2 - this.width/4 && !this.isPicked) {
        points++;

        this.isPicked = true;
      }
    }else {
      image(pickUpEffectImg, this.x, this.standardY, this.width, this.width/3);
      this.selfTimer += 25;
      if(this.selfTimer % 125 == 0) this.renew();
    }
  }

  fall(){
    this.isFalling = true;
  }

  renew(){
    this.standardY = getRandomIngredientY();
    this.x = getRandomIngredientX();
    this.isFalling = false;
    this.speed = random(minSpeed, maxSpeed);
    this.isPicked = false;
    this.selfTimer = 0;
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
