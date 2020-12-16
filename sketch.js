let cnvs;

let canvasWidth;
let canvasHeight;

let font;
let fontBold;

var gameStatus = 0;
var points = 0;

var maxSpeed = 5;
var minSpeed = 3.5;

var startMaxSpeed = 1;
var startMinSpeed = 1;

var timeToNextIngredient;
var timeToNextBadIngredient;
var timeDivider;
var ingredientsCount = 5;

var time = 0;

var choosenPizza = 0;

let playBtn;
let playBtnImg;
let playBtnAnim;

let arrowLeft;
let arrowRight;
let arrowRightImg;
let arrowLeftImg;

var player;
var playersImg = [];
let playersTypesCount = 9;

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
let endImg;

let playAgainBtn;
let playAgainBtnImg;

let playGIF;

var playersIngredients = [[0, 11, 18, 19, 16], //4 Cheese
[10, 6, 19, 5, 2], //Chicken curry
[15, 19, 1, 20, 8], //ham garlic
[3, 20, 19, 12, 14], //ham
[16, 20, 19, 7, 5], //hot salame
[14, 19, 4, 20, 3],//mushroom
[4, 17, 19, 13, 12],//barbecue
[2, 8, 12, 19, 13],//kebab
[19, 9, 16, 5, 7]//Salami
]

var pizzaNames = ["4 Cheese", "Chicken Curry", "Ham & Garlic Sauce", "Ham",
"Ham & Salami hot", "Ham & Mushroom", "Barbecue", "Kebab", "Salami"];

var arrowMove = 0;
var arrowMoveRight = true;

function preload() {
  canvasWidth = windowWidth;
  canvasHeight = canvasWidth/1.8;
  if(canvasHeight>windowHeight){
    canvasHeight=windowHeight;
    canvasWidth = canvasHeight*1.8;
  }

  playBtnImg = loadImage("img/layout/start_01.png");
  playAgainBtnImg = loadImage("img/layout/playAgain.png");

  floorImg = loadImage("img/layout/floor.png");
  pickUpEffectImg = loadImage("img/layout/pickupEffect.png");
  underline = loadImage("img/layout/underline.png");
  pointsFrame = loadImage("img/layout/counterFrame.png");
  xImg = loadImage("img/layout/x.png");
  okImg = loadImage("img/layout/ok.png");
  endImg = loadImage("img/layout/gameoverScreen.png");

  arrowRightImg = loadImage("img/layout/arrow.png");
  arrowLeftImg = loadImage("img/layout/arrowLeft.png");

  //pickupAnim = loadImage("img/layout/pickupEffect-Anim.gif");

  for(var i = 0; i<ingredientsTypesCount; i++){
    ingredientsImg.push(loadImage("img/ingredients/ingredient" + i.toString() + ".png"));
    if(i<playersTypesCount)playersImg.push(loadImage("img/players/player" + i.toString() + ".png"));
  }
}

function setup() {
  frameRate(40);

  cnvs = createCanvas(canvasWidth, canvasHeight);
  cnvs.touchStarted(click);

  playBtn = new Button(canvasWidth*5/12, canvasHeight-canvasWidth/7,
    playBtnImg, canvasWidth/7, canvasWidth/7);
  playAgainBtn = new Button(canvasWidth/2-canvasWidth/14, canvasHeight/2,
    playAgainBtnImg, canvasWidth/7, canvasWidth/7);

  arrowLeft  = new Button(canvasWidth*3/16, canvasHeight/2+canvasWidth/22,  arrowLeftImg, canvasWidth/8, canvasWidth/11)
  arrowRight  = new Button(canvasWidth*11/16, canvasHeight/2+canvasWidth/22,  arrowRightImg, canvasWidth/8, canvasWidth/11)

  playGIF = new Gif("img/layout/playBtn", 15, 0, 0, 200, 200);
}

