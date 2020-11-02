class Level {

    constructor(grid, difficulty, path, pathLength, numberOfResets, snowflakes) {
      this.grid = grid;
      this.difficulty = difficulty;
      this.path = path;
      this.pathLength = pathLength;
      if (snowflakes == null){
        this.snowflakes = [];
      } else {
        this.snowflakes = snowflakes;
      }
      this.snowflakesCollected = [];
      this.numberOfSnowflakesCollected = 0;
      this.totalSnowflakes = 0;
      this.numberOfResets = numberOfResets;
      this.levelEnd = false;
      this.titleBackgroundOffset = 0;
      
      this.tileSize = 32;
  
      this.gridHeight = this.tileSize*grid.length;
      this.gridWidth = this.tileSize*grid[0].length;
  
      this.gridTop = (height - this.gridHeight)/2;
      this.gridLeft = (width - this.gridWidth)/2;
    }
  
    drawLevel() {
      for (let row = -1; row <= this.grid.length; row++) {
        for (let col = -1; col <= this.grid[0].length; col++) {
          let tilePos = createVector(this.gridLeft+col*this.tileSize, this.gridTop+row*this.tileSize);
          if (row == -1) { // north edge
            if (col == -1) { // NW 
              image(wallSprites["N-W-edge"], tilePos.x, tilePos.y);
            } else if (col == this.grid[0].length) { // NE
              image(wallSprites["N-E-edge"], tilePos.x, tilePos.y);
            } else {
              image(wallSprites["N-edge"], tilePos.x, tilePos.y);
            }
          } else if (row == this.grid.length) { // south edge
            if (col == -1) { // SW 
              image(wallSprites["S-W-edge"], tilePos.x, tilePos.y);
            } else if (col == this.grid[0].length) { // SE
              image(wallSprites["S-E-edge"], tilePos.x, tilePos.y);
            } else {
              image(wallSprites["S-edge"], tilePos.x, tilePos.y);
            }
          } else if (col == -1) { // west edge
            image(wallSprites["W-edge"], tilePos.x, tilePos.y);
          } else if (col == this.grid[0].length) { // east edge
            image(wallSprites["E-edge"], tilePos.x, tilePos.y);
          } else {
            switch (this.grid[row][col]) {
            case 0: // Tile is ice
              image(iceSprite, tilePos.x, tilePos.y);
              break;
            case 1: // Tile is a wall
              let n = false;
              let s = false;
              let w = false;
              let e = false;
              
              if (row > 0) {
                if (this.grid[row-1][col] == 1) {
                  n = true;
                }
              }
              
              if (row < this.grid.length-1) {
                if (this.grid[row+1][col] == 1) {
                  s = true;
                }
              }
              
              if (col > 0) {
                if (this.grid[row][col-1] == 1) {
                  w = true;
                }
              }
              
              if (col < this.grid[0].length-1) {
                if (this.grid[row][col+1] == 1) {
                  e = true;
                }
              }
              // Determine which sprite to use based on the tiles around it
              let toUse = wallSprites["single"];
              if (n && s && w && e) { 
                toUse = wallSprites["N-S-W-E"];
              };
              if (n && s && w && !e) { 
                toUse = wallSprites["N-S-W"];
              };
              if (n && s && !w && e) { 
                toUse = wallSprites["N-S-E"];
              };
              if (n && s && !w && !e) { 
                toUse = wallSprites["N-S"];
              };
              if (n && !s && w && e) { 
                toUse = wallSprites["N-W-E"];
              };
              if (n && !s && w && !e) { 
                toUse = wallSprites["N-W"];
              };
              if (n && !s && !w && e) { 
                toUse = wallSprites["N-E"];
              };
              if (n && !s && !w && !e) { 
                toUse = wallSprites["N"];
              };
              if (!n && s && w && e) { 
                toUse = wallSprites["S-W-E"];
              };
              if (!n && s && w && !e) { 
                toUse = wallSprites["S-W"];
              };
              if (!n && s && !w && e) { 
                toUse = wallSprites["S-E"];
              };
              if (!n && s && !w && !e) { 
                toUse = wallSprites["S"];
              };
              if (!n && !s && w && e) { 
                toUse = wallSprites["W-E"];
              };
              if (!n && !s && w && !e) { 
                toUse = wallSprites["W"];
              };
              if (!n && !s && !w && e) { 
                toUse = wallSprites["E"];
              };
              if (!n && !s && !w && !e) { 
                toUse = wallSprites["single"];
              };
              image(toUse, tilePos.x, tilePos.y);
              break;
            case 2:
              image(waterSprite, tilePos.x, tilePos.y);
              break;
            case 3:
              image(iceSprite, tilePos.x, tilePos.y);
              image(flagSprite, tilePos.x, tilePos.y);
            }
          }
        }
      }
      this.drawSnowflakes();
      this.displayUI();
      if (this.levelEnd){
        console.log("draw player");
        player.drawPlayer();
        console.log("levelEndPopup");
        this.levelEndPopup();
      }
    }
    
    generateSnowflakes(){
      // Create a player that will traverse the level, placing snowflakes

      let placer = new Player(start[0], start[1]);
      placer.x = placer.endPos(this.path[0]).x;
      placer.y = placer.endPos(this.path[0]).y;
      let x2, y2;
      let snowflakeChance = 0.1;
      for (let i = 1; i < this.path.length; i++){
        switch (this.path[i]){
          case "N":
            y2 = int(placer.endPos(this.path[i]).y);
            for (let y = placer.y; y >= y2; y--){
              if (this.grid[y][placer.x] == 0 && random(1) < snowflakeChance){ this.snowflakes.push(createVector(placer.x, y)); }
            }
            placer.y = y2;
            break;
          case "S":
            y2 = int(placer.endPos(this.path[i]).y);
            for (let y = placer.y; y <= y2; y++){
              if (this.grid[y][placer.x] == 0 && random(1) < snowflakeChance){ this.snowflakes.push(createVector(placer.x, y)); }
            }
            placer.y = y2;
            break;
          case "W":
            x2 = int(placer.endPos(this.path[i]).x);
            for (let x = placer.x; x >= x2; x--){
              if (this.grid[placer.y][x] == 0 && random(1) < snowflakeChance){ this.snowflakes.push(createVector(x, placer.y)); }
            }
            placer.x = x2;
            break;
          case "E":
            x2 = int(placer.endPos(this.path[i]).x);
            for (let x = placer.x; x <= x2; x++){
              if (this.grid[placer.y][x] == 0 && random(1) < snowflakeChance){ this.snowflakes.push(createVector(x, placer.y)); }
            }
            placer.x = x2;
        }
      }
      this.totalSnowflakes = this.snowflakes.length;
    }
    
    drawSnowflakes(){
      let toRemove = [];
      for (let i = 0; i < this.snowflakes.length; i++){
        if (!this.snowflakesCollected.includes(i)){
          if (player.x == this.snowflakes[i].x && player.y == this.snowflakes[i].y){
            this.snowflakesCollected.push(i);
            this.numberOfSnowflakesCollected++;
          } else {
            image(snowflakeSprite, this.gridLeft+this.snowflakes[i].x*this.tileSize, this.gridTop+this.snowflakes[i].y*this.tileSize);
          }
        }
      }
      // this.snowflakes.removeAll(toRemove);
    }
    
    // Display the UI on the side of the screen
    displayUI(){
      textAlign(LEFT);
      textFont(rubikBold);
      textSize(36);
      text("Level "+levelNumber, rightSide, height/2-115);
      textSize(28);
      textFont(rubik);
      text("Snowflakes: "+this.numberOfSnowflakesCollected+" / "+this.totalSnowflakes, rightSide, height/2-65);
      text("Moves: "+player.numberOfMoves, rightSide, height/2-35);
      text("Resets: "+this.numberOfResets, rightSide, height/2-5);
      textAlign(CENTER);
    }
    
    // Display the end-of-level popup box
    levelEndPopup(){
      this.score = 0;
      if (this.totalSnowflakes != 0){
        this.score += float(this.numberOfSnowflakesCollected/this.totalSnowflakes);
      } else {
        this.score += 1;
      }
      
      this.score += float((this.pathLength-(player.numberOfMoves-this.pathLength))/this.pathLength);
      
      if (this.numberOfResets < 3){
        this.score += float((3-this.numberOfResets)/3);
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
      text("Snowflakes: "+this.numberOfSnowflakesCollected+" / "+this.totalSnowflakes, width/2, height/2-85);
      text("Moves: "+player.numberOfMoves, width/2, height/2-55);
      text("Resets: "+this.numberOfResets, width/2, height/2-25);
      
      if (this.score >= 3){
        image(threeStars, width/2-(192/2), height/2-10);
      } else if (this.score > 2 && this.score < 3){
        image(twoStars, width/2-(192/2), height/2-10);
      } else {
        image(oneStar, width/2-(192/2), height/2-10);
      }
      console.log("level_num: " + levelNumber + " num levels" + numberOfLevels);
      if (levelNumber <= numberOfLevels){
        nextLevelButton.drawButton();
      } else {
        newGameButton.drawButton();
      }
    }
    
    drawTitleBackground(){
      if (this.titleBackground == null){
        // create the title background

        let intSize = int(width/this.tileSize)+4;

        console.log(intSize);

        this.titleBackground = new Array(intSize);

        for (let i = 0; i < this.titleBackground.length; i++){
            this.titleBackground[i] = new Array(intSize);
        }

        for (let row = 0; row < this.titleBackground.length; row++){
          for (let col = 0; col < this.titleBackground[0].length; col++){
            let rand = random(1);
            if (rand < 0.7){
                this.titleBackground[row][col] = 0;
            } else if (rand < 0.75){
                this.titleBackground[row][col] = 4;
            } else if (rand < 0.95){
                this.titleBackground[row][col] = 1;
            } else if (rand < 0.99){
                this.titleBackground[row][col] = 2;
            } else {
                this.titleBackground[row][col] = 3;
            }
          }
        }
      }

      // display
      for (let row = 0; row < this.titleBackground.length; row++) {
        for (let col = 0; col < this.titleBackground[0].length; col++) {
          let tilePos = createVector((col-2)*this.tileSize+this.titleBackgroundOffset, (row-2)*this.tileSize+this.titleBackgroundOffset);
          switch (this.titleBackground[row][col]) {
            case 0:
              image(iceSprite, tilePos.x, tilePos.y);
              break;
            case 4:
              image(iceSprite, tilePos.x, tilePos.y);
              image(snowflakeSprite, tilePos.x, tilePos.y);
              break;
            case 1:
              let n = false;
              let s = false;
              let w = false;
              let e = false;
              // N
              if (row > 0) {
                if (this.titleBackground[row-1][col] == 1) {
                  n = true;
                }
              }
              // S
              if (row < this.titleBackground.length-1) {
                if (this.titleBackground[row+1][col] == 1) {
                  s = true;
                }
              }
              // W
              if (col > 0) {
                if (this.titleBackground[row][col-1] == 1) {
                  w = true;
                }
              }
              // E
              if (col < this.titleBackground[0].length-1) {
                if (this.titleBackground[row][col+1] == 1) {
                  e = true;
                }
              }
              let toUse = wallSprites["single"];
              if (n && s && w && e) { 
                toUse = wallSprites["N-S-W-E"];
              };
              if (n && s && w && !e) { 
                toUse = wallSprites["N-S-W"];
              };
              if (n && s && !w && e) { 
                toUse = wallSprites["N-S-E"];
              };
              if (n && s && !w && !e) { 
                toUse = wallSprites["N-S"];
              };
              if (n && !s && w && e) { 
                toUse = wallSprites["N-W-E"];
              };
              if (n && !s && w && !e) { 
                toUse = wallSprites["N-W"];
              };
              if (n && !s && !w && e) { 
                toUse = wallSprites["N-E"];
              };
              if (n && !s && !w && !e) { 
                toUse = wallSprites["N"];
              };
              if (!n && s && w && e) { 
                toUse = wallSprites["S-W-E"];
              };
              if (!n && s && w && !e) { 
                toUse = wallSprites["S-W"];
              };
              if (!n && s && !w && e) { 
                toUse = wallSprites["S-E"];
              };
              if (!n && s && !w && !e) { 
                toUse = wallSprites["S"];
              };
              if (!n && !s && w && e) { 
                toUse = wallSprites["W-E"];
              };
              if (!n && !s && w && !e) { 
                toUse = wallSprites["W"];
              };
              if (!n && !s && !w && e) { 
                toUse = wallSprites["E"];
              };
              if (!n && !s && !w && !e) { 
                toUse = wallSprites["single"];
              };
              image(toUse, tilePos.x, tilePos.y);
              break;
            case 2:
              image(waterSprite, tilePos.x, tilePos.y);
              break;
            case 3:
              image(iceSprite, tilePos.x, tilePos.y);
              image(flagSprite, tilePos.x, tilePos.y);
          }
        }
      }
      
      // rearrange the title background
      if (this.titleBackgroundOffset >= this.tileSize){
        this.titleBackgroundOffset = 0;
        for (let row = this.titleBackground.length-1; row >= 0; row--){
          for (let col = this.titleBackground[0].length-1; col >= 0; col--){
            if (row == 0 || col == 0){
                let rand = random(1);
              if (rand < 0.7){
                this.titleBackground[row][col] = 0;
              } else if (rand < 0.75){
                this.titleBackground[row][col] = 4;
              } else if (rand < 0.95){
                this.titleBackground[row][col] = 1;
              } else if (rand < 0.99){
                this.titleBackground[row][col] = 2;
              } else {
                this.titleBackground[row][col] = 3;
              }
            } else {
              this.titleBackground[row][col] = this.titleBackground[row-1][col-1];
            }
          }
        }
      }
      
      this.titleBackgroundOffset += 0.3;
    }
}