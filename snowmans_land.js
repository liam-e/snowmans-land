let player;
let level;
let start;
let levelNumber = 1;
let numberOfLevels = 7;
let newGameButton, newGameButtonSide, resetButton,
	nextLevelButton, exitToTitleButton;
let titleScreen = true;

let rubik, rubikBold;

let rightSide;

let levels;

let newGameBtnImg, newGameBtnImgHover, exitToTitleBtnImg, exitToTitleBtnImgHover,
	resetBtnImg, resetBtnImgHover, nextLevelBtnImg, nextLevelBtnImgHover;

let playerSprite;
let iceSprite;
let flagSprite;
let waterSprite;
let snowflakeSprite;
let oneStar;
let twoStars;
let threeStars;
let snowmanHighRes;

let wallSprites = {};

function preload() {
	// JSON
	levels = Object(loadJSON("res/json/levels.json")); // JSONObject

	// fonts
	rubik = loadFont("res/fonts/rubik.ttf");
	rubikBold = loadFont("res/fonts/rubik-bold.ttf");

	// sprites
	newGameBtnImg = loadImage("res/sprites/new-game.png");
	newGameBtnImgHover = loadImage("res/sprites/new-game-hover.png");
	exitToTitleBtnImg = loadImage("res/sprites/exit-to-title.png");
	exitToTitleBtnImgHover = loadImage("res/sprites/exit-to-title-hover.png");
	resetBtnImg = loadImage("res/sprites/reset.png");
	resetBtnImgHover = loadImage("res/sprites/reset-hover.png");
	nextLevelBtnImg = loadImage("res/sprites/next-level.png");
	nextLevelBtnImgHover = loadImage("res/sprites/next-level-hover.png");

	playerSprite = loadImage("res/sprites/player.png");

	iceSprite = loadImage("res/sprites/ice.png");
	flagSprite = loadImage("res/sprites/flag.png");
	waterSprite = loadImage("res/sprites/water.png");
	snowflakeSprite = loadImage("res/sprites/snowflake.png");
	oneStar = loadImage("res/sprites/1-star.png");
	twoStars = loadImage("res/sprites/2-stars.png");
	threeStars = loadImage("res/sprites/3-stars.png");
	snowmanHighRes = loadImage("res/sprites/player-high-res.png");

	wallSprites["E"] = loadImage("res/sprites/walls/E.jpg");
	wallSprites["N"] = loadImage("res/sprites/walls/N.jpg");
	wallSprites["N-E"] = loadImage("res/sprites/walls/N-E.jpg");
	wallSprites["N-S"] = loadImage("res/sprites/walls/N-S.jpg");
	wallSprites["N-S-E"] = loadImage("res/sprites/walls/N-S-E.jpg");
	wallSprites["N-S-W"] = loadImage("res/sprites/walls/N-S-W.jpg");
	wallSprites["N-S-W-E"] = loadImage("res/sprites/walls/N-S-W-E.jpg");
	wallSprites["N-W"] = loadImage("res/sprites/walls/N-W.jpg");
	wallSprites["N-W-E"] = loadImage("res/sprites/walls/N-W-E.jpg");
	wallSprites["S"] = loadImage("res/sprites/walls/S.jpg");
	wallSprites["S-E"] = loadImage("res/sprites/walls/S-E.jpg");
	wallSprites["single"] = loadImage("res/sprites/walls/single.jpg");
	wallSprites["W"] = loadImage("res/sprites/walls/W.jpg");
	wallSprites["W-E"] = loadImage("res/sprites/walls/W-E.jpg");
	wallSprites["S-W-E"] = loadImage("res/sprites/walls/S-W-E.jpg");
	wallSprites["S-W"] = loadImage("res/sprites/walls/S-W.jpg");
	wallSprites["E-edge"] = loadImage("res/sprites/walls/E-edge.jpg");
	wallSprites["N-edge"] = loadImage("res/sprites/walls/N-edge.jpg");
	wallSprites["S-edge"] = loadImage("res/sprites/walls/S-edge.jpg");
	wallSprites["W-edge"] = loadImage("res/sprites/walls/W-edge.jpg");
	wallSprites["N-E-edge"] = loadImage("res/sprites/walls/N-E-edge.jpg");
	wallSprites["N-W-edge"] = loadImage("res/sprites/walls/N-W-edge.jpg");
	wallSprites["S-E-edge"] = loadImage("res/sprites/walls/S-E-edge.jpg");
	wallSprites["S-W-edge"] = loadImage("res/sprites/walls/S-W-edge.jpg");
}


