// Enemies our player must avoid
class Enemy  {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
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
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;

    //length of canvas = 505 Set x to -101 once enemy reaches edge of canvas
    if (this.x > 505) {
        this.x = -101;
    }
    
    const collisionXRules = (parseInt(this.x + 66) > player.x && parseInt(this.x) < player.x) ||
    (parseInt(this.x + 66) > player.x + 60 && parseInt(this.x) < player.x + 66);
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

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor(sprite){
        this.sprite = 'images/char-boy.png';
        this.x = 203;
        this.y = 403;
        this.hearts = 3;
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
      if (this.hearts === 1) {
        //TODO: Game over function.
          console.log('GAME OVER MAN!')
      }
      this.x = 203;
      this.y = 403;
      console.log('player was reset! ' + 'hearts remaining = ' + this.hearts)
  }

  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // conditionals check to see if player is at boundry and do not adjust value if player is at boundry
  handleInput(e) {
      console.log("x = " + this.x, "y = " + this.y)
      if (e === 'left' && this.x !== 1) {
      this.x -= 101;
    } else if (e === 'right' && this.x !== 405) {
        this.x += 101;
    } else if (e === 'down' && this.y !== 403) {
        this.y += 83;
    } else if (e === 'up' && this.y !== -12) {
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

//deletes a heart from the scoreboard

const takeAwayHeart = () => {
  let heartOne = document.getElementById('heart-one');
  let heartTwo = document.getElementById('heart-two');
  let heartThree = document.getElementById('heart-three');
  console.log(player.hearts)
    if (player.hearts === 2) {
      heartOne.hidden = true;
  } else if (player.hearts === 1) {
      heartTwo.hidden = true;
  } else if (player.hearts === 0) {
      heartThree.hidden = true;
  }
}

const pointsScored = () => {
    let score = document.getElementById('score');
    let currentScore = parseInt(score.innerText);
    score.innerText = parseInt(currentScore += 50); 
}

const riverReached = () => {
    player.x = 203;
    player.y = 403;
}

//Sounds
const playerDeathSound = new Howl({
    src:['http://s3.amazonaws.com/nuclearlaunchdetected/mp3/Hellion_Death03.mp3']
})

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
