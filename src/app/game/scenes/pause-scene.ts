export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Pause' });
  }

  create() {
    console.log('create method');
    this.input.keyboard.on(
      'keydown',
      (event: any) => {
        if (event.code == 'Space') {
          this.scene.pause();
          this.scene.resume('Game');
        }
      },
      this
    );
  }
  preload() {
    console.log('preload method');
  }
  override update() {}
}
