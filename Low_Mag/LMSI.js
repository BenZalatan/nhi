// Low Magnification Screening / Imaging (LMSI)
// @author Eddie Sohn
// jus219@lehigh.edu

// Libraries:
// pixi: 5.0.3
// pixi-viewport: 3.4.1 (local - modified by Eddie Sohn)

// initialize images need to be used
// mode_change.png made by Cursor Creative from https://www.flaticon.com/
// screenshot.png made by https://www.flaticon.com/authors/freepik
// move.png made made by https://www.flaticon.com/authors/icongeek26
var zoom_background = PIXI.Texture.from('./Images/lowmag_test.jpg');
const cancel_button = PIXI.Sprite.from('./Images/cancel_icon.png');
const mode_button = PIXI.Sprite.from('./Images/mode_change.png');
const screenshot = PIXI.Sprite.from('./Images/screenshot.png');
const move = PIXI.Sprite.from('./Images/move.png');

// call the image and added to Viewport
// create a new new texture from image
var testimg = new PIXI.Sprite(zoom_background);

var LMSIContainer = new PIXI.Container();

var buttonContainer = new PIXI.Container();

var guideTextContainer = new PIXI.Container();

// set buttons requried
// cancel button
cancel_button.width = 50;
cancel_button.height = 50;
cancel_button.x = 10;
cancel_button.y = 10;
cancel_button.alpha = 0.33;
cancel_button.interactive = true;
cancel_button.buttonMode = true;
cancel_button
    .on('pointerdown', cancelDraw)
    .on('pointerup', cancelUp)
    .on('pointerover', cancelUp)
    .on('pointeroutside', cancelUp);

// mode change button
mode_button.width = 50;
mode_button.height = 50;
mode_button.x = cancel_button.x;
mode_button.y = cancel_button.y + cancel_button.height + cancel_button.y;
mode_button.alpha = 1;
mode_button.interactive = true;
mode_button.buttonMode = true;
mode_button
    .on('pointerdown', changeMode)
    .on('pointerup', onButtonUp);

// icons to show current mode - screenshot & move
screenshot.width = 25;
screenshot.height = 25;
screenshot.x = cancel_button.x + cancel_button.width / 4;
screenshot.y = cancel_button.y + cancel_button.height + cancel_button.y + cancel_button.height / 4;
screenshot.alpha = 0;

move.width = 25;
move.height = 25;
move.x = cancel_button.x + cancel_button.width / 4;
move.y = cancel_button.y + cancel_button.height + cancel_button.y + cancel_button.height / 4;
move.alpha = 1;

// variable to determine if user clicked on cancel button
var cancel_draw = false;

// varaible to determine current mode
var dragMode = true;

// variable to determine if user is in the middle of drawing
var drawing = false;

// varible to save points user clicked for rectangle
var points = [0, 0];

//Creates style used by text
const style = new PIXI.TextStyle({
    fontFamily: 'Helvetica',
    fontSize: 25,
    fontWeight: 'bold',
    fill: '#FFFFFF', // gradient
    align: 'center',
    strokeThickness: 5,
    wordWrap: true,
    wordWrapWidth: 500,
});

var Viewport;

/**
 *  LMSI is called to start Low Magnification Screening / Imaging (Zoom & Crop).
 *  it activates gestures, add viewport, buttons, and sprites on LMSIContainer
 */
function LMSI() {
    // calls pixi-viewport
    Viewport = new PIXI.extras.Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 5000,
        worldHeight: 5000,
        interaction: app.renderer.plugins.interaction // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled
    });

    // activate mouse/touch gestures for viewport
    Viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate();
        
    // activate click & cancel
    // left click to draw point
    // right click to cancel
    // Viewport.on('pointerdown', drawPoint);
    
    // pause 'pointerdown' for drag mode
    // Viewport.pausePlugin('pointerdown');

    testimg.width = window.innerWidth;
    testimg.height = window.innerWidth; 

    // add background image to viewport
    Viewport.addChild(testimg);

    // add buttons to buttonContainer, and set interative
    buttonContainer.addChild(cancel_button);
    buttonContainer.addChild(mode_button);
    buttonContainer.addChild(move);
    buttonContainer.addChild(screenshot);
    buttonContainer.interactive = true;

    // text to guide users
    guideText = new PIXI.Text('Drag, wheel and scroll the image to explore.', style);
    guideText.x = window.innerWidth / 2 - 250;
    guideText.y = 50;
    guideTextContainer.addChild(guideText);

    // add the viewport to the container
    LMSIContainer.addChild(Viewport);

    LMSIContainer.addChild(buttonContainer);
    LMSIContainer.addChild(guideTextContainer);

    // Sets the app to be interactable and allows drawPoint function to be called
    // LMSIContainer.interactive = true;

    app.stage.addChild(LMSIContainer);
    app.renderer.render(LMSIContainer);

}

