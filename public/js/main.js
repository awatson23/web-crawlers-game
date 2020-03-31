var socket = io.connect("http://localhost:3000");

var coords = {
	xVal: 0,
	yVal: 0
}

var score = 0;
var gameOver = document.getElementById("gameOver");
var playAgain = document.getElementById("playAgain");

loseBool = false;
highScore = 0;


socket.on("xVal", function(xVal){
	//take value and write it to the object
	coords.xVal = xVal;
	//send coords value to draw function
	draw(coords)
});

socket.on("yVal", function(yVal){
	//take value and write it to the object
	 coords.yVal = yVal;
	//send coords value to draw function
   draw(coords)
});

let gameFont;

function preload() {
  gameFont = loadFont('../images/PressStart2P-Regular.ttf');
}

function setup() {
    createCanvas(1024, windowHeight);
    textFont(gameFont)
    //here is where all of the bugs and their random qualities
    //are loaded
    bug1 = new Bug("orange", 0, random(80, 450), random(4, 5));
    bug2 = new Bug("green", 0, random(80, 450), random(1, 4));
    bug3 = new Bug("green",0, random(80, 450), random(1, 4));
    bug4 = new Bug("green",0,random(80, 450), random(1, 5));
    bug5 = new Bug("orange", 0, random(80, 450), random(2.5, 4));
    bug6 = new Bug("green",0, random(80, 450), random(1, 4));

    //preload images into variables
    spider_img = loadImage('../images/spider.svg');
    bug_img = loadImage('../images/cockroach.svg');
    bad_bug_img = loadImage('../images/badroach.svg');
}


function draw() {
  
    background(5, 5, 5);
    noFill();
    
    //display the spiders web
    web();
   
    //load the players image. if the player hasnt lost, allow
    //control of the x and y coordinates. if they lost, make
    //the image static
    if (loseBool == true) {
      image(spider_img, 1024/2, 575, 70, 70);
    } else {
      image(spider_img, coords.xVal, coords.yVal, 70, 70);
    }

    //display all the bugs
    bug1.display();
    bug1.crawl(); 

    bug2.display();
    bug2.crawl();

    bug3.display();
    bug3.crawl();

    bug4.display();
    bug4.crawl();

    bug5.display();
    bug5.crawl();

    bug6.display();
    bug6.crawl();
    

    //here is where the text is displayed
    fill('WHITE')
    textSize(17);
    text(`Highscore: ${highScore}`, 750, windowHeight - 200);
    textSize(25);
    text(`Score: ${score}`, 750, windowHeight - 150);
    textSize(12);
    fill('LIMEGREEN')
    text("Green are good.", 770, windowHeight - 100);
    fill('ORANGE')
    text("Orange are bad.", 770, windowHeight - 70);

}

//background web art made of a bezier curve loop
function web() {
  stroke("WHITE")
  strokeWeight(.35);
    for (let i = 0; i < 1000; i += 10) {
        bezier(
          0,
          0 + i * 3,
          100 + i /6,
          random(199,200) + i/1.5,
          800 +  i/5,
          random(18, 20),
          1100,
          0,     
        );
   }
}


//the following object oriented program is recycled from a semester
//three lesson where we used "fish" rather than "bugs".
//i have modified it to suit the game.
class Bug {
    constructor(bugCol, bugXpos, bugYpos, bugSpeed) {
        this.bugCol = bugCol;
        this.bugXpos = bugXpos;
        this.bugYpos = bugYpos;
        this.bugSpeed = bugSpeed;
    }

    display() {
        //if the bugs colour is orange, an orange bug image is loaded
        if (this.bugCol == "orange") {
          image(bad_bug_img, this.bugXpos+30, this.bugYpos, 35, 45);
        } else {
          //otherwise, load a green bug
          image(bug_img, this.bugXpos+30, this.bugYpos, 35, 35);
        } 
    }

     crawl() {
       //the speed of the bug determines how quickly it will "crawl"
       //accross the screen
        this.bugXpos += this.bugSpeed;
        if(this.bugXpos > width) {
            this.bugXpos = 0;
            //when the bug finishes crawling across the screen,
            //the y position/speed will reset its values so it
            //doesnt repeat the same path or speed
            this.bugYpos = random(80, 450);
            this.bugSpeed = random(1, 5);
        }

        //if the position of the players coordinates matches up 
        //to the bugs (with a 60 pixels leeway), a response is triggered
        if ((this.bugXpos <= coords.xVal + 30 && this.bugXpos >= coords.xVal - 30) && (this.bugYpos <= coords.yVal + 30 && this.bugYpos >= coords.yVal - 30)) {
          //if you hit a bad bug, the game resets
          if (this.bugCol == "orange") {
            //if you lost, the loseBool will become true,
            //and will change the players x and y pos to static
            //so they can't keep scoring
            loseBool = true;

            //if the players game score was higher than their
            //last recorded highscore, record the highscore
            if (highScore < score) {
              highScore = score;
            } 
            
            //game over message and play again button becomes visible
            gameOver.style.visibility = 'visible';   
            gameOver.innerHTML = `
            <p>You ate a bad bug and died!</p>
            <div id="playAgain">Keep crawling</div>
            <p>Score: ${score}</p>` 

            //find the newly generated INNERHTML and make a variable
            //for the new button
            var playAgain = document.getElementById("playAgain");
          
            //if play again is clicked, the game resets important
            //variables and hides the game over screen
            playAgain.addEventListener("click", function(){
              score = 0;
              loseBool = 0;
              gameOver.style.visibility = 'hidden'; 
            }, false);
         
          } else {
          //if you hit a good bug, the bug will disappear and you
          //will be awarded 1 point
            this.bugXpos = 2000;
            score++
          }
        
        }
      
    }

}