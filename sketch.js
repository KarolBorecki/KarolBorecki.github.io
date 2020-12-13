let cnvs;

let canvasWidth;
let canvasHeight;

var gameStatus = 0;
var points = 0;
var lifesLeft = 3;

var maxSpeed = 7;
var minSpeed = 4;

var timeToNextIngredient = 1300;
var timeToAddingredient = 15000;
var ingredientsCount = 5;

var time = 0;

var choosenPizza = 0;

let playBtn;
let playBtnImg;

let arrowLeft;
let arrowRight;
let arrowRightImg;
let arrowLeftImg;

var player;
var playersImg = [];
let playersTypesCount = 6;

var ingredientsImg = [];
let ingredientsTypesCount = 21;

//layout Img
let floorImg;
let lifeImg;
let pickUpEffectImg;
let underline;
let pointsFrame;
let xImg;
let okImg

var playersIngredients = [[0, 11, 18, 19, 16], //4 sery
[10, 6, 19, 5, 2], //chicken curry
[15, 19, 1, 20, 8], //ham garlic
[3, 20, 19, 12, 14], //ham
[16, 20, 19, 7, 5], //hot salame
[14, 19, 4, 20, 3],//mushroom
]

var pizzaNames = ["4 sery", "Chicken curry", "Ham garlic", "Ham",
"Hot salame", "Mushroom"];

function preload() {
  canvasWidth = windowWidth*0.6;
  canvasHeight = canvasWidth/1.8;

  playBtnImg = loadImage("img/layout/start.png");
  floorImg = loadImage("img/layout/floor.png");
  pickUpEffectImg = loadImage("img/layout/pickupEffect.png");
  underline = loadImage("img/layout/underline.png");
  pointsFrame = loadImage("img/layout/counterFrame.png");
  xImg = loadImage("img/layout/x.png");
  okImg = loadImage("img/layout/ok.png");

  arrowRightImg = loadImage("img/layout/arrow.png");
  arrowLeftImg = loadImage("img/layout/arrowLeft.png");

  //TODO wrap to one loop
  for(var i = 0; i<ingredientsTypesCount; i++)
    ingredientsImg.push(loadImage("img/ingredients/ingredient" + i.toString() + ".png"));
  for(var i = 0; i<playersTypesCount; i++)
    playersImg.push(loadImage("img/players/player" + i.toString() + ".png"));
  //END OF TODO
}

function setup() {
  frameRate(40);

  cnvs = createCanvas(canvasWidth, canvasHeight);
  cnvs.touchStarted(click);

  playBtn = new Button(canvasWidth*5/12, canvasHeight-canvasWidth/6,
    playBtnImg, canvasWidth/7, canvasWidth/7);
  arrowLeft  = new Button(canvasWidth*3/16, canvasHeight/2+canvasWidth/22,  arrowLeftImg, canvasWidth/8, canvasWidth/11)
  arrowRight  = new Button(canvasWidth*11/16, canvasHeight/2+canvasWidth/22,  arrowRightImg, canvasWidth/8, canvasWidth/11)
}

