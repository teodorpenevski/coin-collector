import { MainScene } from './scenes/main-scene';

export class GameState {
  private _square!: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  public get square(): Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  } {
    return this._square;
  }
  public set square(
    value: Phaser.GameObjects.Rectangle & {
      body: Phaser.Physics.Arcade.Body;
    }
  ) {
    this._square = value;
  }
  private _coins!: Phaser.Physics.Arcade.Group;
  public get coins(): Phaser.Physics.Arcade.Group {
    return this._coins;
  }
  public set coins(value: Phaser.Physics.Arcade.Group) {
    this._coins = value;
  }
  private _coinCount!: number;
  public get coinCount(): number {
    return this._coinCount;
  }
  public set coinCount(value: number) {
    this._coinCount = value;
  }
  private _enemies!: Phaser.Physics.Arcade.Group;
  public get enemies(): Phaser.Physics.Arcade.Group {
    return this._enemies;
  }
  public set enemies(value: Phaser.Physics.Arcade.Group) {
    this._enemies = value;
  }
  private _healthPoints!: number;
  public get healthPoints(): number {
    return this._healthPoints;
  }
  public set healthPoints(value: number) {
    this._healthPoints = value;
  }
  private _pauseText!: Phaser.GameObjects.Text;
  public get pauseText(): Phaser.GameObjects.Text {
    return this._pauseText;
  }
  public set pauseText(value: Phaser.GameObjects.Text) {
    this._pauseText = value;
  }
  private _infoText!: Phaser.GameObjects.Text;
  public get infoText(): Phaser.GameObjects.Text {
    return this._infoText;
  }
  public set infoText(value: Phaser.GameObjects.Text) {
    this._infoText = value;
  }

  public increaseScore() {
    this._coinCount++;
  }

  public decreaseHealth() {
    this._healthPoints--;
  }

  //Helper function to update the info text when changing states
  updateInfoText() {
    this.infoText
      .setText(`Coin count: ${this.coinCount}, Health: ${this.healthPoints}
Press 'Space' to pause`);
  }

  //Function that shows the restart button at the end of the game
  showRestartButton(scene: Phaser.Scene) {
    let button = scene.add
      .text(scene.cameras.main.centerX, scene.cameras.main.centerY, 'Restart')
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({ backgroundColor: '#111', fontSize: '48px' })
      .setInteractive({ useHandCursor: true })
      .on(
        'pointerdown',
        () => {
          scene.scene.restart();
        },
        this
      )
      .on('pointerover', () => button.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => button.setStyle({ fill: '#FFF' }));
    return button;
  }

  //Function that checks if the player has lost all health points or has collected all coins
  checkGameOver(scene: any) {
    if (this.healthPoints == 0) {
      this.infoText.setText("Press 'Space' to pause");
      const loseText = scene.add
        .text(
          scene.cameras.main.centerX,
          scene.cameras.main.centerY - 80,
          `Game over! Your score: ${this.coinCount}`
        )
        .setOrigin(0.5)
        .setStyle({ fontSize: '48px' });
      this.clearScene();
      this.showRestartButton(scene);
    } else if (this.coins.children.size == 0) {
      this.infoText.setText("Press 'Space' to pause");
      const winText = scene.add
        .text(
          scene.cameras.main.centerX,
          scene.cameras.main.centerY - 80,
          `You won! Your score: ${this.coinCount}`
        )
        .setOrigin(0.5)
        .setStyle({ fontSize: '48px' });
      this.clearScene();
      this.showRestartButton(scene);
    }
    return false;
  }

  //Helper function to clear scene after finishing the game
  clearScene() {
    this.enemies.children.getArray().forEach((x) => x.destroy());
    this.coins.children.getArray().forEach((x) => x.destroy());
  }

  moveUp() {
    this.square.body.setVelocityY(-500);
  }

  moveDown() {
    this.square.body.setVelocityY(500);
  }

  resetMovementY() {
    this.square.body.setVelocityY(0);
  }

  moveRight() {
    this.square.body.setVelocityX(500);
  }

  moveLeft() {
    this.square.body.setVelocityX(-500);
  }

  resetMovementX() {
    this.square.body.setVelocityX(0);
  }
}
