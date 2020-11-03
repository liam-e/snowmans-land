class Level {
  int[][] grid;
  int difficulty, pathLength, numberOfResets, totalSnowflakes;
  float gridHeight;
  float gridWidth;
  float tileSize;
  float gridTop;
  float gridLeft;
  String[] path;
  ArrayList<PVector> snowflakes;
  ArrayList<Integer> snowflakesCollected;
  int numberOfSnowflakesCollected;
  boolean levelEnd;
  float score;
  int stars;
  float titleBackgroundOffset;
  int[][] titleBackground;

  HashMap<String, PImage> wallSprites = new HashMap<String, PImage>();

  PImage iceSprite, flagSprite, waterSprite, snowflakeSprite, resetButton, resetHover, oneStar, twoStars, threeStars, snowmanHighRes;

  Level(int[][] grid, int difficulty, String[] path, int pathLength, int numberOfResets, ArrayList<PVector> snowflakes) {
    this.grid = grid;
    this.difficulty = difficulty;
    this.path = path;
    this.pathLength = pathLength;
    if (snowflakes == null){
      this.snowflakes = new ArrayList<PVector>();
    } else {
      this.snowflakes = snowflakes;
    }
    this.snowflakesCollected = new ArrayList<Integer>();
    this.numberOfSnowflakesCollected = 0;
    this.totalSnowflakes = 0;
    this.numberOfResets = numberOfResets;
    this.levelEnd = false;
    this.titleBackgroundOffset = 0;
    
    tileSize = 64;

    gridHeight = tileSize*grid.length;
    gridWidth = tileSize*grid[0].length;

    gridTop = (height - gridHeight)/2;
    gridLeft = (width - gridWidth)/2;
    
    // load sprites
    iceSprite = loadImage("../res/sprites/ice.png");
    flagSprite = loadImage("../res/sprites/flag.png");
    waterSprite = loadImage("../res/sprites/water.png");
    snowflakeSprite = loadImage("../res/sprites/snowflake.png");
    resetButton = loadImage("../res/sprites/reset.png");
    resetHover = loadImage("../res/sprites/reset-hover.png");
    oneStar = loadImage("../res/sprites/1-star.png");
    twoStars = loadImage("../res/sprites/2-stars.png");
    threeStars = loadImage("../res/sprites/3-stars.png");
    snowmanHighRes = loadImage("../res/sprites/player-high-res.png");
    
    // load wall sprites
    wallSprites.put("E", loadImage("../res/sprites/walls/E.jpg"));
    wallSprites.put("N", loadImage("../res/sprites/walls/N.jpg"));
    wallSprites.put("N-E", loadImage("../res/sprites/walls/N-E.jpg"));
    wallSprites.put("N-S", loadImage("../res/sprites/walls/N-S.jpg"));
    wallSprites.put("N-S-E", loadImage("../res/sprites/walls/N-S-E.jpg"));
    wallSprites.put("N-S-W", loadImage("../res/sprites/walls/N-S-W.jpg"));
    wallSprites.put("N-S-W-E", loadImage("../res/sprites/walls/N-S-W-E.jpg"));
    wallSprites.put("N-W", loadImage("../res/sprites/walls/N-W.jpg"));
    wallSprites.put("N-W-E", loadImage("../res/sprites/walls/N-W-E.jpg"));
    wallSprites.put("S", loadImage("../res/sprites/walls/S.jpg"));
    wallSprites.put("S-E", loadImage("../res/sprites/walls/S-E.jpg"));
    wallSprites.put("single", loadImage("../res/sprites/walls/single.jpg"));
    wallSprites.put("W", loadImage("../res/sprites/walls/W.jpg"));
    wallSprites.put("W-E", loadImage("../res/sprites/walls/W-E.jpg"));
    wallSprites.put("S-W-E", loadImage("../res/sprites/walls/S-W-E.jpg"));
    wallSprites.put("S-W", loadImage("../res/sprites/walls/S-W.jpg"));
    
    wallSprites.put("E-edge", loadImage("../res/sprites/walls/E-edge.jpg"));
    wallSprites.put("N-edge", loadImage("../res/sprites/walls/N-edge.jpg"));
    wallSprites.put("S-edge", loadImage("../res/sprites/walls/S-edge.jpg"));
    wallSprites.put("W-edge", loadImage("../res/sprites/walls/W-edge.jpg"));
    wallSprites.put("N-E-edge", loadImage("../res/sprites/walls/N-E-edge.jpg"));
    wallSprites.put("N-W-edge", loadImage("../res/sprites/walls/N-W-edge.jpg"));
    wallSprites.put("S-E-edge", loadImage("../res/sprites/walls/S-E-edge.jpg"));
    wallSprites.put("S-W-edge", loadImage("../res/sprites/walls/S-W-edge.jpg"));
  }

  void drawLevel() {
    for (int row = -1; row <= grid.length; row++) {
      for (int col = -1; col <= grid[0].length; col++) {
        PVector tilePos = new PVector(this.gridLeft+col*this.tileSize, this.gridTop+row*this.tileSize);
        if (row == -1) { // north edge
          if (col == -1) { // NW 
            image(wallSprites.get("N-W-edge"), tilePos.x, tilePos.y);
          } else if (col == grid[0].length) { // NE
            image(wallSprites.get("N-E-edge"), tilePos.x, tilePos.y);
          } else {
            image(wallSprites.get("N-edge"), tilePos.x, tilePos.y);
          }
        } else if (row == grid.length) { // south edge
          if (col == -1) { // SW 
            image(wallSprites.get("S-W-edge"), tilePos.x, tilePos.y);
          } else if (col == grid[0].length) { // SE
            image(wallSprites.get("S-E-edge"), tilePos.x, tilePos.y);
          } else {
            image(wallSprites.get("S-edge"), tilePos.x, tilePos.y);
          }
        } else if (col == -1) { // west edge
          image(wallSprites.get("W-edge"), tilePos.x, tilePos.y);
        } else if (col == grid[0].length) { // east edge
          image(wallSprites.get("E-edge"), tilePos.x, tilePos.y);
        } else {
          switch (grid[row][col]) {
          case 0: // Tile is ice
            image(this.iceSprite, tilePos.x, tilePos.y);
            break;
          case 1: // Tile is a wall
            boolean n = false;
            boolean s = false;
            boolean w = false;
            boolean e = false;
            
            if (row > 0) {
              if (grid[row-1][col] == 1) {
                n = true;
              }
            }
            
            if (row < grid.length-1) {
              if (grid[row+1][col] == 1) {
                s = true;
              }
            }
            
            if (col > 0) {
              if (grid[row][col-1] == 1) {
                w = true;
              }
            }
            
            if (col < grid[0].length-1) {
              if (grid[row][col+1] == 1) {
                e = true;
              }
            }
            // Determine which sprite to use based on the tiles around it
            PImage toUse = wallSprites.get("single");
            if (n && s && w && e) { 
              toUse = wallSprites.get("N-S-W-E");
            };
            if (n && s && w && !e) { 
              toUse = wallSprites.get("N-S-W");
            };
            if (n && s && !w && e) { 
              toUse = wallSprites.get("N-S-E");
            };
            if (n && s && !w && !e) { 
              toUse = wallSprites.get("N-S");
            };
            if (n && !s && w && e) { 
              toUse = wallSprites.get("N-W-E");
            };
            if (n && !s && w && !e) { 
              toUse = wallSprites.get("N-W");
            };
            if (n && !s && !w && e) { 
              toUse = wallSprites.get("N-E");
            };
            if (n && !s && !w && !e) { 
              toUse = wallSprites.get("N");
            };
            if (!n && s && w && e) { 
              toUse = wallSprites.get("S-W-E");
            };
            if (!n && s && w && !e) { 
              toUse = wallSprites.get("S-W");
            };
            if (!n && s && !w && e) { 
              toUse = wallSprites.get("S-E");
            };
            if (!n && s && !w && !e) { 
              toUse = wallSprites.get("S");
            };
            if (!n && !s && w && e) { 
              toUse = wallSprites.get("W-E");
            };
            if (!n && !s && w && !e) { 
              toUse = wallSprites.get("W");
            };
            if (!n && !s && !w && e) { 
              toUse = wallSprites.get("E");
            };
            if (!n && !s && !w && !e) { 
              toUse = wallSprites.get("single");
            };
            image(toUse, tilePos.x, tilePos.y);
            break;
          case 2:
            image(waterSprite, tilePos.x, tilePos.y);
            break;
          case 3:
            image(this.iceSprite, tilePos.x, tilePos.y);
            image(this.flagSprite, tilePos.x, tilePos.y);
          }
        }
      }
    }
    drawSnowflakes();
    displayUI();
    if (levelEnd){
      player.drawPlayer();
      levelEndPopup();
    }
  }
  
  void generateSnowflakes(){
    // Create a player that will traverse the level, placing snowflakes
    Player placer = new Player(start.getInt(0), start.getInt(1));
    placer.x = (int) placer.endPos(path[0]).x;
    placer.y = (int) placer.endPos(path[0]).y;
    int x2, y2;
    float snowflakeChance = 0.1;
    for (int i = 1; i < path.length; i++){
      switch (path[i]){
        case "N":
          y2 = (int) placer.endPos(path[i]).y;
          for (int y = placer.y; y >= y2; y--){
            if (grid[y][placer.x] == 0 && random(1) < snowflakeChance){ snowflakes.add(new PVector(placer.x, y)); }
          }
          placer.y = y2;
          break;
        case "S":
          y2 = (int) placer.endPos(path[i]).y;
          for (int y = placer.y; y <= y2; y++){
            if (grid[y][placer.x] == 0 && random(1) < snowflakeChance){ snowflakes.add(new PVector(placer.x, y)); }
          }
          placer.y = y2;
          break;
        case "W":
          x2 = (int) placer.endPos(path[i]).x;
          for (int x = placer.x; x >= x2; x--){
            if (grid[placer.y][x] == 0 && random(1) < snowflakeChance){ snowflakes.add(new PVector(x, placer.y)); }
          }
          placer.x = x2;
          break;
        case "E":
          x2 = (int) placer.endPos(path[i]).x;
          for (int x = placer.x; x <= x2; x++){
            if (grid[placer.y][x] == 0 && random(1) < snowflakeChance){ snowflakes.add(new PVector(x, placer.y)); }
          }
          placer.x = x2;
      }
    }
    totalSnowflakes = snowflakes.size();
  }
  
  void drawSnowflakes(){
    ArrayList<PVector> toRemove = new ArrayList<PVector>();
    for (int i = 0; i < snowflakes.size(); i++){
      if (!snowflakesCollected.contains(i)){
        if (player.x == snowflakes.get(i).x && player.y == snowflakes.get(i).y){
          snowflakesCollected.add(i);
          numberOfSnowflakesCollected++;
        } else {
          image(this.snowflakeSprite, this.gridLeft+snowflakes.get(i).x*this.tileSize, this.gridTop+snowflakes.get(i).y*this.tileSize);
        }
      }
    }
    snowflakes.removeAll(toRemove);
  }
  
  // Display the UI on the side of the screen
  void displayUI(){
    textAlign(LEFT);
    textFont(rubikBold);
    textSize(36);
    text("Level "+levelNumber, rightSide, height/2-115);
    textSize(28);
    textFont(rubik);
    text("Snowflakes: "+numberOfSnowflakesCollected+" / "+totalSnowflakes, rightSide, height/2-65);
    text("Moves: "+player.numberOfMoves, rightSide, height/2-35);
    text("Resets: "+numberOfResets, rightSide, height/2-5);
    textAlign(CENTER);
  }
  
  // Display the end-of-level popup box
  void levelEndPopup(){
    score = 0;
    if (totalSnowflakes != 0){
      score += (float) numberOfSnowflakesCollected/totalSnowflakes;
    } else {
      score += 1;
    }
    
    score += ((float) pathLength-((float) player.numberOfMoves-(float) pathLength))/pathLength;
    
    if (numberOfResets < 3){
      score += (3-(float) numberOfResets)/3;
    }
    
    fill(255);
    stroke(100);
    strokeWeight(3);
    rect((width-400)/2, (height-400)/2, 400, 400);
    noStroke();
    fill(0);
    textFont(rubikBold);
    textSize(36);
    text("Level complete!", width/2, height/2-120);
    textSize(28);
    textFont(rubik);
    textSize(28);
    text("Snowflakes: "+numberOfSnowflakesCollected+" / "+totalSnowflakes, width/2, height/2-85);
    text("Moves: "+player.numberOfMoves, width/2, height/2-55);
    text("Resets: "+numberOfResets, width/2, height/2-25);
    
    if (level.score >= 3){
      image(threeStars, width/2-(192/2), height/2-10);
    } else if (level.score > 2 && level.score < 3){
      image(twoStars, width/2-(192/2), height/2-10);
    } else {
      image(oneStar, width/2-(192/2), height/2-10);
    }
    if (levelNumber <= numberOfLevels){
      nextLevelButton.drawButton();
    } else {
      newGameButton.drawButton();
    }
  }
  
  void drawTitleBackground(){
    if (titleBackground == null){
      // create the title background
      titleBackground = new int[int(height/64)+4][int(width/64)+4];
      for (int row = 0; row < titleBackground.length; row++){
        for (int col = 0; col < titleBackground[0].length; col++){
          float rand = random(1);
          if (rand < 0.7){
            titleBackground[row][col] = 0;
          } else if (rand < 0.75){
            titleBackground[row][col] = 4;
          } else if (rand < 0.95){
            titleBackground[row][col] = 1;
          } else if (rand < 0.99){
            titleBackground[row][col] = 2;
          } else {
            titleBackground[row][col] = 3;
          }
        }
      }
    }
    // display
    
    for (int row = 0; row < titleBackground.length; row++) {
      for (int col = 0; col < titleBackground[0].length; col++) {
        PVector tilePos = new PVector((col-2)*64+titleBackgroundOffset, (row-2)*64+titleBackgroundOffset);
        switch (titleBackground[row][col]) {
          case 0:
            image(this.iceSprite, tilePos.x, tilePos.y);
            break;
          case 4:
            image(this.iceSprite, tilePos.x, tilePos.y);
            image(this.snowflakeSprite, tilePos.x, tilePos.y);
            break;
          case 1:
            boolean n = false;
            boolean s = false;
            boolean w = false;
            boolean e = false;
            // N
            if (row > 0) {
              if (titleBackground[row-1][col] == 1) {
                n = true;
              }
            }
            // S
            if (row < titleBackground.length-1) {
              if (titleBackground[row+1][col] == 1) {
                s = true;
              }
            }
            // W
            if (col > 0) {
              if (titleBackground[row][col-1] == 1) {
                w = true;
              }
            }
            // E
            if (col < titleBackground[0].length-1) {
              if (titleBackground[row][col+1] == 1) {
                e = true;
              }
            }
            PImage toUse = wallSprites.get("single");
            if (n && s && w && e) { 
              toUse = wallSprites.get("N-S-W-E");
            };
            if (n && s && w && !e) { 
              toUse = wallSprites.get("N-S-W");
            };
            if (n && s && !w && e) { 
              toUse = wallSprites.get("N-S-E");
            };
            if (n && s && !w && !e) { 
              toUse = wallSprites.get("N-S");
            };
            if (n && !s && w && e) { 
              toUse = wallSprites.get("N-W-E");
            };
            if (n && !s && w && !e) { 
              toUse = wallSprites.get("N-W");
            };
            if (n && !s && !w && e) { 
              toUse = wallSprites.get("N-E");
            };
            if (n && !s && !w && !e) { 
              toUse = wallSprites.get("N");
            };
            if (!n && s && w && e) { 
              toUse = wallSprites.get("S-W-E");
            };
            if (!n && s && w && !e) { 
              toUse = wallSprites.get("S-W");
            };
            if (!n && s && !w && e) { 
              toUse = wallSprites.get("S-E");
            };
            if (!n && s && !w && !e) { 
              toUse = wallSprites.get("S");
            };
            if (!n && !s && w && e) { 
              toUse = wallSprites.get("W-E");
            };
            if (!n && !s && w && !e) { 
              toUse = wallSprites.get("W");
            };
            if (!n && !s && !w && e) { 
              toUse = wallSprites.get("E");
            };
            if (!n && !s && !w && !e) { 
              toUse = wallSprites.get("single");
            };
            image(toUse, tilePos.x, tilePos.y);
            break;
          case 2:
            image(waterSprite, tilePos.x, tilePos.y);
            break;
          case 3:
            image(this.iceSprite, tilePos.x, tilePos.y);
            image(this.flagSprite, tilePos.x, tilePos.y);
        }
      }
    }
    
    // rearrange the title background
    if (titleBackgroundOffset >= 64){
      titleBackgroundOffset = 0;
      for (int row = titleBackground.length-1; row >= 0; row--){
        for (int col = titleBackground[0].length-1; col >= 0; col--){
          if (row == 0 || col == 0){
            float rand = random(1);
            if (rand < 0.7){
              titleBackground[row][col] = 0;
            } else if (rand < 0.75){
              titleBackground[row][col] = 4;
            } else if (rand < 0.95){
              titleBackground[row][col] = 1;
            } else if (rand < 0.99){
              titleBackground[row][col] = 2;
            } else {
              titleBackground[row][col] = 3;
            }
          } else {
            titleBackground[row][col] = titleBackground[row-1][col-1];
          }
        }
      }
    }
    
    titleBackgroundOffset += 0.3;
  }
}