function setup() {
	createCanvas(1200, 800);
	fill(0);


	textFont(rubik);

	textSize(28);

	textAlign(CENTER);
	noStroke();
	loadLevel(0, null);
}


function draw() {
	background(230, 233, 235);
	if (titleScreen) {
		drawTitleScreen();
	} else {
		level.drawLevel();
		resetButton.drawButton();
		exitToTitleButton.drawButton();

		// Slid into water
		if (level.grid[player.y][player.x] == 2) {
			loadLevel(level.numberOfResets + 1, level.snowflakes);
		}

		// if level's still going, draw and move the player
		if (!level.levelEnd) {
			player.drawPlayer();
			player.move();
		}
	}
}


function loadLevel(numberOfResets, snowflakes) { // int numberOfResets, ArrayList<PVector> snowflakes

	let json_level = levels[str(levelNumber)];  // JSONObject

	let grid = json_level["grid"]; // JSONArray json_grid
	let path = json_level["path"]; // JSONArray json_path

	// let path = new Array(json_path.size());

	// for (let i = 0; i < path.length; i++) {
	// 	path[i] = json_path.getString(i);
	// }
	// let grid = new Array(json_grid.size()); // int[][]

	// for (let row = 0; row < grid.length; row++) {
	// 	grid[row] = json_grid.getJSONArray(row).getIntArray();
	// }

	start = json_level["start"];
	let pathLength = json_level["path-length"]; // int

	level = new Level(grid, 1, path, pathLength, numberOfResets, snowflakes);
	player = new Player(start[0], start[1]);

	rightSide = int(level.gridLeft + level.gridWidth) + 40;

	if (snowflakes == null) {
		level.generateSnowflakes();
	} else {
		level.snowflakes = snowflakes;
	}
	level.totalSnowflakes = level.snowflakes.length;

	// buttons
	newGameButton = new Button("New game", (width - 214) / 2, (height - 63) / 2 + 110, 214, 63, newGameBtnImg, newGameBtnImgHover);
	exitToTitleButton = new Button("Exit to title", rightSide, height / 2 + 105, 230, 63, exitToTitleBtnImg, exitToTitleBtnImgHover);
	resetButton = new Button("Reset", rightSide, height / 2 + 25, 154, 63, resetBtnImg, resetBtnImgHover);
	nextLevelButton = new Button("Next level", (width - 216) / 2, (height - 63) / 2 + 110, 216, 63, nextLevelBtnImg, nextLevelBtnImgHover);


	console.log("loadLevel done.");
}

// Display the title screen and animated background
function drawTitleScreen(){
	level.drawTitleBackground();
	fill(255);
	stroke(100);
	strokeWeight(3);
	rect((width-720)/2, (height-540)/2, 720, 540);
	noStroke();
	fill(0);
	textFont(rubikBold);
	textSize(72);
	text("Snowman's Land", width/2, 230);
	image(snowmanHighRes, width/2-350, height/2+40);
	textFont(rubik);
	textSize(18);
	text("Slide towards the flag, and try to collect all the snowflakes along the way!\nYou must be stopped at the flag to finish the level.\nUse the arrow keys to slide. Press R to reset.", width/2, height/2-40);
	textSize(28);
	newGameButton.drawButton();
  }

  function mouseReleased(){
	// New game button hit
	if (titleScreen){
	  if(newGameButton.mouseIsOver()){
		titleScreen = false;
	  }
	}
	// Reset button hit
	if (!level.levelEnd && !titleScreen && resetButton.mouseIsOver() && player.numberOfMoves != 0){
	  loadLevel(level.numberOfResets+1, level.snowflakes);
	}
	
	// New game button hit on the side of the screen
	if (!level.levelEnd && !titleScreen && exitToTitleButton.mouseIsOver()){
	  levelNumber = 1;
	  loadLevel(0, null);
	  titleScreen = true;
	}
	
	// Next level button hit
	if (level.levelEnd && nextLevelButton.mouseIsOver()){
	  if (levelNumber <= numberOfLevels){
		loadLevel(0, null);
	  } else {
		levelNumber = 1;
		loadLevel(0, null);
	  }
	}
  }
  
  function keyPressed(){
	// Make the R key reset the level
	if (!level.levelEnd && !titleScreen && (key == 'r' || key == 'R')){
	  loadLevel(level.numberOfResets+1, level.snowflakes);
	}
	
	// Make the eneter go to the first/next level
	if (keyCode == ENTER){
	  if (titleScreen){
		titleScreen = false;
	  } else {
		if (level.levelEnd){
		  if (levelNumber <= numberOfLevels){
			loadLevel(0, null);
		  } else {
			levelNumber = 1;
			loadLevel(0, null);
		  }
		}
	  }
	}
  }