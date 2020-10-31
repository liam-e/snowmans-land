class Button {

//     String text;
//     int x;
//     int y;
//     int buttonHeight;
//     int buttonWidth;
//     PImage sprite, hoverSprite;
  
    constructor(text, x, y, buttonWidth, buttonHeight, sprite, hoverSprite){
      this.text = text;
      this.x = x;
      this.y = y;
      this.buttonHeight = buttonHeight;
      this.buttonWidth = buttonWidth;
      this.sprite = sprite;
      this.hoverSprite = hoverSprite;
    }
    
    // Return true if the mouse is over the button
    mouseIsOver() {
      return (mouseX >= this.x && mouseX <= this.x+this.buttonWidth && 
              mouseY >= this.y && mouseY <= this.y+this.buttonHeight);
    }
    
    drawButton(){
      if (this.mouseIsOver() && (!level.levelEnd || this.text == "Next level")){
        image(this.hoverSprite, this.x, this.y);
      } else {
        image(this.sprite, this.x, this.y);
      }
    }
  }
  