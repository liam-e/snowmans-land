let player; // Player
let level; // Level
let start; // JSONArray
let levelNumber = 1;
let numberOfLevels = 7;
let newGameButton, newGameButtonSide, resetButton,
	nextLevelButton, exitToTitleButton; // Button
let titleScreen = true;

let rubik, rubikBold; // PFont

let rightSide; // int

let levels;


function preload() {
	levels = Object(loadJSON("res/json/levels.json")); // JSONObject
}


function setup() {
	createCanvas(1200, 800);
	fill(0);

	rubik = loadFont("res/fonts/rubik.ttf");
	rubikBold = loadFont("res/fonts/rubik-bold.ttf");
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

	// Create the buttons
	newGameButton = new Button("New game", (width - 214) / 2, (height - 63) / 2 + 110, 214, 63, loadImage("res/sprites/new-game.png"), loadImage("res/sprites/new-game-hover.png"));
	exitToTitleButton = new Button("Exit to title", rightSide, height / 2 + 105, 230, 63, loadImage("res/sprites/exit-to-title.png"), loadImage("res/sprites/exit-to-title-hover.png"));
	resetButton = new Button("Reset", rightSide, height / 2 + 25, 154, 63, loadImage("res/sprites/reset.png"), loadImage("res/sprites/reset-hover.png"));
	nextLevelButton = new Button("Next level", (width - 216) / 2, (height - 63) / 2 + 110, 216, 63, loadImage("res/sprites/next-level.png"), loadImage("res/sprites/next-level-hover.png"));

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
	image(level.snowmanHighRes, width/2-350, height/2+40);
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