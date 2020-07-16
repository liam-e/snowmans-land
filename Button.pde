class Button {
  String text;
  int x;
  int y;
  int buttonHeight;
  int buttonWidth;
  PImage sprite, hoverSprite;

  Button(String text, int x, int y, int buttonWidth, int buttonHeight, PImage sprite, PImage hoverSprite){
    this.text = text;
    this.x = x;
    this.y = y;
    this.buttonHeight = buttonHeight;
    this.buttonWidth = buttonWidth;
    this.sprite = sprite;
    this.hoverSprite = hoverSprite;
  }
  
  // Return true if the mouse is over the button
  boolean mouseIsOver() {
    if (mouseX >= this.x && mouseX <= this.x+this.buttonWidth && 
        mouseY >= this.y && mouseY <= this.y+this.buttonHeight) {
      return true;
    } else {
      return false;
    }
  }
  
  void drawButton(){
    if (this.mouseIsOver() && (!level.levelEnd || this.text == "Next level")){
      image(hoverSprite, x, y);
    } else {
      image(sprite, x, y);
    }
  }
}