function draw() {
  background(255, 252, 212);
  if(gameStatus == 0){
    textSize(canvasWidth/18);
    textAlign(CENTER);
    fill('#a91f13');
    text("Zagraj!", canvasWidth/4, canvasHeight/8, canvasWidth/2, canvasWidth/8);
    image(underline, canvasWidth/4, canvasHeight/4.5, canvasWidth/2, canvasWidth/16);

    image(playersImg[choosenPizza], canvasWidth*3/8, canvasHeight/2-canvasWidth/14, canvasWidth/4, canvasWidth/7);
    image(playersImg[getNextPizzaImgIndex(false)], canvasWidth/8, canvasHeight/2-canvasWidth/22, canvasWidth/8, canvasWidth/11);
    image(playersImg[getNextPizzaImgIndex(true)], canvasWidth*3/4, canvasHeight/2-canvasWidth/22, canvasWidth/8, canvasWidth/11);

    textAlign(CENTER);
    textSize(canvasWidth/30);
    text(pizzaNames[choosenPizza], canvasWidth*3/8, canvasHeight/2+canvasWidth/11, canvasWidth/4, canvasWidth/11)

    playBtn.display();
    arrowLeft.display();
    arrowRight.display();
    cursor(CROSS);
    return;
  }
  else if(gameStatus == 1){
    textSize(canvasWidth/18);
    textAlign(CENTER);
    fill('#a91f13');
    text(pizzaNames[choosenPizza], canvasWidth/4, canvasHeight/8, canvasWidth/2, canvasWidth/8);
    image(underline, canvasWidth/4, canvasHeight/4.5, canvasWidth/2, canvasWidth/16);

    for(var i = 0; i<5; i++){
      if(i<4)image(okImg, (canvasWidth/6 + canvasWidth/6*(i)), canvasHeight/2-canvasWidth/12, canvasWidth/15, canvasWidth/15);
      image(ingredientsImg[playersIngredients[choosenPizza][i]], (canvasWidth/12 + canvasWidth/6*i), canvasHeight/2-canvasWidth/10, canvasWidth/6, canvasWidth/6);
    }

    playBtn.display();
    cursor(CROSS);
    return;
  }else{
    noCursor();
    mouseY = 0;

    image(floorImg, 0, canvasHeight-canvasWidth/9, canvasWidth, canvasWidth/9);

    player.display();
    player.ingredients.forEach((ingredient, i) => {ingredient.display();});

    textSize(canvasWidth/16);
    textAlign(CENTER);
    text(points, canvasWidth - canvasWidth/12, canvasWidth/10);
    image(pointsFrame, canvasWidth - canvasWidth/6, 0, canvasWidth/6, canvasWidth/6);

    time += 25;
  }
}

//TODO move this function to ingredient as method
function getRandomIngredientX(){
  return random(canvasWidth/10, canvasWidth-canvasWidth/10);
}

function getRandomIngredientY(){
  return random(-canvasWidth/8, -canvasWidth/9);
}
//End of TODO

function getNextPizzaImgIndex(increment){
  return increment ? ((choosenPizza+1)%(playersTypesCount)) : ((choosenPizza > 0) ? choosenPizza-1 : playersTypesCount-1)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mouseClicked() {
  click();
}

function click(){
  if(playBtn.over()){
    gameStatus = (gameStatus==0) ? 1 : 2;
    player = new Player(choosenPizza, canvasWidth/4, canvasWidth/8, playersIngredients[choosenPizza], 4);
    player.start();
    console.log("PLAY!");
    return;
  }else if(arrowLeft.over()){
    choosenPizza = getNextPizzaImgIndex(false);
    console.log("click - left  -  " + choosenPizza);
    return;
  }else if(arrowRight.over()){
    choosenPizza = getNextPizzaImgIndex(true);
    console.log("click - right - " + choosenPizza);
    return;
  }

}

class Player {
  constructor(type, width, height, ingredientTypes, typesCount){
    this.width = width;
    this.height = height;
    this.img = playersImg[type];

    this.ingredientstsTypes = ingredientTypes;
    this.typesCount = typesCount;

    this.ingredients = [];

    this.startPosX = canvasWidth/2 - width/2;
    this.startPosY = canvasHeight - this.height;

    this.lastFall = 0;

    this.x = 0;
  }

  start(){
    for(var i=0; i<ingredientsCount; i++){
      player.ingredients.push(new Ingredient(player.ingredientstsTypes[i%(this.typesCount-1)]));
      console.log(i + " - type = " + player.ingredients[i].type);
    }

    console.log("Count: " + player.ingredients.length);
  }

  display(){
    if(gameStatus == 2){
      this.x = mouseX - this.width/2;
      image(this.img, this.x, this.startPosY, this.width, this.height);
      noTint();

      if(time%timeToNextIngredient == 0) this.fallIngredient();
      if(time%timeToAddingredient == 0) this.addRandomIngredient();
    }else{
      image(this.img, this.x, this.startPosY, this.width, this.height);
    }
  }

  fallIngredient(){
    if(gameStatus != 2) return;
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
    if(gameStatus != 2) return;
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
        if(lifesLeft<=0) gameStatus = 3;
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
      image(pickUpEffectImg, this.x-this.width/4, this.standardY+this.width/4, this.width*1.5, this.width*1.5);
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
    if (this.over()) noTint();
    else noTint();

    image(this.img, this.x, this.y, this.width, this.height);
  }

  over() {
    return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
  }
}
