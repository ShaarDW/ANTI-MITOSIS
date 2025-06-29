import MenuPrincipalScene from "./scenes/MenuPrincipalScene.js";
import OpcionesScene from "./scenes/OpcionesScene.js";
import InstruccionesScene from "./scenes/Instrucciones.js";
import HelloWorldScene from "./scenes/GameplayScene.js";
import FinalScene from "./scenes/FinalScene.js";


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
      width: 1920, // <-- Cambia aquí
      height: 1080, // <-- Cambia aquí
    },
  },
  physics: {
    default: "matter",
    matter: {
      debug: false,
      gravity: { y: 0.22 },
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [MenuPrincipalScene, OpcionesScene, InstruccionesScene, HelloWorldScene, FinalScene],
  // Add the scene to the list of scenes
};

// Create a new Phaser game instance
const game = new Phaser.Game(config);
game.globals = {
    musicVolume: 0.6, // o el valor por defecto que prefieras
    sfxVolume: 0.6
};
