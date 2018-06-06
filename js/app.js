// Enemies our player must avoid
class Enemy  {
    constructor(x, y, speed){
        this.sprite = 'images/enemy-bug.png';
        // enemy X pos = [1, 102, 203, 405];
        // enemy y pos = [71, 154, 237];
        this.x = x;
        this.y = y;
        this.speed = speed;
    }

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
  update(dt){
    this.x = this.x + this.speed * dt;
    //length of canvas = 505 Set x to -101 once enemy reaches edge of canvas
    if (this.x > 505) {
        this.x = -101;
    }
    
    const collisionXRules = (parseInt(this.x + 66) > player.x && parseInt(this.x) < player.x) || (parseInt(this.x + 66) > player.x + 60 && parseInt(this.x) < player.x + 66);
    const collisionYRules = (this.y === player.y);
    //check for enemy collision with player
    if (collisionXRules && collisionYRules) {
        player.playerDeath();
    }

  }

// Draw the enemy on the screen, required method for game
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

};

class Player {
    constructor(sprite){
        this.sprite = 'images/char-boy.png';
        this.x = 203;
        this.y = 403;
        this.hearts = 3;
        this.controllable = true;
    }

  update(dt){
      //checks if player is in the river
    if (this.y === -12) {
        pointsScored();
        riverReached();
    }
  }

  playerDeath() {
      this.hearts -= 1;
      takeAwayHeart();
      playerDeathSound.play();
      if (this.hearts === 0) {  
        this.controllable = false;
        resetHearts();
        showModal();
      } else {
      this.x = 203;
      this.y = 403;
      }
  }

  render(){ 
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // conditionals check to see if player is at boundry and do not adjust value if player is at boundry. Also checks for controllable boolean.
  handleInput(e) {
    const moveLeft = (e === 'left' && this.x !== 1 && this.controllable === true);
    const moveRight = (e === 'right' && this.x !== 405 && this.controllable === true);
    const moveDown = (e === 'down' && this.y !== 403 && this.controllable === true);
    const moveUp = (e === 'up' && this.y !== -12 && this.controllable === true);

      if (moveLeft) {
      this.x -= 101;
    } else if (moveRight) {
        this.x += 101;
    } else if (moveDown) {
        this.y += 83;
    } else if (moveUp) {
        this.y -= 83;
    }
  }

}
//instatiate player object
player = new Player;

//get random speeds for enemies
const randomSpeed = {
    top:(() => Math.floor(Math.random() * 300) + 20)(),
    mid:(() => Math.floor(Math.random() * 300) + 150)(),
    bot:(() => Math.floor(Math.random() * 300) + 50)(),
}

//instantiate enemies
const enemyTop = new Enemy(1, 71, randomSpeed.top);
const enemyMid = new Enemy(1, 154, randomSpeed.mid);
const enemyBot = new Enemy(1, 237, randomSpeed.bot);
const allEnemies = [enemyTop, enemyMid, enemyBot]

//hearts 
let heartOne = document.getElementById('heart-one');
let heartTwo = document.getElementById('heart-two');
let heartThree = document.getElementById('heart-three');

// set hidden attributes to default on hearts
const resetHearts = () => {
    heartThree.hidden = false;
    heartTwo.hidden = false;
    heartOne.hidden = false;
}

//deletes a heart from the scoreboard
const takeAwayHeart = () => {
    if (player.hearts === 2) {
      heartOne.hidden = true;
    } else if (player.hearts === 1) {
      heartTwo.hidden = true;
    } else if (player.hearts === 0) {
      heartThree.hidden = true;
    } 
}  



// adds 50 points to scoreboard.
const pointsScored = () => {
    let score = document.getElementById('score');
    let currentScore = parseInt(score.innerText);
    score.innerText = parseInt(currentScore += 50); 
}
// tracks the score and updates the score on scoreboard
const updateHighScore = () => {
    const highScoreDiv = document.querySelector('.high-score');
    let score = document.getElementById('score');
    currentScore = parseInt(score.innerText);
    highScoreDiv.innerText = currentScore;
}

const hideModal = () => {
  const modal = document.getElementById('game-over');  
  const modalChildren = document.getElementById('game-over').querySelectorAll('*');
  //loops through nodeList to hide children
    for (let i=0; i < modalChildren.length; i++) {
        modalChildren[i].hidden = true;
    }
  modal.className = 'hide';
}

const showModal = () => {
    const modal = document.getElementById('game-over');  
    const modalChildren = document.getElementById('game-over').querySelectorAll('*');
    const highScoreLabel = document.querySelector('.high-score-label');
    let score = document.getElementById('score');
    const highScore = document.querySelector('.high-score');
    highScoreLabel.innerText = 'High Score: ';
    let currentScore = score.innerText;
    highScore.innerText = currentScore;
    //loops through nodeList to show children
      for (let i=0; i < modalChildren.length; i++) {
          modalChildren[i].hidden = false;
      }
    modal.className = 'game-over-modal';
}


//Sounds---  found some starcraft sounds hosted by amazon through a website called nuclearLaunchdetected.com

const svcYesLinks = [
'https://s3.amazonaws.com/nuclearlaunchdetected/mp3/SCV_Yes03.mp3', 
'https://s3.amazonaws.com/nuclearlaunchdetected/mp3/SCV_Yes04.mp3', 
'https://s3.amazonaws.com/nuclearlaunchdetected/mp3/SCV_Yes05.mp3', 
'https://s3.amazonaws.com/nuclearlaunchdetected/mp3/SCV_Yes06.mp3', 
'https://s3.amazonaws.com/nuclearlaunchdetected/mp3/SCV_Yes08.mp3',
'https://s3.amazonaws.com/nuclearlaunchdetected/mp3/SCV_Yes11.mp3',
'https://s3.amazonaws.com/nuclearlaunchdetected/mp3/SCV_Yes12.mp3',
'https://s3.amazonaws.com/nuclearlaunchdetected/mp3/SCV_Yes07.mp3',
'https://s3.amazonaws.com/nuclearlaunchdetected/mp3/SCV_Yes17.mp3',
'https://s3.amazonaws.com/nuclearlaunchdetected/mp3/SCV_Yes18.mp3'
];

// returns a random affirmative sound on doc load.
const returnRandomLink = () => {
    let randomIndex = Math.floor(Math.random() * 9);
    return svcYesLinks[randomIndex];
}   

const playerDeathSound = new Howl({
    src:['https://s3.amazonaws.com/nuclearlaunchdetected/mp3/Hellion_Death03.mp3']
})

const victorySound = new Howl({
    src:[returnRandomLink()]
    });

const riverReached = () => {
    player.x = 203;
    player.y = 403;
    victorySound.play();
}


// This listens for key presses and sends the keys to the Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


//play again button
const playAgainButton = document.getElementById('play-again-btn');
playAgainButton.addEventListener('click', () => playAgain())

const playAgain = () => {
    let score = document.getElementById('score');
    player.hearts = 3;
    player.controllable = true;
    score.innerText = 0;
    updateHighScore();
    hideModal();
}