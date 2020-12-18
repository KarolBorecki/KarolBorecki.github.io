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
let caption;
let pointsFrame;
let xImg;
let okImg
let endImg;
let endMobileImg;

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

var playerWidth;
var ingredientWidth;

var pizzaNames = ["4 Cheese", "Chicken Curry", "Ham & Garlic Sauce", "Ham",
"Ham & Salami hot", "Ham & Mushroom", "Barbecue", "Kebab", "Salami"];

var arrowMove = 0;
var arrowMoveRight = true;

var isVertical = false;
var wM, hM;

function preload() {
  setSizes();

  playGIF = new GifBtn("img/layout/playBtn", 28);

  font = loadFont("fonts/OpenSans-Regular.ttf")
  fontBold = loadFont("fonts/OpenSans-Bold.ttf")

  floorImg = loadImage("img/layout/floor.png");
  pickUpEffectImg = loadImage("img/layout/pickupEffect.png");
  underline = loadImage("img/layout/underline.png");
  caption = loadImage("img/layout/caption.png");
  pointsFrame = loadImage("img/layout/counterFrame.png");
  xImg = loadImage("img/layout/x.png");
  okImg = loadImage("img/layout/ok.png");
  endImg = loadImage("img/layout/gameoverScreen.png");
  endMobileImg = loadImage("img/layout/endView-Mobile.png");

  arrowRightImg = loadImage("img/layout/arrow.png");
  arrowLeftImg = loadImage("img/layout/arrowLeft.png");

  for(var i = 0; i<ingredientsTypesCount; i++){
    ingredientsImg.push(loadImage("img/ingredients/ingredient" + i.toString() + ".png"));
    if(i<playersTypesCount)playersImg.push(loadImage("img/players/player" + i.toString() + ".png"));
  }
}

function setup() {
  frameRate(40);
  cnvs = createCanvas(canvasWidth, canvasHeight);
  cnvs.parent("game");

  cnvs.touchStarted(mouseClicked);

  if(isVertical){
    minSpeed+=3;
    maxSpeed+=3;
  }

  arrowLeft  = new Button(arrowLeftImg)
  arrowRight  = new Button(arrowRightImg)


  playAgainGIF = new GifBtn("img/layout/playAgainBtn", 28);
}


function windowResized() {
  setSizes();
  resizeCanvas(canvasWidth, canvasHeight);
}

function setSizes(){
  canvasWidth = document.getElementById("game").offsetWidth;
  canvasHeight = document.getElementById("game").offsetHeight;
  wM = canvasWidth/30;
  hM = canvasHeight/19;
  if(canvasHeight>canvasWidth) {
    isVertical = true;
    playerWidth = canvasWidth/3;
    ingredientWidth = canvasWidth/4;
  }
  else {
    isVertical = false
    playerWidth = wM*5.5;
    ingredientWidth = wM*3.5;
  }
}

function touchMoved(event) {
  //console.log(event);
}

function draw() {
  background(167, 24, 20);
  noTint();
  textFont(font);
  if(gameStatus == 0) menuView();
  else if(gameStatus == 1) instructionView();
  else if(gameStatus == 2)gameView();
  else if(gameStatus == 3)endView();
}

function gameView(){
  noCursor();
  mouseY = 0;
  fill(255, 251, 210);
  textAlign(CENTER, CENTER);

  if(!isVertical){
    image(floorImg, wM*3, hM*17-wM*3, wM*24, wM*3);
    textSize(canvasWidth/22);
    text(points, wM*25.5, wM, wM*3.5, wM*3.5);
    image(pointsFrame, wM*25.5, wM, wM*3.5, wM*3.5);
  }else{
    image(floorImg, canvasWidth/2-canvasHeight*9/10, canvasHeight*8/10, canvasHeight*9/5, canvasHeight/5);
    textSize(canvasWidth/6);
    text(points, canvasWidth - canvasWidth/4, 0, canvasWidth/4, canvasWidth/4);
    image(pointsFrame, canvasWidth - canvasWidth/3, 0, canvasWidth/3, canvasWidth/3);
  }

  player.display(playerWidth, playerWidth/2);
  player.ingredients.forEach((ingredient, i) => {ingredient.display(ingredientWidth);});
  player.badIngredient.forEach((badIngredient, i) => {badIngredient.display(ingredientWidth);});

  time += 25;
}

