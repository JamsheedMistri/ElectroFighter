//Import resources!
import scene, effects, communityart, AudioManager;

//Create all the variables necessary for the game.
var playerWidth = 100;
var playerHeight = 134;
var enemyWidth = 23;
var enemyHeight = 36;
var MS = 750;
var speed = 100;
var centerX = scene.screen.centerX;
var centerY = scene.screen.centerY;
var playerJump = -400;
var gravity = 1000;
var menu = true;
var game = false;
var gameOver = false;
var level = 1;
var totalLives = 5;
var lives = totalLives;
var scoreDisplay;
var score = 0;
var highScoreDisplay;
var highScore = 0;
var levelDisplay;
var background;

//Import audio files here.
var audioManager = new AudioManager({
  files: {
    'main': {
      sources: ['resources/ElectroFighter/music/main.mp3'],
      loop: true
    },
    'beep': {
      sources: ['resources/ElectroFighter/music/beep.mp3']
    },
    'bad': {
      sources: ['resources/ElectroFighter/music/bad.mp3']
    }
  }
});

//Configuring the menu background
scene.registerConfig('menu', {
  type: 'ImageView',
  opts: {
    url: 'resources/ElectroFighter/images/menu.png'
  }
});

//Configuring the game over background
scene.registerConfig('gameover', {
  type: 'ImageView',
  opts: {
    url: 'resources/ElectroFighter/images/gameover.png'
  }
});

//Configuring the player character
scene.registerConfig('player', {
  type: 'ImageView',
  opts: {
    url: 'resources/ElectroFighter/images/5bytes.png',
    width: playerWidth,
    height: playerHeight,
    offsetX: -(playerWidth * 0.5),
    offsetY: -(playerHeight * 0.5),
    hitBounds: {
      radius: playerWidth
    }
  }
});

//Configuring the enemies
scene.registerConfig('enemies', {
  type: 'default',
  opts: {
    hitOpts: {
      radius: enemyWidth
    },
    viewOpts: {
      url: 'resources/ElectroFighter/images/0.png',
      width: enemyWidth,
      height: enemyHeight,
      offsetX: -(enemyWidth * 0.5),
      offsetY: -(enemyHeight * 0.5)
    }
  }
});

//Configuring the brackets
scene.registerConfig('brackets', {
  type: 'default',
  opts: {
    hitOpts: {
      radius: enemyWidth
    },
    viewOpts: {
      url: 'resources/ElectroFighter/images/brackets.png',
      width: enemyWidth,
      height: enemyHeight,
      offsetX: -(enemyWidth * 0.5),
      offsetY: -(enemyHeight * 0.5)
    }
  }
});

//Configuring the destroy particles
scene.registerConfig('particles', {
  type: 'Array',
  opts: [
    'resources/ElectroFighter/images/smoke1.png',
    'resources/ElectroFighter/images/smoke2.png',
    'resources/ElectroFighter/images/smoke3.png',
    'resources/ElectroFighter/images/smoke4.png',
    'resources/ElectroFighter/images/smoke5.png',
    'resources/ElectroFighter/images/smoke6.png'
  ]
});

//Configuring the game background
scene.registerConfig('parallax', {
  type: 'ParallaxConfig',
  config: [
    {
      id: "bg",
      xMultiplier: 0.1,
      xCanSpawn: true,
      xCanRelease: true,
      yMultiplier: 0,
      yCanSpawn: false,
      yCanRelease: false,
      width: scene.screen.height,
      height: scene.screen.height,
      pieceOptions: [
        {
          image: "resources/ElectroFighter/images/bg.png"
        }
      ]
    }
  ]
});

//Making a playSound function for easy access to playing sounds.
function playSound(name) {
  if (name == 'main') {
    audioManager.play('main', {});
  }
  if (name == 'beep') {
    audioManager.play('beep', {});
  }
  if (name == 'bad') {
    audioManager.play('bad', {});
  }
}


/****************************************************************
 * START TO MAIN *
 ****************************************************************/