function draw() {
  background(255, 252, 212);
  noTint();
  playGIF.display();
  playGIF.play();
  if(gameStatus == 0){
    textSize(canvasWidth/18);
    textAlign(CENTER);
    fill('#a91f13');
    text("Zagraj!", canvasWidth/4, canvasHeight/9, canvasWidth/2, canvasWidth/8);
    image(underline, canvasWidth/4, canvasHeight/4.5, canvasWidth/2, canvasWidth/16);

    image(playersImg[choosenPizza], canvasWidth*3/8, canvasHeight/2-canvasWidth/14, canvasWidth/4, canvasWidth/7);
    image(playersImg[getNextPizzaImgIndex(false)], canvasWidth/8, canvasHeight/2-canvasWidth/22, canvasWidth/8, canvasWidth/11);
    image(playersImg[getNextPizzaImgIndex(true)], canvasWidth*3/4, canvasHeight/2-canvasWidth/22, canvasWidth/8, canvasWidth/11);

    textAlign(CENTER);
    textSize(canvasWidth/30);
    text(pizzaNames[choosenPizza], canvasWidth*3/8, canvasHeight/2+canvasWidth/12, canvasWidth/4, canvasWidth/11)

    playBtn.display(canvasWidth*5/12, canvasHeight-canvasWidth/7);
    //playBtnAnim.position(canvasWidth*5/12+canvasWidth/100, canvasHeight-canvasWidth/7+canvasWidth/100);
    //playBtnAnim.size(canvasWidth/7, canvasWidth/7);


    if(Math.abs(arrowMove)>canvasWidth/100) arrowMoveRight = !arrowMoveRight;
    arrowMove += (arrowMoveRight) ? 2 : -2;
    if(!arrowLeft.over() && !arrowRight.over()) arrowMove = 0;
    arrowLeft.display(canvasWidth*3/16 + (arrowLeft.over() ? arrowMove : 0), canvasHeight/2+canvasWidth/22);
    arrowRight.display(canvasWidth*11/16 + (arrowRight.over() ? arrowMove : 0), canvasHeight/2+canvasWidth/22);

    cursor(CROSS);

    return;
  }
  else if(gameStatus == 1){
    textSize(canvasWidth/28);
    textAlign(CENTER);
    fill('#a91f13');
    text(pizzaNames[choosenPizza], canvasWidth/4, canvasHeight/9, canvasWidth/2, canvasWidth/8);
    image(underline, canvasWidth/4, canvasHeight/4.5, canvasWidth/2, canvasWidth/16);

    for(var i = 0; i<5; i++){
      image(ingredientsImg[playersIngredients[choosenPizza][i]], (canvasWidth/12 + canvasWidth/6*i), canvasHeight/2 - ((i%2==0) ? canvasWidth/28 :  canvasWidth/14), canvasWidth/6, canvasWidth/6);
      if(i<4)image(okImg, (canvasWidth/6 + canvasWidth/6*i), canvasHeight/2-canvasWidth/10 + ((i%2==0) ? canvasWidth/28 : 0), canvasWidth/15, canvasWidth/15);
    }
    image(xImg, (canvasWidth/12 + canvasWidth/6*4), canvasHeight/2 - canvasWidth/28, canvasWidth/6, canvasWidth/6);

    playBtn.display();
    cursor(CROSS);
    return;
  }else{
    noCursor();
    image(floorImg, 0, canvasHeight-canvasWidth/9, canvasWidth, canvasWidth/9);

    if(gameStatus == 2){
      mouseY = 0;
      player.display();
      player.ingredients.forEach((ingredient, i) => {ingredient.display();});
      player.badIngredient.forEach((badIngredient, i) => {badIngredient.display();});

      textSize(canvasWidth/22);
      textAlign(CENTER);
      text(points, canvasWidth - canvasWidth/18, canvasWidth/14);
      image(pointsFrame, canvasWidth - canvasWidth/9, 0, canvasWidth/9, canvasWidth/9);
    }

    if(gameStatus == 3){
      image(endImg, 0,0, canvasWidth, canvasHeight);
      textAlign(CENTER);
      fill('#fffcd3');
      textSize(canvasWidth/19);
      text("Game Over", canvasWidth/2, canvasHeight/4);
      textSize(canvasWidth/34);
      text("Udało ci się zebrać " + points + " składniki możesz zrobić", canvasWidth/4, canvasHeight*7/25, canvasWidth/2);
      textSize(canvasWidth/19);
      text(Math.floor(points/3) + " Pizz!!!", canvasWidth/2, canvasHeight/2);

      playAgainBtn.display();

      cursor(CROSS);
    }
    time += 25;
  }
}

function getRandomIngredientX(){
  return random(canvasWidth/10, canvasWidth-canvasWidth/10);
}

