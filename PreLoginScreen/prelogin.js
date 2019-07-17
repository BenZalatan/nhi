var login_backgroundImage;

const ui_style = new PIXI.TextStyle({
    fontFamily: 'Tahoma',
    fontSize: 16,
    fill: ['#ffffff'], // gradient
    align: 'center',
    wordWrap: true,
    wordWrapWidth: 500,
    letterSpacing: 1
});

const login_style = new PIXI.TextStyle({
    fontFamily: 'Tahoma',
    fontSize: 30,
    fill: ['#ffffff'], // gradient
    align: 'center',
    wordWrap: true,
    wordWrapWidth: 500,
    letterSpacing: 2
});

var signUp_style = new PIXI.TextStyle({ 
    fontFamily: 'Tahoma',
    fontSize: 18,
    fill: ['#ffffff'], // gradient
    align: 'center',
    wordWrap: true,
    wordWrapWidth: 500,
});

var preLogin_style = new PIXI.TextStyle({ 
    fontFamily: 'Tahoma',
    fontSize: 180,
    fill: ['#ffffff'], // gradient
    align: 'center',
    wordWrap: true,
    wordWrapWidth: 500,
});

const display_text1 = new PIXI.TextStyle({
    fontFamily: 'Tahoma',
    fontSize: 50,
    fill: ['#ffffff'], // gradient
    align: 'center',
    wordWrap: true,
    wordWrapWidth: 600,
    letterSpacing: 2
});
var userTextBox;
var passwordTextBox;
var legalTextBox;
var institutionTextBox;


var SU_userTextBox;
var SU_emailTextBox;
var SU_passwordTextBox;
var SU_repasswordTextBox;
    