function menuView(){
  fill(255, 251, 210);
  textAlign(CENTER, CENTER);
  textFont(fontBold);

  if(Math.abs(arrowMove)>canvasWidth/100) arrowMoveRight = !arrowMoveRight;
  arrowMove += (arrowMoveRight) ? 2 : -2;
  if(!arrowLeft.over() && !arrowRight.over()) arrowMove = 0;

  if(!isVertical){
    textSize(canvasWidth/38);
    image(caption, wM*10, hM*4, wM*10, wM*10/4);

    image(playersImg[choosenPizza], wM*11.5, hM*8, wM*7, wM*4);
    image(playersImg[getNextPizzaImgIndex(false)], wM*6, hM*8, wM*4, wM*2);
    image(playersImg[getNextPizzaImgIndex(true)], wM*20, hM*8, wM*4, wM*2);

    text(pizzaNames[choosenPizza], wM*9, hM*12, wM*12, hM*1.5);

    playGIF.display(wM*13, hM*14, wM*4, wM*4);

    arrowLeft.display(wM*8 + (arrowLeft.over() ? arrowMove : 0), hM*12, wM*3, wM*1.5);
    arrowRight.display(wM*19 + (arrowRight.over() ? arrowMove : 0), hM*12, wM*3, wM*1.5);
  }else{
    textSize(canvasWidth/17);
    image(caption, canvasWidth/10, canvasHeight/6, canvasWidth*4/5, canvasWidth/5);

    image(playersImg[choosenPizza], canvasWidth/4, canvasHeight*5/12-canvasWidth/14, canvasWidth/2, canvasWidth*3/10);
    image(playersImg[getNextPizzaImgIndex(false)], canvasWidth/4- canvasWidth/5, canvasHeight*5/12-canvasWidth/22, canvasWidth/5, canvasWidth*3/25);
    image(playersImg[getNextPizzaImgIndex(true)], canvasWidth*3/4, canvasHeight*5/12-canvasWidth/22, canvasWidth/5, canvasWidth*3/25);

    text(pizzaNames[choosenPizza], canvasWidth/8, canvasHeight*5/12-canvasWidth/14+canvasWidth*3/20+canvasWidth/8, canvasWidth*3/4, canvasWidth/8)

    playGIF.display(canvasWidth/3, canvasHeight-canvasWidth/3, canvasWidth/3, canvasWidth/3);

    arrowLeft.display(canvasWidth/20 + (arrowLeft.over() ? arrowMove : 0), canvasHeight/2+canvasWidth/6, canvasWidth/3, canvasWidth/6);
    arrowRight.display(canvasWidth*19/20-canvasWidth/3 + (arrowRight.over() ? arrowMove : 0), canvasHeight/2+canvasWidth/6, canvasWidth/3, canvasWidth/6);
  }
  cursor(CROSS);
}