exports = scene(function () {

  //Function that refills players' lives on level change
  function refill() {
    totalLives -= 1;
    lives = totalLives;
  }

  //Setting the old high score to the highScore before it is updated
  var oldHighScore = highScore;
  var oldHighScoreDisplay;

  //Making an addHighScore function for easy access to adding to the high score.
  function addHighScore() {
    if (score > highScore) {
      highScore = score;
    }
  }

  //Stop the current song at the beginning of the program (if it's running) and start it fresh.
  audioManager.stop('main');
  playSound('main');

  //Add a menu background from the predefined config
  background = scene.addBackground(scene.getConfig('menu'));

  //Add a player from the predefined config
  var player = scene.addActor(scene.getConfig('player'), {
    x: -1000,
    y: -1000
  });

  //Check for players tapping the screen
  scene.screen.onDown(myTouchManager);

  //Execute this when the screen is touched.
  function myTouchManager(touch) {
    if (menu) {
      //If the menu is active while the touch happens, do this code.
      player.x = playerWidth + 10;
      player.y = scene.screen.centerY;
      background = scene.addBackground(scene.getConfig('parallax'));
      menu = false;
      game = true;
    }
    if (game) {
      //If the game is active while the touch happens, make the player fly.
      player.ay = gravity;
      player.vy = playerJump;
    }
    if (gameOver) {
      //If the game over menu is active while the touch happens, do this code.
      menu = true;
      game = false;
      gameOver = false;
      score = 0;
      totalLives = 5;
      MS = 750;
      speed = 100;
      lives = totalLives;
      background = scene.addBackground(scene.getConfig('parallax'));
      scene.reset();
    }
  }

  //Adding enemies from predefined config
  var enemies = scene.addGroup();
  var enemySpawner = scene.addSpawner(new scene.spawner.Timed(
        [
            new scene.shape.Line({
        x: scene.screen.width,
        y: 0,
        y2: scene.screen.height
      })
        ],
    function (x, y, index) {
      if (game) {
        //Retrieving the config from the top
        var config = scene.getConfig('enemies');

        //Choosing if the enemy is a one or a zero by a random math function
        var oneOrZero = Math.random(1);

        //Choosing a random y spawn value for each binary
        y = Math.random(scene.screen.height) * scene.screen.height;

        //Adding each individual actor at a different location
        var enemy = enemies.addActor(config, {
          x: x,
          y: y
        });
        enemy.headToward(0, y, speed);

        //Setting the image based on the one or zero variable that was earlier defined
        if (oneOrZero < 0.5) {
          enemy.view.setImage('resources/ElectroFighter/images/0.png');
        } else {
          enemy.view.setImage('resources/ElectroFighter/images/1.png');
        }

        //Custom override to destroying enemies, which explodes the enemy and adds to the overall enemy speed and delay
        enemy.onDestroy(function () {
          effects.explode(enemy, {
            images: scene.getConfig('particles'),
            scale: 0.75,
            speed: 2
          });
          if (MS < 800 && MS > 601) MS *= 0.99;
          else if (MS < 600 && MS > 501) MS *= 0.99;
          else if (MS < 500 && MS > 401) MS *= 0.999;
          else if (MS < 400) MS = 400;
          enemySpawner.spawnDelay = MS;

          if (speed >= 100 && speed <= 150) speed += 5;
          else if (speed >= 150 && speed <= 200) speed += 4;
          else if (speed >= 200 && speed <= 250) speed += 3;
          else if (speed >= 250 && speed <= 300) speed += 2;
          else if (speed >= 300 && speed <= 400) speed += 1;
          else if (speed >= 400) speed = 400;
        });
      }

    }, 750
  ));

  //Adding enemies from predefined config
  var brackets = scene.addGroup();
  var bracketSpawner = scene.addSpawner(new scene.spawner.Timed(
        [
            new scene.shape.Line({
        x: scene.screen.width,
        y: 0,
        y2: scene.screen.height
      })
        ],
    function (x, y, index) {
      if (game) {
        //Retrieving the config from the top
        var configBrackets = scene.getConfig('brackets');

        //Choosing a random y spawn value for each bracket
        y = Math.random(scene.screen.height) * scene.screen.height;

        //Adding each individual actor at a different location
        var bracket = brackets.addActor(configBrackets, {
          x: x,
          y: y
        });
        bracket.headToward(0, y, speed);

        //Custom override to destroying brackets, which explodes the bracket and adds to the overall bracket speed and delay
        bracket.onDestroy(function () {
          effects.explode(bracket, {
            images: scene.getConfig('particles'),
            scale: 0.75,
            speed: 2
          });

          if (speed >= 100 && speed <= 150) speed += 5;
          else if (speed >= 150 && speed <= 200) speed += 4;
          else if (speed >= 200 && speed <= 250) speed += 3;
          else if (speed >= 250 && speed <= 300) speed += 2;
          else if (speed >= 300 && speed <= 400) speed += 1;
          else if (speed >= 400) speed = 400;
        });
      }

    }, 6000
  ));

  //Checking if the enemies and the left wall of the screen are colliding.
  scene.onCollision(enemies, scene.camera.leftWall, function (enemy) {
    //If so, destroy the enemy, play a beeping noise, add to the score.
    enemy.destroy();
    playSound('beep');
    score += 1;
    addHighScore();

    if ((score % 100) == 0 && score <= 400) {
      refill();
    }
  });

  //Checking if the enemies and the player are colliding
  scene.onCollision(enemies, player, function (enemy) {
    //If so, take away 1 life, play a low beep sound, and destroy the enemy
    playSound('bad');
    enemy.destroy();
    lives -= 1;
  });

  //Checking if the brackets and the player are colliding
  scene.onCollision(brackets, player, function (bracket) {
    //If so, add one to the score, play a beeping sound, and destroy the bracket.
    playSound('beep');
    bracket.destroy();
    score += 1;
    addHighScore();
  });

  //Call this function every tick.
  scene.onTick(function () {
    //Make the parallax background scroll
    scene.background.scroll(-10, 0);

    //Change the player's image based on the player's lives.
    if (lives == 5) player.view.setImage('resources/ElectroFighter/images/5bytes.png');
    else if (lives == 4) player.view.setImage('resources/ElectroFighter/images/4bytes.png');
    else if (lives == 3) player.view.setImage('resources/ElectroFighter/images/3bytes.png');
    else if (lives == 2) player.view.setImage('resources/ElectroFighter/images/2bytes.png');
    else if (lives == 1) player.view.setImage('resources/ElectroFighter/images/1bytes.png');
    else if (lives == 0) {
      //End the game when the player has 0 lives.
      enemies.destroy();
      brackets.destroy();

      score = 0;
      gameOver = true;
      background = scene.addBackground(scene.getConfig('gameover'));
      game = false;

      //Huge explosion
      for (var i = 0; i <= 100; i++) {
        effects.explode(player, {
          images: scene.getConfig('particles'),
          scale: 0.75,
          speed: 2
        });
      }
      player.destroy();
      scene.removeText(scoreDisplay);
      scene.removeText(highScoreDisplay);
      scene.removeText(oldHighScoreDisplay);
      scene.removeText(levelDisplay);
      lives = -1;
    }

    //If the game is going on, display the score
    if (!(lives == -1) && game) {
      if (scoreDisplay) {
        scene.removeText(scoreDisplay);
      }
      scoreDisplay = scene.addText(score, {
        y: 10,
        color: "gold",
        font: "monospace"
      });
    }

    //If the game is going on, display the high score
    if (!(lives == -1) && game) {
      if (highScoreDisplay) {
        scene.removeText(highScoreDisplay);
        scene.removeText(oldHighScoreDisplay);
        scene.removeText(levelDisplay);
      }
      highScoreDisplay = scene.addText(highScore, {
        y: scene.screen.height - 100,
        color: "gold",
        font: "monospace"
      });
    }

    //If the game is going on, do this.
    if (game) {
      //Check if the score should change the level. If so, change it.
      if (score >= 0 && score < 100) {
        levelDisplay = scene.addText("LEVEL 1", {
          y: scene.screen.height - 200,
          scale: 0.5,
          color: "red",
          font: "monospace"
        });

      } else if (score >= 100 && score < 200) {
        level = 2;
        levelDisplay = scene.addText("LEVEL 2", {
          y: scene.screen.height - 200,
          scale: 0.5,
          color: "orange",
          font: "monospace"
        });

      } else if (score >= 200 && score < 300) {
        level = 3;
        levelDisplay = scene.addText("LEVEL 3", {
          y: scene.screen.height - 200,
          scale: 0.5,
          color: "yellow",
          font: "monospace"
        });

      } else if (score >= 300 && score < 400) {
        level = 4;
        levelDisplay = scene.addText("LEVEL 4", {
          y: scene.screen.height - 200,
          scale: 0.5,
          color: "green",
          font: "monospace"
        });

      } else if (score >= 400) {
        level = 5;
        levelDisplay = scene.addText("LEVEL 5", {
          y: scene.screen.height - 200,
          scale: 0.5,
          color: "cyan",
          font: "monospace"
        });

      }

      //Check if the player goes off the screen.
      if (player.y < 0 || player.y > scene.screen.height - (playerHeight / 2)) {
        //If so, explode the player and go to game over menu.
        effects.explode(player, {
          images: scene.getConfig('particles'),
          scale: 0.75,
          speed: 2
        });
        enemies.destroy();
        brackets.destroy();
        player.destroy();
        scene.removeText(scoreDisplay);
        scene.removeText(highScoreDisplay);
        scene.removeText(oldHighScoreDisplay);
        scene.removeText(levelDisplay);
        background = scene.addBackground(scene.getConfig('gameover'));
        game = false;
        gameOver = true;
      }
    } else if (gameOver) {
      //Game over menu code.

      //If the old high score from the beginning of the game is less than the new high score, show that the user got a new high score.
      if (oldHighScore < highScore) {
        oldHighScoreDisplay = scene.addText("NEW HIGH SCORE! " + highScore, {
          y: scene.screen.centerY - 200,
          color: "gold",
          font: "monospace"
        });
      } else {
        //If not, show their score.
        oldHighScoreDisplay = scene.addText("YOUR SCORE: " + score, {
          y: scene.screen.centerY - 200,
          color: "gold",
          font: "monospace"
        });
      }
    }

  });


});
