class Player {
  PImage playerSprite;
  PVector pos;
  float velocity, acceleration;
  int x, y, endX, endY;
  boolean isSliding;
  String slideDirection;
  float f;
  int numberOfMoves;

  Player(int x, int y) {
    this.playerSprite = loadImage("sprites/player.png");
    this.x = x; // integer position
    this.y = y;
    this.velocity = 0.2;
    this.acceleration = 1.1;
    this.pos = new PVector(this.x, this.y); // floating point position
    isSliding = false;
    slideDirection = "";
    this.endX = x;
    this.endY = y;
    numberOfMoves = 0;
  }

  void drawPlayer() {
    image(this.playerSprite, level.gridLeft+this.pos.x*level.tileSize, level.gridTop+this.pos.y*level.tileSize);
  }

  // Move the player
  void move() {

    if (this.isSliding) {
      if (canSlide(this.x, this.y, slideDirection)) {
        this.slide(slideDirection);
      } else {
        isSliding = false;
        f = 0;
        slideDirection = "";
      }
    } else {
      if (won()){
        // If won, increment the level number
        levelNumber++;
        level.levelEnd = true;
      } else {
        if (keyPressed){
          if (keyCode == UP) {
            slideDirection = "N";
          } else if (keyCode == DOWN) {
            slideDirection = "S";
          } else if (keyCode == LEFT) {
            slideDirection = "W";
          } else if (keyCode == RIGHT) {
            slideDirection = "E";
          }
          if (slideDirection != "" && canSlide(this.x, this.y, slideDirection)) {
            endX = (int) endPos(slideDirection).x;
            endY = (int) endPos(slideDirection).y;
            isSliding  = true;
            f = 0;
            numberOfMoves++;
          }
        }
      }
    }
  }
  
  // Slide the player in the given direction for a frame
  void slide(String direction) {
    f += velocity;
    switch(direction) {
    case "N":
      this.pos.y -= velocity;
      if (f > 1) {
        this.y--;
        f = 0;
        this.pos.y = round(this.pos.y);
      }
      break;
    case "S":
      this.pos.y += velocity;
      if (f > 1) {
        this.y++;
        f = 0;
        this.pos.y = round(this.pos.y);
      }
      break;
    case "W":
      this.pos.x -= velocity;
      if (f > 1) {
        this.x--;
        f = 0;
        this.pos.x = round(this.pos.x);
      }
      break;
    case "E":
      this.pos.x += velocity;
      if (f > 1) {
        this.x++;
        f = 0;
        this.pos.x = round(this.pos.x);
      }
    }
  }
  
  // return if the player can move in a give direction
  boolean canSlide(int x2, int y2, String direction) {
    if (x2 < 0 || x2 >= level.grid[0].length || y2 < 0 || y2 >= level.grid.length) { 
      return false;
    } // something's wrong
    switch (direction) {
    case "N":
      if (y2 > 0) {
        return level.grid[y2 - 1][x2] != 1;
      } else {
        return false;
      }
    case "S":
      if (y2 < level.grid.length-1) {
        return level.grid[y2 + 1][x2] != 1;
      } else {
        return false;
      }
    case "W":
      if (x2 > 0) {
        return level.grid[y2][x2 - 1] != 1;
      } else {
        return false;
      }
    case "E":
      if (x2 < level.grid[0].length-1) {
        return level.grid[y2][x2 + 1] != 1;
      } else {
        return false;
      }
    }
    return true;
  }
  
  // Calculate where the player will end up, given a direction
  PVector endPos(String direction) {
    PVector endPos = new PVector(this.x, this.y);
    while (this.canSlide((int) endPos.x, (int) endPos.y, direction)) {
      switch(direction) {
      case "N":
        endPos.y -= 1;
        break;
      case "S":
        endPos.y += 1;
        break;
      case "W":
        endPos.x -= 1;
        break;
      case "E":
        endPos.x += 1;
      }
    }
    return endPos;
  }
  
  boolean won(){
    return level.grid[this.y][this.x] == 3;
  }
}
