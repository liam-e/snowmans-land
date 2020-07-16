Player player;
Level level;
JSONArray start;
int levelNumber = 1;
int numberOfLevels = 7;
Button newGameButton, newGameButtonSide, resetButton, nextLevelButton, exitToTitleButton;
boolean titleScreen = true;

PFont rubik;
PFont rubikBold;

int rightSide;

void setup() {
  size(1920, 1080);
  background(230, 233, 235);
  fill(0);
  rubik = createFont("rubik.ttf", 26);
  rubikBold = createFont("rubik-bold.ttf", 26);
  textFont(rubik);
  textSize(28);
  text("word", 12, 60);
  textAlign(CENTER);
  noStroke();
  loadLevel(0, null);
}

void loadLevel(int numberOfResets, ArrayList<PVector> snowflakes){
  // Load the level data from a json file
  JSONObject json = loadJSONObject("levels.json");

  JSONObject json_level = json.getJSONObject(str(levelNumber)); 
  JSONArray json_grid = json_level.getJSONArray("grid");
  JSONArray json_path = json_level.getJSONArray("path");
  String[] path = new String[json_path.size()];
  for (int i = 0; i < path.length; i++){
    path[i] = json_path.getString(i);
  }
  int[][] grid = new int[json_grid.size()][json_grid.getJSONArray(0).size()];
  for (int row = 0; row < grid.length; row++) {
    grid[row] = json_grid.getJSONArray(row).getIntArray();
  }

  start = json_level.getJSONArray("start");
  int pathLength = json_level.getInt("path-length");

  player = new Player(start.getInt(0), start.getInt(1));
  level = new Level(grid, 1, path, pathLength, numberOfResets, snowflakes);
  rightSide = int(level.gridLeft+level.gridWidth)+40;
  
  if (snowflakes == null){
    level.generateSnowflakes(); 
  } else {
    level.snowflakes = snowflakes;
  }
  level.totalSnowflakes = level.snowflakes.size();
  
  // Create the buttons
  newGameButton = new Button("New game", (width-214)/2, (height-63)/2+110, 214, 63, loadImage("sprites/new-game.png"), loadImage("sprites/new-game-hover.png"));
  exitToTitleButton = new Button("Exit to title", rightSide, height/2+105, 230, 63, loadImage("sprites/exit-to-title.png"), loadImage("sprites/exit-to-title-hover.png"));
  resetButton = new Button("Reset", rightSide, height/2+25, 154, 63, loadImage("sprites/reset.png"), loadImage("sprites/reset-hover.png"));
  nextLevelButton = new Button("Next level", (width-216)/2, (height-63)/2+110, 216, 63, loadImage("sprites/next-level.png"), loadImage("sprites/next-level-hover.png"));
}

void printGrid(){
  for (int i = 0; i < level.grid.length; i++){
    for (int j = 0; j < level.grid[0].length; j++){
      print(level.grid[i][j]+" ");
    }
    println(" ");
  }
}

void draw() {
  background(230, 233, 235);
  if (titleScreen){
    drawTitleScreen();
  } else {
    level.drawLevel();
    resetButton.drawButton();
    exitToTitleButton.drawButton();
      
    // Slid into water
    if (level.grid[player.y][player.x] == 2){
      loadLevel(level.numberOfResets+1, level.snowflakes);
    }
    
    // if level's still going, draw and move the player
    if (!level.levelEnd){
      player.drawPlayer();
      player.move();
    }
  }
}

void mouseReleased(){
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

void keyPressed(){
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

// Display the title screen and animated background
void drawTitleScreen(){
  level.drawTitleBackground();
  fill(255);
  stroke(100);
  strokeWeight(3);
  rect((width-720)/2, (height-540)/2, 720, 540);
  noStroke();
  fill(0);
  textFont(rubikBold);
  textSize(72);
  text("Snowman's Land", width/2, 400);
  image(level.snowmanHighRes, width/2-350, height/2+40);
  textFont(rubik);
  textSize(18);
  text("Slide towards the flag, and try to collect all the snowflakes along the way!\nYou must be stopped at the flag to finish the level.\nUse the arrow keys to slide. Press R to reset.", width/2, 475);
  textSize(28);
  newGameButton.drawButton();
}