function instructionView(){
  textAlign(CENTER, CENTER);
  fill(167, 24, 20);
  textFont(fontBold);

  if(!isVertical){
    textSize(canvasWidth/28);
    image(underline, wM*10, hM*3, wM*10, wM*10/4);
    text(pizzaNames[choosenPizza], wM*10, hM*3, wM*10, wM*10/4);

    for(var i = 0; i<5; i++){
      image(ingredientsImg[playersIngredients[choosenPizza][i]], (wM*5 + wM*4*i), ((i%2==0) ? hM*9 :  hM*7), wM*4, wM*4);
      if(i<4)image(okImg, (wM*7 + wM*4*i), ((i%2==0) ? hM*9 :  hM*7), wM*2, wM*2);
    }
    image(xImg, wM*21, hM*9, wM*4, wM*4);

    playGIF.display(wM*13, hM*14, wM*4, wM*4);
  }else{
    textSize(canvasWidth/14);
    image(underline, canvasWidth/10, canvasHeight/20, canvasWidth*4/5, canvasWidth*3/10);
    text(pizzaNames[choosenPizza], canvasWidth/10, canvasHeight/20, canvasWidth*4/5, canvasWidth*3/10);

    /*for(var i = 0; i<5; i++){
      image(ingredientsImg[playersIngredients[choosenPizza][i]], (canvasWidth/12 + canvasWidth/6*i), canvasHeight*7/16 - ((i%2==0) ? 0 :  canvasWidth/14), canvasWidth/6, canvasWidth/6);
      if(i<4)image(okImg, (canvasWidth/6 + canvasWidth/6*i), canvasHeight*7/16 + ((i%2==0) ? 0 : -canvasWidth/14), canvasWidth/15, canvasWidth/15);
    }
    image(xImg, (canvasWidth/12 + canvasWidth/6*4), canvasHeight*7/16 - canvasWidth/28, canvasWidth/6, canvasWidth/6);
    */
    image(ingredientsImg[playersIngredients[choosenPizza][0]], canvasWidth/6, canvasHeight/3-canvasWidth/10, canvasWidth/3, canvasWidth/3);
    image(okImg, canvasWidth/6+canvasWidth/3-canvasWidth/10, canvasHeight/3-canvasWidth/10, canvasWidth/10, canvasWidth/10);

    image(ingredientsImg[playersIngredients[choosenPizza][1]], canvasWidth/6+canvasWidth/3, canvasHeight/3-canvasWidth/10, canvasWidth/3, canvasWidth/3);
    image(okImg, canvasWidth/6+canvasWidth*2/3-canvasWidth/10, canvasHeight/3-canvasWidth/10, canvasWidth/10, canvasWidth/10);


    image(ingredientsImg[playersIngredients[choosenPizza][2]], 0, canvasHeight/2, canvasWidth/3, canvasWidth/3);
    image(okImg, canvasWidth/3-canvasWidth/10, canvasHeight/2, canvasWidth/10, canvasWidth/10);

    image(ingredientsImg[playersIngredients[choosenPizza][3]], canvasWidth/3, canvasHeight/2, canvasWidth/3, canvasWidth/3);
    image(okImg, canvasWidth*2/3-canvasWidth/10, canvasHeight/2, canvasWidth/10, canvasWidth/10);

    image(ingredientsImg[playersIngredients[choosenPizza][4]], canvasWidth*2/3, canvasHeight/2, canvasWidth/3, canvasWidth/3);
    image(xImg, canvasWidth*2/3, canvasHeight/2, canvasWidth/3, canvasWidth/3);

    playGIF.display(canvasWidth/3, canvasHeight-canvasWidth/3, canvasWidth/3, canvasWidth/3);
  }

  cursor(CROSS);
}

function endView(){
  if(!isVertical){
    image(floorImg, 0, canvasHeight-canvasWidth/9, canvasWidth, canvasWidth/9);

    image(endImg, canvasWidth/2 - canvasHeight*1.6/2,0, canvasHeight*1.6, canvasHeight);
    textAlign(CENTER, CENTER);
    fill(167, 24, 20);
    textSize(canvasWidth/22);
    textFont(fontBold);
    text("Game Over", canvasWidth/2, canvasHeight*5/24);
    textSize(canvasWidth/36);
    textFont(font);
    text("Udało ci się zebrać " + points.toString() + (points==1?" składnik" : ((points%10>=2 && points%10<=4) ? " składniki" : " składników")) + " możesz zrobić", canvasWidth/4, canvasHeight*8/25, canvasWidth/2);
    textSize(canvasWidth/21);
    textFont(fontBold);
    var pizzaCount = Math.floor(points/3)
    text(pizzaCount + " Pizz" + (((pizzaCount%10>=2 && pizzaCount%10<=4) || pizzaCount==1) ? "e" : "") + "!!!", canvasWidth/2, canvasHeight/2);

    playAgainGIF.display(canvasWidth/2-canvasWidth/14, canvasHeight/2+canvasHeight/25, canvasWidth/7, canvasWidth/7);
  }
  cursor(CROSS);
}

function mouseClicked() {
  if(gameStatus == 2) return;
  if(playGIF.over() && (gameStatus == 0 || gameStatus == 1))
    play();
  if(arrowLeft.over() && gameStatus == 0)
    choosenPizza = getNextPizzaImgIndex(false);
  if(arrowRight.over() && gameStatus == 0)
    choosenPizza = getNextPizzaImgIndex(true);
  if(playAgainGIF.over() && gameStatus == 3)
    gameStatus = 0;
}

function play(){
  gameStatus = (gameStatus==0) ? 1 : 2;
  if(gameStatus == 1) return;
  player = new Player(choosenPizza, playersIngredients[choosenPizza], 4);
  player.start();

  points = 0;
  time = 0;

  startMaxSpeed = 1;
  startMinSpeed = 1;
  timeDivider = 1;

  timeToNextIngredient = 60;
  timeToNextBadIngredient = 170;
  ingredientsCount = 5;

  if(isVertical){
    timeToNextIngredient = 50;
    timeToNextBadIngredient = 160
  }
}

