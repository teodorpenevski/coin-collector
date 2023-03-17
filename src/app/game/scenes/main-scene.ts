import { Game } from 'phaser';
import { GameState } from '../game-state';
import { GameComponent } from '../game.component';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};
export class MainScene extends Phaser.Scene {
  gameState!: GameState;

  constructor() {
    super(sceneConfig);
  }

  //Function that gets called when there is collision between player and enemy
  hitEnemy = (player: any, enemy: any) => {
    this.gameState.decreaseHealth();
    this.tweens.add({
      targets: player,
      alpha: 0,
      ease: Phaser.Math.Easing.Linear,
      duration: 200,
      repeat: 1,
      yoyo: true,
    });
    this.gameState.updateInfoText();
    enemy.destroy();
    this.gameState.checkGameOver(this);
  };

  //Function that gets called when a player has collected a coin
  collectCoin = (player: any, coin: any) => {
    coin.destroy(coin.x, coin.y);
    this.gameState.increaseScore();
    this.gameState.updateInfoText();
    this.gameState.checkGameOver(this);
    return false;
  };

  //Function that loads between 1 and 9 coins at the start at random positions in the scene
  loadCoins(coins: any) {
    let coin;
    let spawnedCoins = Phaser.Math.Between(1, 9);

    for (let i = 0; i < spawnedCoins; i++) {
      coin = this.add.ellipse(
        Phaser.Math.Between(100, window.innerWidth - 300),
        Phaser.Math.Between(100, window.innerHeight - 300),
        20,
        25,
        0xffff00
      );
      coin = this.physics.add.existing(coin);
      coins.add(coin);
    }
  }

  //Function that loads random number of enemies between 3 and 9 and spawns them at random locations in the scene
  loadEnemies(enemies: any) {
    let enemy;
    let spawnedEnemies = Phaser.Math.Between(3, 9);

    for (let i = 0; i < spawnedEnemies; i++) {
      enemy = this.add.ellipse(
        Phaser.Math.Between(100, window.innerWidth - 300),
        Phaser.Math.Between(100, window.innerHeight - 300),
        15,
        20,
        0xff0000
      );
      enemy = this.physics.add.existing(enemy);
      enemies.add(enemy);
    }
  }

  preload() {
    this.gameState = new GameState();
  }

  //Create method called at the start of the game
  create() {
    this.gameState.square = this.add.rectangle(
      400,
      400,
      50,
      50,
      0xffffff
    ) as any;
    this.gameState.coinCount = 0;
    this.gameState.healthPoints = 3;
    //Info text to show score and health points
    this.gameState.infoText = this.add.text(
      10,
      10,
      `Coin count: ${this.gameState.coinCount}, Health: ${this.gameState.healthPoints}
Press 'space' to pause`,
      {
        font: '24px Courier',
        color: '#00ff00',
      }
    );

    //Set what to show when game is paused
    this.gameState.pauseText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        'Game Paused!',
        { font: '24px Courier' }
      )
      .setOrigin(0.5);
    this.gameState.pauseText.setVisible(false);

    //Add player to the scene
    this.physics.add.existing(this.gameState.square);

    //Initialize coins and add them to the scene
    this.gameState.coins = this.physics.add.group({
      immovable: false,
      bounceX: 1,
      bounceY: 1,
      collideWorldBounds: true,
    });
    this.loadCoins(this.gameState.coins);
    this.gameState.coins.getChildren().forEach((child) => {
      child.body.velocity.x =
        Phaser.Math.Between(-100, -50) || Phaser.Math.Between(50, 100);
      child.body.velocity.y =
        Phaser.Math.Between(-100, -50) || Phaser.Math.Between(50, 100);
    });

    //Initialize enemies and add them to the scene
    this.gameState.enemies = this.physics.add.group({
      immovable: false,
      bounceX: 1,
      bounceY: 1,
      collideWorldBounds: true,
    });
    this.loadEnemies(this.gameState.enemies);
    this.gameState.enemies.getChildren().forEach((child) => {
      child.body.velocity.x =
        Phaser.Math.Between(-300, -200) || Phaser.Math.Between(200, 300);
      child.body.velocity.y =
        Phaser.Math.Between(-300, -200) || Phaser.Math.Between(200, 300);
    });

    //Set overlap functions
    this.physics.add.overlap(
      this.gameState.square,
      this.gameState.coins,
      this.collectCoin
    );
    this.physics.add.overlap(
      this.gameState.square,
      this.gameState.enemies,
      this.hitEnemy
    );

    //Created a pause event when pressing 'Space'
    this.input.keyboard.on(
      'keydown',
      (event: any) => {
        if (event.code == 'Space') {
          this.scene.pause();
          this.scene.launch('Pause');
        }
      },
      this
    );

    //Set the world bounds and collision
    this.physics.world.bounds.setTo(
      0,
      0,
      window.innerWidth - 200,
      window.innerHeight - 200
    );
    this.gameState.square.body.setCollideWorldBounds(true);
  }

  //Update function that gets called every frame
  override update() {
    //Create cursorKeys variable to use for controls
    const cursorKeys = this.input.keyboard.createCursorKeys();

    //On pause event show the text
    this.events.on('pause', () => {
      this.gameState.pauseText.setVisible(true);
    });

    //On resume event hide the text
    this.events.on('resume', () => {
      console.log('Resumed');
      this.gameState.pauseText.setVisible(false);
    });

    //Player controls
    if (cursorKeys.up.isDown) {
      this.gameState.moveUp();
    } else if (cursorKeys.down.isDown) {
      this.gameState.moveDown();
    } else {
      this.gameState.resetMovementY();
    }
    if (cursorKeys.right.isDown) {
      this.gameState.moveRight();
    } else if (cursorKeys.left.isDown) {
      this.gameState.moveLeft();
    } else {
      this.gameState.resetMovementX();
    }
  }
}
