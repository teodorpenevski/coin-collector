import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { MainScene } from './scenes/main-scene';
import { PauseScene } from './scenes/pause-scene';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})

export class GameComponent implements OnInit {
  phaserGame!: Phaser.Game;
  constructor() {
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(gameConfig);
  }
}
export const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Test Game',
  type: Phaser.AUTO,
  width: window.innerWidth - 200,
  height: window.innerHeight - 200,
  scene: [MainScene, PauseScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  parent: 'game',
  backgroundColor: '#000000',
};




