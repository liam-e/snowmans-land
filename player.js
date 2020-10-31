class Player {

    // PImage playerSprite;
    // PVector pos;
    // float velocity, acceleration;
    // int x, y, endX, endY;
    // boolean isSliding;
    // String slideDirection;
    // float f;
    // int numberOfMoves;
  
    constructor(x, y) {
      this.playerSprite = loadImage("res/sprites/player.png");
      this.x = x; // integer position
      this.y = y;
      this.velocity = 0.2;
      this.acceleration = 1.1;
      this.pos = createVector(this.x, this.y); // floating point position
      this.isSliding = false;
      this.slideDirection = "";
      this.endX = x;
      this.endY = y;
      this.numberOfMoves = 0;
      this.f = 0;
    }

    changeLevel(level){
      this.level = level;
    }
  
    drawPlayer() {
      image(this.playerSprite, level.gridLeft+this.pos.x*level.tileSize, level.gridTop+this.pos.y*level.tileSize);
    }
  
    // Move the player
    move() {
  
      if (this.isSliding) {
        if (this.canSlide(this.x, this.y, this.slideDirection)) {
          this.slide(this.slideDirection);
        } else {
          this.isSliding = false;
          this.f = 0;
          this.slideDirection = "";
        }
      } else {
        if (this.won()){
          // If won, increment the level number
          levelNumber++;
          level.levelEnd = true;
        } else {
          if (keyPressed){
            if (keyCode == 38) {
              this.slideDirection = "N";
            } else if (keyCode == 40) {
              this.slideDirection = "S";
            } else if (keyCode == 37) {
              this.slideDirection = "W";
            } else if (keyCode == 39) {
              this.slideDirection = "E";
            }
            if (this.slideDirection != "" && this.canSlide(this.x, this.y, this.slideDirection)) {
              this.endX = int(this.endPos(this.slideDirection).x);
              this.endY = int(this.endPos(this.slideDirection).y);
              this.isSliding  = true;
              this.f = 0;
              this.numberOfMoves++;
            }
          }
        }
      }
    }
    
    // Slide the player in the given direction for a frame
    slide(direction) {
      this.f += this.velocity;
      switch(direction) {
      case "N":
        this.pos.y -= this.velocity;
        if (this.f > 1) {
          this.y--;
          this.f = 0;
          this.pos.y = round(this.pos.y);
        }
        break;
      case "S":
        this.pos.y += this.velocity;
        if (this.f > 1) {
          this.y++;
          this.f = 0;
          this.pos.y = round(this.pos.y);
        }
        break;
      case "W":
        this.pos.x -= this.velocity;
        if (this.f > 1) {
          this.x--;
          this.f = 0;
          this.pos.x = round(this.pos.x);
        }
        break;
      case "E":
        this.pos.x += this.velocity;
        if (this.f > 1) {
          this.x++;
          this.f = 0;
          this.pos.x = round(this.pos.x);
        }
      }
    }
    
    // return if the player can move in a give direction
    canSlide(x2, y2, direction) {
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
    endPos(direction) {
      let endPos = createVector(this.x, this.y);
      while (this.canSlide(int(endPos.x), int(endPos.y), direction)) {
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
    
    won(){
      return level.grid[this.y][this.x] == 3;
    }
}