function startPreLogin()
{
    //Back drop for the pre/login screen and when clicked on will reveal the login screen
    login_backgroundImage = new PIXI.Sprite.from("Images/login_background.jpg");
    
    app.stage.addChild(login_backgroundImage);
    login_backgroundImage.width = app.screen.width;
    login_backgroundImage.height = app.screen.height;
    login_backgroundImage.on("pointerdown",touchScreen);
    login_backgroundImage.alpha = 1.0;

    //For now these quotes are random ones found on the internet related to programming in general. 
    //They will be replaced with descriptions of the background image shown.
    var quoteArray = [" \'\' Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live \'\' ",
    "\'\'There are two ways of constructing a software design. One way is to make it so simple that there are obviously no deficiencies." +
     "And the other way is to make it so complicated that there are no obvious deficiencies.\'\'",
     "To iterate is human, to recurse divine.",
     "The trouble with programmers is that you can never tell what a programmer is doing until it\'s too late.",
     "Most of you are familiar with the virtues of a programmer. There are three, of course: laziness, impatience, and hubris."];
    var authorArray = ["- John Woods","- C.A.R. Hoare","- L. Peter Deutsch","- Seymour Cray","- Larry Wall"];
    //This takes the length of the quote array and decides on a random entry to use and display to the user.
    var arr_length = quoteArray.length;
    var arr_index = Math.floor((Math.random() * arr_length));

    preDisplayQuote = new PIXI.Text(quoteArray[arr_index],display_text1);
    preDisplayAuthor = new PIXI.Text(authorArray[arr_index], login_style);

    preDisplayQuote.x = app.screen.width/2 - preDisplayQuote.width/2;
    preDisplayQuote.y = app.screen.height/2 - preDisplayQuote.height/2;

    preDisplayAuthor.x = preDisplayQuote.x;
    preDisplayAuthor.y = preDisplayQuote.y + preDisplayQuote.height + preDisplayAuthor.height;

    app.stage.addChild(preDisplayQuote);
    app.stage.addChild(preDisplayAuthor);
    
    //Login_UI - container for all UI elements concerning the login screen 
    //The hexgon that surrounds all the other elements
    var pl_radius = 0;
    if (app.screen.width >= app.screen.height) { pl_radius = app.screen.height/2.5;
    } else { pl_radius = app.screen.width/2.5; }
    var login_hex = new Hexagon({x: app.screen.width/2, y:app.screen.height/2}, 0, pl_radius);
    login_hex.graphics.lineStyle(9, 0xFFFFFF);
    login_hex.graphics.on("pointerdown",moveLogin);
    login_hex.draw(0xFFFFFF, 0);
    app.stage.removeChild(login_hex.container);
    login_UI.addChild(login_hex.container);

    //Pre login text shows up when login hexagon is tiny
   // preLoginText = new PIXI.Text("Login", preLogin_style);


    var mask_hex = new Hexagon({x: app.screen.width/2, y:app.screen.height/2}, 0, pl_radius);
    mask_hex.graphics.lineStyle(9, 0xFFFFFF);
    mask_hex.draw(0xFFFFFF, 1);
    app.stage.removeChild(mask_hex.container);
    login_UI.addChild(mask_hex.container);

    loginButtonImage = new PIXI.Sprite.from("Images/Sources/Lehigh/preloginbutton.png");
    login_UI.addChild(loginButtonImage);
    loginButtonImage.mask = mask_hex.graphics;
    loginButtonImage.width = mask_hex.width;
    loginButtonImage.height = mask_hex.height;
    loginButtonImage.x = app.screen.width/2 - loginButtonImage.width/2;
    loginButtonImage.y = app.screen.height/2 - loginButtonImage.height/2;
    loginButtonImage.on("pointerdown",showLogin);
    loginButtonImage.interactive = true;
    loginButtonImage.buttonMode = true;
  

    /** Inner elements of Login UI **/
    
    //Area where user types in their username    
    userTextBox = new PIXI.TextInput({
        input: {
            fontFamily: 'Tahoma',
            fontSize: '14pt',
            padding: '10px',
            width: '250px',
            color: '#FFFFFF',
            letterSpacing: 2
        }, 
        box: generateTextLine(login_hex.x-(pl_radius+50)/2, login_hex.y-31, pl_radius+50, 3, 1)
    });
    userTextBox.x = login_hex.x-(pl_radius+50)/2 + 2;
    userTextBox.y = login_hex.y - 75;
    userTextBox.interactiveChildren = true;
    userTextBox.placeholder = "Username";
    Inner_Login_UI.addChild(userTextBox);

    //Area where user types in password
    passwordTextBox = new PIXI.TextInput({
        input: {
            fontFamily: 'Tahoma',
            fontSize: '14pt',
            padding: '10px',
            width: '250px',
            color: '#FFFFFF',
            letterSpacing: 2
        }, 
        box: generateTextLine(login_hex.x-(pl_radius+50)/2, login_hex.y+44, pl_radius+50, 3, 1)
    });
    passwordTextBox.x = login_hex.x-(pl_radius+50)/2 + 2;
    passwordTextBox.y = login_hex.y;
    passwordTextBox.interactiveChildren = true;
    passwordTextBox.placeholder = "Password";
    Inner_Login_UI.addChild(passwordTextBox);

    

    //Interactable text used to move to project selection screen
    let loginText = new PIXI.Text("Login", login_style);
    loginText.x = login_hex.x - loginText.width/2;
    loginText.y = login_hex.y + 135;
    loginText.interactive = true;
    loginText.buttonMode = true;
    loginText.on("pointerdown", loginToBackend);
    Inner_Login_UI.addChild(loginText);

    //Interactable text used to move to sign up screen
    let signUpText = new PIXI.Text("Sign Up", signUp_style);
    signUpText.x = login_hex.x - signUpText.width/2;
    signUpText.y = loginText.y + (signUpText.height * 3);
    signUpText.on("pointerdown",moveLogin);
    signUpText.interactive = true;
    signUpText.buttonMode = true;
    Inner_Login_UI.addChild(signUpText);

    /** End of inner Login UI elements**/
    Inner_Login_UI.alpha = 0;
    Inner_Login_UI.interactiveChildren = false;
    login_UI.addChild(Inner_Login_UI);

    //Adjusting Login Ui to its starting position
    login_UI.alpha = 1;
    scaleTransform(.1, .1, login_UI, 1);
    positionTransform(app.screen.width - ((login_UI.width * .1) * 1.2), app.screen.height - ((login_UI.height * .1) * 1.2), login_UI, 1);
   // login_UI.addChild(preLoginText);
  //  preLoginText.x = login_UI.x + login_UI.width - login_hex.width/2 - preLoginText.width/2;
  //  preLoginText.y = login_UI.y + login_UI.height - login_hex.height/2 - preLoginText.height/2;
   // preLoginText.alpha = 1;
    app.stage.addChild(login_UI);
    /**
     *  Sign Up UI is similar to login as it is a hexagon will text boxes inside of it.
     *  It starts off hidden a the bottle of the screen and is shown after the move Login
     *  functino is used.
     * **/
    signUp_UI.interactiveChildren = true;
    signUp_UI.on("pointerdown",moveLogin);
    signUp_UI.y = app.screen.height;

    //The Hexagon acting as the boundary for the sign up screen
    var signup_hex = new Hexagon({x: app.screen.width/2, y:app.screen.height/2}, 0, pl_radius);
    signup_hex.graphics.lineStyle(9, 0xFFFFFF);
    signup_hex.graphics.alpha = 1;
    signup_hex.graphics.on("pointerdown",moveLogin);
    signup_hex.draw(0xFFFFFF, 0);
    app.stage.removeChild(signup_hex.container);
    signUp_UI.addChild(signup_hex.container);

    

    /** Here begins the many text boxes used in the sign up page **/
    SU_userTextBox = new PIXI.TextInput({
        input: {
            fontFamily: 'Tahoma',
            fontSize: '13pt',
            padding: '10px',
            width: '250px',
            color: '#FFFFFF',
            letterSpacing: 2
        }, 
        box: generateTextLine(signup_hex.x-(pl_radius+20)/2, signup_hex.y - 141, pl_radius+20, 3, 2)
    });
    SU_userTextBox.x = signup_hex.x-(pl_radius+20)/2 + 2;
    SU_userTextBox.y = signup_hex.y - 182;
    SU_userTextBox.interactiveChildren = true;
    SU_userTextBox.placeholder = "Enter Username";
    signUp_UI.addChild(SU_userTextBox);

    SU_emailTextBox = new PIXI.TextInput({
        input: {
            fontFamily: 'Tahoma',
            fontSize: '13pt',
            padding: '10px',
            width: '250px',
            color: '#FFFFFF',
            letterSpacing: 2
        }, 
        box: generateTextLine(signup_hex.x-(pl_radius+20)/2, signup_hex.y- 81, pl_radius+20, 3, 2)
    });
    SU_emailTextBox.x = signup_hex.x-(pl_radius+20)/2 + 2;
    SU_emailTextBox.y = signup_hex.y - 122;
    SU_emailTextBox.interactiveChildren = true;
    SU_emailTextBox.placeholder = "Enter Email";
    signUp_UI.addChild(SU_emailTextBox);


    SU_passwordTextBox = new PIXI.TextInput({
        input: {
            fontFamily: 'Tahoma',
            fontSize: '13pt',
            padding: '10px',
            width: '250px',
            color: '#FFFFFF',
            letterSpacing: 2
        }, 
        box: generateTextLine(signup_hex.x-(pl_radius+20)/2, signup_hex.y - 21, pl_radius+20, 3, 2)
    });
    SU_passwordTextBox.x = signup_hex.x-(pl_radius+20)/2 + 2;
    SU_passwordTextBox.y = signup_hex.y - 62;
    SU_passwordTextBox.interactiveChildren = true;
    SU_passwordTextBox.placeholder = "Password";
    signUp_UI.addChild(SU_passwordTextBox);

    SU_repasswordTextBox = new PIXI.TextInput({
        input: {
            fontFamily: 'Tahoma',
            fontSize: '13pt',
            padding: '10px',
            width: '250px',
            color: '#FFFFFF',
            letterSpacing: 2
        }, 
        box: generateTextLine(signup_hex.x-(pl_radius+20)/2, signup_hex.y+ 41, pl_radius+20, 3, 2)
    });
    SU_repasswordTextBox.x = signup_hex.x-(pl_radius+20)/2 + 2;
    SU_repasswordTextBox.y = signup_hex.y + 0;
    SU_repasswordTextBox.interactiveChildren = true;
    SU_repasswordTextBox.placeholder = "Confirm Password";
    signUp_UI.addChild(SU_repasswordTextBox);


    legalTextBox = new PIXI.TextInput({
        input: {
            fontFamily: 'Tahoma',
            fontSize: '14pt',
            padding: '10px',
            width: '250px',
            color: '#FFFFFF',
            letterSpacing: 2
        }, 
        box: generateTextLine(signup_hex.x-(pl_radius+20)/2, signup_hex.y + 101, pl_radius+20, 3, 2)
    });
    legalTextBox.x = signup_hex.x-(pl_radius+20)/2 + 2;
    legalTextBox.y = signup_hex.y + 60;
    legalTextBox.interactiveChildren = true;
    legalTextBox.placeholder = "Legal Name";
    signUp_UI.addChild(legalTextBox);

    //Area where user types in password
    institutionTextBox = new PIXI.TextInput({
        input: {
            fontFamily: 'Tahoma',
            fontSize: '14pt',
            padding: '10px',
            width: '250px',
            color: '#FFFFFF',
            letterSpacing: 2
        }, 
        box: generateTextLine(signup_hex.x-(pl_radius+20)/2, signup_hex.y + 161, pl_radius+20, 3, 2)
    });
    institutionTextBox.x = signup_hex.x-(pl_radius+20)/2 + 2;
    institutionTextBox.y = signup_hex.y + 120;
    institutionTextBox.interactiveChildren = true;
    institutionTextBox.placeholder = "Institution";
    signUp_UI.addChild(institutionTextBox);


    var SU_signUpText = new PIXI.Text("Sign Up", login_style);
    SU_signUpText.x = signup_hex.x - SU_signUpText.width/2;
    SU_signUpText.y = signup_hex.y + 195;
    SU_signUpText.interactive = true;
    SU_signUpText.buttonMode = true;
    SU_signUpText.on("pointerdown", signUpBackend);
    signUp_UI.addChild(SU_signUpText);
    
    //This text lies within the backtologin button and will be the interactive
    //section users click on
    var SU_loginText = new PIXI.Text("Back", signUp_style);
    SU_loginText.x = signup_hex.x - SU_loginText.width/2;
    SU_loginText.y = SU_signUpText.y + SU_loginText.height * 2;
    //signUpText.x = login_hex.x - signUpText.width/2;
    //signUpText.y = loginText.y + (signUpText.height * 3);
    SU_loginText.interactive = true;
    SU_loginText.buttonMode = true;
    SU_loginText.on("pointerdown",moveSignUp);
    signUp_UI.addChild(SU_loginText);

    app.stage.addChild(signUp_UI);
}


