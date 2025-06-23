import HelloWorldScene from "./scenes/HelloWorldScene.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  pixelArt: true, // <--- ¡Agrega esta línea!
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 640,
      height: 360,
    },
    max: {
      width: 1280, // <-- Cambia aquí
      height: 720, // <-- Cambia aquí
    },
  },
  physics: {
    default: "matter",
    matter: {
      debug: true,
      gravity: { y: 0.22 },
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [HelloWorldScene],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