function getRandomIngredientY(){
  return random(-canvasWidth/8, -canvasWidth/9);
}

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
  if(gameStatus == 2) return;
  if(playBtn.over() && (gameStatus == 0 || gameStatus == 1)){
    gameStatus = (gameStatus==0) ? 1 : 2;
    player = new Player(choosenPizza, canvasWidth/4, canvasWidth/8, playersIngredients[choosenPizza], 4);
    points = 0;
    time = 0;

    startMaxSpeed = 1;
    startMinSpeed = 1;
    timeDivider = 1;

    timeToNextIngredient = 60;
    timeToNextBadIngredient = 170;
    ingredientsCount = 5;
    player.start();
    console.log("----------------Play----------------");
  }
  if(arrowLeft.over() && gameStatus == 0){
    choosenPizza = getNextPizzaImgIndex(false);
    console.log("click - left  -  " + choosenPizza);
    playerChooseAnimationState = 1;
  }
  if(arrowRight.over() && gameStatus == 0){
    choosenPizza = getNextPizzaImgIndex(true);
    console.log("click - right - " + choosenPizza);
    playerChooseAnimationState = 1;
  }
  if(playAgainBtn.over() && gameStatus == 3){
    gameStatus = 0;
    console.log("----------------Again----------------");
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
    this.badIngredient = [];

    this.startPosX = canvasWidth/2 - width/2;
    this.startPosY = canvasHeight - this.height;

    this.lastFall = 0;
    this.lastFallBad = 0;

    this.x = 0;
  }

  start(){
    for(var i=0; i<ingredientsCount; i++){
      player.ingredients.push(new Ingredient(player.ingredientstsTypes[i%(this.typesCount-1)], false));
    }
    player.badIngredient[0] = new Ingredient(player.ingredientstsTypes[4], true);
    player.badIngredient[0].fall();

  }

  display(){
    if(gameStatus == 2){
      this.x = mouseX - this.width/2;
      image(this.img, this.x, this.startPosY, this.width, this.height);

      var val = Math.floor(timeToNextIngredient/Math.sqrt(timeDivider));
      console.log(val + " --------- " + time/25);

      if((time/25)%Math.floor(timeToNextIngredient/Math.sqrt(timeDivider)) == 0) this.fallIngredient();
      if((time/25)%Math.floor(timeToNextBadIngredient/Math.sqrt(timeDivider)) == 0) this.fallBadIngredient();
    }else{
      image(this.img, this.x, this.startPosY, this.width, this.height);
    }
  }

  fallIngredient(){
    if(gameStatus != 2) return;
    //console.log("Trying to fall with lastFall = " + player.lastFall);
    player.lastFall=getRandomInt(0, player.ingredients.length-1);
    for(var i=player.lastFall; i<player.ingredients.length; i++)
      if(!player.ingredients[i].isFalling){
        player.ingredients[i].fall();
        console.log("Falling: " + player.ingredients[i].type + " speed: " + player.ingredients[i].speed + " (" + maxSpeed * Math.sqrt(startMinSpeed) + ")");
        return;
      }
    player.addRandomIngredient();
  }

  fallBadIngredient(){
    if(gameStatus != 2 || player.badIngredient.isFalling) return;

    startMinSpeed += 0.4;
    startMaxSpeed += 0.4;
    timeDivider += 0.1;

    player.lastFallBad=getRandomInt(0, player.badIngredient.length-1);
    for(var i=player.lastFallBad; i<player.badIngredient.length; i++)
      if(!player.badIngredient[i].isFalling){
        player.badIngredient[i].fall();
        console.log("Falling bad ingredient " + player.badIngredient.type);
        return;
      }
    player.badIngredient.push(new Ingredient(player.ingredientstsTypes[4], true));
  }

  addRandomIngredient(){
    if(gameStatus != 2) return;
    let type = player.ingredientstsTypes[getRandomInt(0, player.typesCount-1)];
    console.log("Spawning: " + type + " - speed: " + maxSpeed * Math.sqrt(maxSpeed) +  " ingredientsCount: " + ingredientsCount);
    player.ingredients.push(new Ingredient(type, false));
    ingredientsCount++;
  }
}

class Ingredient {
  constructor(type, isBad){
    this.img = ingredientsImg[type];
    this.width = canvasWidth/7;
    this.type = type;
    this.isBad = isBad;

    this.renew();

    this.selfTimer = 0;
}

  display(){
    if(!this.isFalling) return;
    if(!this.isPicked){
      this.standardY += this.speed;
      image(this.img, this.x, this.standardY, this.width, this.width);
      if(this.standardY > canvasHeight) {
        this.renew();
      }
      else if(this.standardY > player.startPosY - player.width/4 &&
        this.standardY < player.startPosY + player.width/6 &&
        this.x > mouseX - player.width/2 - this.width/4 &&
        this.x < mouseX + player.width/2 - this.width/4 && !this.isPicked){
        if(this.isBad) gameStatus = 3;
        else points++;

        this.isPicked = true;
      }
    }else {
      image(pickUpEffectImg, this.x-this.width/2, this.standardY+this.width/8, this.width*2, this.width*2);
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
    this.speed = random(minSpeed * Math.sqrt(startMinSpeed), maxSpeed * Math.sqrt(startMaxSpeed)) * canvasHeight/800;
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

  display(x, y) {
    stroke(0);
    if (this.over()) tint(84, 28, 16);
    else noTint();//tint(65, 9, 7);

    image(this.img, x, y, this.width, this.height);
  }

  over() {
    return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
  }
}

class Gif {
  constructor(path, frames, posX, posY, width, height) {
    this.img = [];
    for(var i = 0; i<frames; i++)
      this.img[i] = loadImage(path.toString()+ "/" + (i+1).toString() + ".png");

    this.x = posX;
    this.y = posY;
    this.width = width;
    this.height = height;

    this.frames = frames;

    this.actualFrame = 0;
    this.isPlaying = false;
  }

  display(){
    image(this.img[this.actualFrame], this.x, this.y, this.width, this.height);
    if(this.isPlaying) this.actualFrame=(this.actualFrame+1)%(this.frames-1);
  }

  stop(){
    this.isPlaying = false;
  }

  play(){
    this.isPlaying = true;
  }
  setFrame(frame){
    this.actualFrame = frame;
  }
}