function drawPoint(event) {
    if (!cancel_draw) { //Checks if user clicked on cancel button

        if (!drawing) { //Checks what phase of line create user is in

            //Clears current graphics on screen
            graphics.clear();

            //Constructs starting point
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(event.data.global.x - 5, event.data.global.y - 5, 10, 10);
            graphics.endFill();

            Viewport.addChild(graphics);

            //Changes drawing value 
            drawing = true;

            //Updates starting point
            points = [event.data.global.x, event.data.global.y];

            //Updates text and cancel button
            guideText.text = 'Select the ending point of rectangle. (Touch cancel / right click to stop)';
            
            // alpha of cancle button
            cancel_button.alpha = 1;
        } //end drawing if
        else {
            //Draws end point
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(event.data.global.x - 5, event.data.global.y - 5, 10, 10);
            graphics.endFill()

            //Constructs line from saved starting point to current end point
            graphics.lineStyle(2, 0xFFFFFF).moveTo(points[0], points[1]);

            // draw rectangle from current starting point and endpoint
            // points: starting (x,y) on canvas
            // event.data.global: ending (x,y) on canvas
            // event.data.global - points = width / height of rectangle
            graphics.drawRect(points[0], points[1], event.data.global.x - points[0], event.data.global.y -
                points[1]);

            // test println for printing start(x,y) and end (x,y) of rectangle
            console.log("start: " + points[0] + " " + points[1] + ",\nend: " + event.data.global.x + " " +
                event.data.global.y);

            //Changes draw value and updates other information
            drawing = false;
            
            guideText.text = 'Copy of the selected area is added.';

            // alpha of cancle button
            cancel_button.alpha = 0.33;
        } //end else
    } //end cancel if
} // end draw point

/**
 *  called when cancel_button is fired.
 *  modify alpha value of the image, resets points[], cancel_draw, drawing
 */
function cancelDraw(event) {
    //Resets all line UI components
    graphics.clear();
    points = [0, 0];
    cancel_draw = true;
    drawing = false;
    guideText.text = 'Select two points on a image to crop.';
} // end cancel draw

/**
 *  Resets cancel_draw after canelDraw() is called.
 */
function cancelUp(event) {
    // Resets cancel value
    cancel_draw = false;
} // end cancel up

/**
 *  Change mode between 'drag' and 'screenshot'
 */
function changeMode(event) {

    onButtonDown();

    // test printlm
    console.log("Drag mode: " + dragMode);

    // Resets all line UI components
    graphics.clear();

    // if mode is 'drag', pan & pinch zoom: change to 'screenshot'
    if (dragMode == true) {

        // test println
        console.log("Click-to-crop paused!");

        // change mode icon to 'screenshot'
        move.alpha = 0;
        screenshot.alpha = 1;

        // pause gestures for 'drag'
        Viewport.pausePlugin('drag');
        Viewport.pausePlugin('pinch');
        Viewport.pausePlugin('wheel');
        Viewport.pausePlugin('decelerate');
    
        // resume gestures for click & cancel
        Viewport.on('pointerdown', drawPoint);

        // change guideText to 'screenshot' mode
        dragMode = false;
        guideText.text = 'Select two points on a image to copy.';
    }
    // if mode is 'screenshot', getting part of the image and save it as child image of current image: change to 'drag'
    else {

        //test println
        console.log("Drag-and-zoom stated!");

        // change mode icon to 'screenshot'
        move.alpha = 1;
        screenshot.alpha = 0;

        // pause gestures for click & cancel
        Viewport.off('pointerdown', drawPoint);
        // Viewport.pausePlugin('pointerdown');

        // resume gestures for 'drag'
        Viewport.resumePlugin('drag');
        Viewport.resumePlugin('pinch');
        Viewport.resumePlugin('wheel');
        Viewport.resumePlugin('decelerate');

        // change guideText to 'drag' mode
        dragMode = true;
        guideText.text = 'Drag, wheel and scroll the image to explore.';
    }
} // end changeMode

/**
 * General button gestures including pointerdown, pointerup, pointerover, pointerdownout
 */
function onButtonDown() {
    this.isdown = true;
    // this.texture = textureButtonDown;
    this.alpha = 0.5;
}

function onButtonUp() {
    this.isdown = false;
    this.alpha = 1;
    if (this.isOver) {
        // this.texture = textureButtonOver;
    }
    else {
        // this.texture = textureButton;
    }
}

function onButtonOver() {
    this.isOver = true;
    if (this.isdown) {
        return;
    }
    // this.texture = textureButtonOver;
}

function onButtonOut() {
    this.isOver = false;
    if (this.isdown) {
        return;
    }
    // this.texture = textureButton;
}
