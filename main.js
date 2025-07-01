import PantallaCarga from "./scenes/PantallaCarga.js";  
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
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 640,
      height: 360,
    },
    max: {
      width: 1920,
      height: 1080,
    },
  },
  physics: {
    default: "matter",
    matter: {
      debug: false,
      gravity: { y: 0.22 },
    },
  },
  scene: [PantallaCarga, MenuPrincipalScene, OpcionesScene, InstruccionesScene, HelloWorldScene, FinalScene],
};

const game = new Phaser.Game(config);
game.globals = {
    musicVolume: 0.3,
    sfxVolume: 0.3
};
