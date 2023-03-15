import { GameComponent } from '../game.component';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};
export class MainScene extends Phaser.Scene {
  //Declare all variable used
  private square!: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  private coins!: Phaser.Physics.Arcade.Group;
  private coinCount!: number;
  private enemies!: Phaser.Physics.Arcade.Group;
  private healthPoints!: number;
  pauseText!: Phaser.GameObjects.Text;
  infoText!: Phaser.GameObjects.Text;

  constructor() {
    super(sceneConfig);
  }

  //Helper function to update the info text when changing states
  updateInfoText() {
    this.infoText
      .setText(`Coin count: ${this.coinCount}, Health: ${this.healthPoints}
Press 'Space' to pause`);
  }

  //Function that gets called when a player has collected a coin
  collectCoin = (player: any, coin: any) => {
    coin.destroy(coin.x, coin.y);
    this.coinCount++;
    this.updateInfoText();
    this.checkGameOver();
    return false;
  };

  //Function that gets called when there is collision between player and enemy
  hitEnemy = (player: any, enemy: any) => {
    this.healthPoints--;
    this.tweens.add({
      targets: player,
      alpha: 0,
      ease: Phaser.Math.Easing.Linear,
      duration: 200,
      repeat: 1,
      yoyo: true,
    });
    this.updateInfoText();
    enemy.destroy();
    this.checkGameOver();
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

  //Function that shows the restart button at the end of the game
  showRestartButton() {
    let button = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, 'Restart')
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({ backgroundColor: '#111', fontSize: '48px' })
      .setInteractive({ useHandCursor: true })
      .on(
        'pointerdown',
        () => {
          this.scene.restart();
        },
        this
      )
      .on('pointerover', () => button.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => button.setStyle({ fill: '#FFF' }));
    return button;
  }

  //Helper function to clear scene after finishing the game
  clearScene() {
    this.enemies.children.getArray().forEach((x) => x.destroy());
    this.coins.children.getArray().forEach((x) => x.destroy());
  }

  //Function that checks if the player has lost all health points or has collected all coins
  checkGameOver() {
    if (this.healthPoints == 0) {
      this.infoText.setText("Press 'Space' to pause");
      const loseText = this.add
        .text(
          this.cameras.main.centerX,
          this.cameras.main.centerY - 80,
          `Game over! Your score: ${this.coinCount}`
        )
        .setOrigin(0.5)
        .setStyle({ fontSize: '48px' });
      this.clearScene();
      this.showRestartButton();
    } else if (this.coins.children.size == 0) {
      this.infoText.setText("Press 'Space' to pause");
      const winText = this.add
        .text(
          this.cameras.main.centerX,
          this.cameras.main.centerY - 80,
          `You won! Your score: ${this.coinCount}`
        )
        .setOrigin(0.5)
        .setStyle({ fontSize: '48px' });
      this.clearScene();
      this.showRestartButton();
    }
    return false;
  }

  preload() {}

  //Create method called at the start of the game
  create() {
    this.square = this.add.rectangle(400, 400, 50, 50, 0xffffff) as any;
    this.coinCount = 0;
    this.healthPoints = 3;
    //Info text to show score and health points
    this.infoText = this.add.text(
      10,
      10,
      `Coin count: ${this.coinCount}, Health: ${this.healthPoints}
Press 'space' to pause`,
      {
        font: '24px Courier',
        color: '#00ff00',
      }
    );

    //Set what to show when game is paused
    this.pauseText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        'Game Paused!',
        { font: '24px Courier' }
      )
      .setOrigin(0.5);
    this.pauseText.setVisible(false);

    //Add player to the scene
    this.physics.add.existing(this.square);

    //Initialize coins and add them to the scene
    this.coins = this.physics.add.group({
      immovable: false,
      bounceX: 1,
      bounceY: 1,
      collideWorldBounds: true,
    });
    this.loadCoins(this.coins);
    this.coins.getChildren().forEach((child) => {
      child.body.velocity.x =
        Phaser.Math.Between(-100, -50) || Phaser.Math.Between(50, 100);
      child.body.velocity.y =
        Phaser.Math.Between(-100, -50) || Phaser.Math.Between(50, 100);
    });

    //Initialize enemies and add them to the scene
    this.enemies = this.physics.add.group({
      immovable: false,
      bounceX: 1,
      bounceY: 1,
      collideWorldBounds: true,
    });
    this.loadEnemies(this.enemies);
    this.enemies.getChildren().forEach((child) => {
      child.body.velocity.x =
        Phaser.Math.Between(-300, -200) || Phaser.Math.Between(200, 300);
      child.body.velocity.y =
        Phaser.Math.Between(-300, -200) || Phaser.Math.Between(200, 300);
    });

    //Set overlap functions
    this.physics.add.overlap(this.square, this.coins, this.collectCoin);
    this.physics.add.overlap(this.square, this.enemies, this.hitEnemy);

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
    this.square.body.setCollideWorldBounds(true);
  }

  //Update function that gets called every frame
  override update() {
    //Create cursorKeys variable to use for controls
    const cursorKeys = this.input.keyboard.createCursorKeys();

    //On pause event show the text
    this.events.on('pause', () => {
      this.pauseText.setVisible(true);
    });

    //On resume event hide the text
    this.events.on('resume', () => {
      console.log('Resumed');
      this.pauseText.setVisible(false);
    });

    //Player controls
    if (cursorKeys.up.isDown) {
      this.square.body.setVelocityY(-500);
    } else if (cursorKeys.down.isDown) {
      this.square.body.setVelocityY(500);
    } else {
      this.square.body.setVelocityY(0);
    }
    if (cursorKeys.right.isDown) {
      this.square.body.setVelocityX(500);
    } else if (cursorKeys.left.isDown) {
      this.square.body.setVelocityX(-500);
    } else {
      this.square.body.setVelocityX(0);
    }
  }
}
