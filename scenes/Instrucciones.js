export default class InstruccionesScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InstruccionesScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.text(width / 2, 60, '¿Cómo Jugar?', {
            font: '22px Retro Gaming', // Asegúrate de que 'Retro Gaming' esté cargada en preload
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        const instrucciones = `
- Usa las FLECHAS para mover el personaje.
- Usa el ESPACIO para disparar.
- Esquiva las células enemigas.
- Recoge power-ups para ganar habilidades especiales temporales.
- Elimina células para ganar puntos. Mientras más pequeñas sean, más puntos obtendrás.
- Tu objetivo es sobrevivir el mayor tiempo posible y acumular la mayor cantidad de puntos.


Presiona ESPACIO para jugar.
        `;

        this.add.text(width / 2, height / 2, instrucciones, {
            font: '14px Retro Gaming', // Asegúrate de que 'Retro Gaming' esté cargada en preload
            fill: '#dddddd',
            align: 'left',
            wordWrap: { width: width - 100 }
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameplayScene'); // Cambia 'Menu' por el nombre de tu escena de menú principal
        });
    }
}