function generateTextLine(x, y, w, lineWidth, type){
    let line = new PIXI.Graphics();
    line.lineStyle(lineWidth, 0xFFFFFF)
        .moveTo(x, y)
        .lineTo(x+w, y);
    if (type == 1) { Inner_Login_UI.addChild(line); }
    else if (type ==2) { signUp_UI.addChild(line); }
}

function showLogin(event){

    //Make quote and login button fade
    alphaTransform(preDisplayQuote, 0, 10);
    alphaTransform(preDisplayAuthor, 0, 10);
    alphaTransform(this, 0, 10);

    //Show inner parts of login Ui
    alphaTransform(Inner_Login_UI, 1, 15);

    //Move Hexagon to front of the screen
    scaleTransform(1, 1, login_UI, 15);
    positionTransform(0, 0, login_UI, 15);

    //blur background
    blurTransform(login_backgroundImage, 1, 10);

    //Make UI interactive 
    Inner_Login_UI.interactiveChildren = true;
    this.interactive = false;
    this.buttonMode = false;

    login_backgroundImage.interactive = true;
    login_backgroundImage.buttonMode = true;

    
    //CheckAFK(0);
}

function hideLogin(event){
    //Make quote and login button fade
    alphaTransform(preDisplayQuote, 1, 30);
    alphaTransform(preDisplayAuthor, 1, 30);
    alphaTransform(loginButtonImage, 1, 30);

    //Show inner parts of login Ui
    alphaTransform(Inner_Login_UI, 0, 10);

    //Move Hexagon to front of the screen
    scaleTransform(.1, .1, login_UI, 15);
    positionTransform(app.screen.width - ((login_UI.width * .1) * 1.2), app.screen.height - ((login_UI.height * .1) * 1.2), login_UI, 15);

    //blur background
    blurTransform(this, 0.1, 1);

    //Make UI interactive 
    Inner_Login_UI.interactiveChildren = false;

    loginButtonImage.interactive = true;
    loginButtonImage.buttonMode = true;

    login_backgroundImage.interactive = false;
    login_backgroundImage.buttonMode = false;

    //CheckAFK(2);
}