function getRandomIngredientX(){
  return random(canvasWidth/10, canvasWidth-canvasWidth/7);
}

function getRandomIngredientY(){
  return random(-canvasWidth/3, -canvasWidth/4);
}

function getNextPizzaImgIndex(increment){
  return increment ? ((choosenPizza+1)%(playersTypesCount)) : ((choosenPizza > 0) ? choosenPizza-1 : playersTypesCount-1)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Player {
  constructor(type, ingredientTypes, typesCount){
    this.width = 0;
    this.height = 0;
    this.img = playersImg[type];

    this.ingredientstsTypes = ingredientTypes;
    this.typesCount = typesCount;

    this.ingredients = [];
    this.badIngredient = [];

    this.startPosX = canvasWidth/2 - width/2;
    this.y = 0;

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

  display(w, h){
    this.width = w;
    this.height = h;
    this.y = (isVertical) ? canvasHeight*8/10 : hM*17-wM*3-h/3;
    if(gameStatus == 2){
      this.x = mouseX - w/2;
      image(this.img, this.x, this.y, w, h);

      var val = Math.floor(timeToNextIngredient/Math.sqrt(timeDivider));

      if((time/25)%Math.floor(timeToNextIngredient/Math.sqrt(timeDivider)) == 0) this.fallIngredient();
      if((time/25)%Math.floor(timeToNextBadIngredient/Math.sqrt(timeDivider)) == 0) this.fallBadIngredient();
    }else{
      image(this.img, this.x, this.y, w, h);
    }
  }

  fallIngredient(){
    if(gameStatus != 2) return;
    player.lastFall=getRandomInt(0, player.ingredients.length-1);
    for(var i=player.lastFall; i<player.ingredients.length; i++)
      if(!player.ingredients[i].isFalling){
        player.ingredients[i].fall();
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
        return;
      }
    player.badIngredient.push(new Ingredient(player.ingredientstsTypes[4], true));
  }

  addRandomIngredient(){
    if(gameStatus != 2) return;
    let type = player.ingredientstsTypes[getRandomInt(0, player.typesCount-1)];
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

  display(w){
    this.width = w;
    if(!this.isFalling) return;
    if(!this.isPicked){
      this.standardY += this.speed;
      image(this.img, this.x, this.standardY, w, w);
      if(this.standardY > canvasHeight) {
        this.renew();
      }
      else if(this.standardY > player.y - player.width/4 &&
        this.standardY < player.y + player.width/6 &&
        this.x > mouseX - player.width/2 - w/4 &&
        this.x < mouseX + player.width/2 - w/4 && !this.isPicked){
        if(this.isBad) gameStatus = 3;
        else points++;

        this.isPicked = true;
      }
    }else {
      image(pickUpEffectImg, this.x-w/2, this.standardY+w/8, w*2, w*2);
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
  constructor(img) {
    this.x = 0;
    this.y = 0;
    this.img = img;
    this.width = 0;
    this.height = 0;
  }

  display(x, y, w, h) {
    stroke(0);
    if (this.over()) tint(252, 84, 48);
    else tint(255, 251, 210);
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    image(this.img, x, y, w, h);
  }

  over() {
    return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
  }
}

class GifBtn {
  constructor(path, frames) {
    this.img = [];
    for(var i = 0; i<frames; i++)
      this.img[i] = loadImage(path.toString()+ "/" + (i+1).toString() + ".png");

    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    this.frames = frames;

    this.actualFrame = 0;
    this.isPlaying = false;
    this.time = 0;
    this.isDone = false;
  }

  display(x, y, w, h){
    image(this.img[this.actualFrame], x, y, w, h);
    this.x=x;
    this.y=y;
    this.width = w;
    this.height = h;

    if(this.over() || this.isPlaying) {
      if(!this.isDone)
        this.play();
      this.isDone = true;
    }
    else {
      this.stop();
      this.isDone = false;
    }

    if(!this.isPlaying) return;
    this.time++;

    if(this.time%2!=0) return;

    if(this.actualFrame<this.frames-1)
      this.actualFrame++;
    else {
      this.stop();
    }

  }

  stop(){
    this.actualFrame = 0;
    this.isPlaying = false;
  }

  play(){
    this.isPlaying = true;
  }
  setFrame(frame){
    this.actualFrame = frame;
  }

  over() {
    return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
  }
}
