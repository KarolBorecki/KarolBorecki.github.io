let cnvs;

let canvasWidth;
let canvasHeight;

var isPlaying = false;
var points = 0;

let playBtn;
let playBtnImg;

let player;
let playerImg;

let ingredientImg;
var ingredients = [];
var ingredientCount = 0;
var maxIngredientCount = 5;

var ingredientsImg = [];
var temp;
let ingredientsTypesCount = 5;

function preload() {
  playBtnImg = loadImage("img/Play.png");
  playerImg = loadImage("img/pizza.png");
  for(var i = 0; i<ingredientsTypesCount; i++)
    ingredientsImg.push(loadImage("img/ingredients/ingredient" + i.toString() + ".png"));


  canvasWidth = windowWidth*0.7;
  canvasHeight = windowHeight*0.8;
}

function setup() {
  cnvs = createCanvas(canvasWidth, canvasHeight);
  cnvs.touchStarted(click);

  playBtn = new Button(canvasWidth/2 - canvasWidth/20, canvasHeight/2  - canvasWidth/20, playBtnImg, canvasWidth/10, canvasWidth/10);
  player = new Player(canvasWidth/4, canvasWidth/8, playerImg, [0,1,2]);

  setInterval(spawnIngredient, 3000);
}

function draw() {
  background(255, 252, 212);
  if(!isPlaying){
    playBtn.display();
    image(ingredientsImg[0], 100, 100, 100, 100);
    image(ingredientsImg[1], 200, 100, 100, 100);
    image(ingredientsImg[2], 300, 100, 100, 100);
    image(ingredientsImg[3], 400, 100, 100, 100);
    image(ingredientsImg[4], 500, 100, 100, 100);
    return;
  }
  mouseY = 0;
  noCursor();
  player.display();
  textSize(canvasWidth/20);
  text(points, canvasWidth - canvasWidth/10, 0, canvasWidth/10, canvasWidth/10);
  for(var i = 0; i<ingredientCount; i++){
    ingredients[i].display();
    if(ingredients[i].standardY > canvasHeight + 200)
      missed(i);
    else if(ingredients[i].standardY > player.startPosY - player.width/4 && ingredients[i].x > mouseX - player.width/2 && ingredients[i].x < mouseX + player.width/2)
      picked(i);
  }
}

function spawnIngredient(){
  if(!isPlaying || ingredientCount >= maxIngredientCount) return;
  var type = getRandomInt(0, maxIngredientCount);
  ingredients.push(new Ingredient(getRandomIngredientX(), ingredientsImg[type], canvasWidth/10, random(1, 4), type));
  ingredientCount++;
  console.log("Spawned");
}

function getRandomIngredientX(){
  return random(canvasWidth/10, canvasWidth-canvasWidth/10);
}

function getRandomIngredientY(){
  return random(-canvasWidth/8, -canvasWidth/9);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function deleteIngredient(index){
  ingredients.splice(index, 1);
  ingredientCount--;
}

function missed(index){
  ingredients[index].standardY = getRandomIngredientY();
  ingredients[index].x = getRandomIngredientX();
}

function picked(index){
  points++;
  missed(index);
  console.log("Picked!");
}

function play(){
  isPlaying =  true;
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
  constructor(width, height, img, ingrediens){
    this.width = width;
    this.height = height;
    this.img = img;
    this.ingredients = ingredients;

    this.startPosX = canvasWidth/2 - width/2;
    this.startPosY = canvasHeight - this.height;
  }

  display(){
    image(this.img, mouseX - this.width/2, this.startPosY, this.width, this.height);
    noTint();
  }
}

class Ingredient {
  constructor(posX, img, width, speed, type){
    this.x = posX;
    this.img = img;
    this.width = width;
    this.speed = speed;
    this.type = type;

    this.standardY = getRandomIngredientY();
  }

  display(){
    this.standardY += this.speed;
    image(this.img, this.x, this.standardY, this.width, this.width);
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