function moveLogin(event){
    positionTransform(0, -login_UI.height - 100, login_UI, 20);
    positionTransform(0, 0, signUp_UI, 20);
    Inner_Login_UI.interactiveChildren = false;
    signUp_UI.interactiveChildren = true;
    //CheckAFK(2);
}

function moveSignUp(event){
    positionTransform(0, 0, login_UI, 20);
    positionTransform(0, app.screen.height, signUp_UI, 20);
    Inner_Login_UI.interactiveChildren = true;
    signUp_UI.interactiveChildren = false;
    //CheckAFK(0);
}

function showInput(event){
    var x = event.keyCode;
    console.log("Activated function");
    blurText.text += x;
}

//Agustin: edit
function toProjectSelection()
{
    currentActivity = activityArray[1];
    alphaTransform(login_backgroundImage,0.0, 10 )
    positionTransform(-1000, app.stage.y, app.stage, 12)
    updateActivity();
}

function CheckAFK(flag){
    let limit = 60;
    let count = 0;                          //The variable "count" will start at zero but be incremented inside the animation loop
    
    let TimerIncrease =() => {                  //We are declaring the animation function here
        if(count >= limit){                
            hideLogin();
            app.ticker.remove(TimerIncrease);
        } 
        else{
            count++;
        }
    }
    //flags: 0 = start/ 1 = restart/ 2 = end
    if(flag == 0){
        app.ticker.add(TimerIncrease); 
    }
    else if(flag == 1){
        app.ticker.remove(TimerIncrease);   
        app.ticker.add(TimerIncrease); 
    }
    else if(flag == 2){
        app.ticker.remove(TimerIncrease);   
    }

}

function touchScreen(){
    //CheckAFK(1);
}