export default class InstruccionesScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InstruccionesScene' });
    }

    preload() {
        this.load.image('flecha_izq', 'public/assets/flecha izquierda.png');
        this.load.image('flecha_der', 'public/assets/flecha derecha.png');
        this.load.image('espacio', 'public/assets/espacio.png');
        this.load.spritesheet("circleSheet", "public/assets/CELULAS-SPRITESHEET.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("virus", "public/assets/virus.png", { frameWidth: 16, frameHeight: 16 });
        this.load.image("powerup_shield", "public/assets/escudo.png");
        this.load.image("powerup_triple", "public/assets/triple disparo.png");
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const marco = this.add.rectangle(
            width / 2,           // centro X
            height / 2,          // centro Y
            width - 32,          // ancho del marco (ajusta el padding a tu gusto)
            height - 82,         // alto del marco
        ).setOrigin(0.5)
          .setStrokeStyle(1.5, 0xffffff); // grosor y color del borde

        //spritesheet celulas
        this.anims.create({
            key: 'celula_anim',
            frames: this.anims.generateFrameNumbers('circleSheet', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1 // Repite indefinidamente
        });

        // Título centrado arriba
        this.add.text(width / 2, 25, '¿Cómo Jugar?', {
            fontSize: '200px',
            fontFamily: 'Retro Gaming',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setScale(0.1);

        // --- COLUMNAS ---
        const col1X = width * 0.25;
        const col2X = width * 0.75;

        // Columna 1: Controles
        this.add.text(col1X, 65, 'Controles:', {
            fontSize: '130px',
            fontFamily: 'Retro Gaming',
            color: '#ffcc00',
            align: 'center'
        }).setOrigin(0.5).setScale(0.1);

        this.add.image(col1X - 80, 115, 'flecha_izq').setScale(0.9);
        this.add.image(col1X + 85,      115, 'espacio').setScale(0.9);
        this.add.image(col1X - 40, 115, 'flecha_der').setScale(0.9);

        this.add.text(col1X +13 ,139, 'Moverse         Disparar', {
            fontSize: '110px',
            fontFamily: 'Retro Gaming',
            color: '#dddddd',
            align: 'left'
        }).setOrigin(0.5).setScale(0.1);

        // Columna 2: Células y Power-ups
        this.add.text(col1X, 175, 'Enemigos:', {
            fontSize: '130px',
            fontFamily: 'Retro Gaming',
            color: '#ff6666',
            align: 'center'
        }).setOrigin(0.5).setScale(0.1);

        this.add.text(col1X, 295, 'Mientras más pequeño sea el enemigo \neliminado, más puntos obtendrás.', {
            fontSize: '100px',
            fontFamily: 'Retro Gaming',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setScale(0.1);

        const cellY = 235;
        const celulaGrande = this.add.sprite(col1X - 70, cellY, 'circleSheet', 0).setScale(2.5);
        celulaGrande.play('celula_anim');
        const celulaMediana = this.add.sprite(col1X, cellY, 'circleSheet', 0).setScale(1.25);
        celulaMediana.play('celula_anim');
        const celulaPequena = this.add.sprite(col1X + 40, cellY, 'circleSheet', 0).setScale(0.75);
        celulaPequena.play('celula_anim');

        // Si quieres que el virus también esté animado y tienes la animación:
        if (!this.anims.exists('virusAnim')) {
            this.anims.create({
                key: 'virusAnim',
                frames: this.anims.generateFrameNumbers('virus', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }
        const virus = this.add.sprite(col1X + 80, cellY, 'virus', 0).setScale(1);
        virus.play('virusAnim');

        // Power-ups
        this.add.text(col2X, 65, 'Power-ups:', {
            fontSize: '130px',
            fontFamily: 'Retro Gaming',
            color: '#00ffff',
            align: 'center'
        }).setOrigin(0.5).setScale(0.1);

        this.add.image(col2X - 30, 105, 'powerup_shield').setScale(1);
        this.add.text(col2X - 10, 105, 'Escudo', {
            fontSize: '100px',
            fontFamily: 'Retro Gaming',
            color: '#ffffff'
        }).setOrigin(0, 0.5).setScale(0.1);

        this.add.image(col2X - 30, 135, 'powerup_triple').setScale(1);
        this.add.text(col2X - 10, 135, 'Triple disparo', {
            fontSize: '100px',
            fontFamily: 'Retro Gaming',
            color: '#ffffff'
        }).setOrigin(0, 0.5).setScale(0.1);

        this.add.text(col2X, 175, 'Objetivo:', {
            fontSize: '130px',
            fontFamily: 'Retro Gaming',
            color: '#66ff66',
            align: 'center'
        }).setOrigin(0.5).setScale(0.1);

        this.add.text(col2X, 230, '- Esquiva enemigos \ny elimínalos. \n\n - Logra la mayor cantidad\n de puntos', {
            fontSize: '100px',
            fontFamily: 'Retro Gaming',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setScale(0.1);

        // Instrucción final centrada abajo
        this.add.text(width - 150, height - 28, 'Presiona ESPACIO para jugar', {
            fontSize: '140px',
            fontFamily: 'Retro Gaming',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setScale(0.1);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameplayScene');
        });
    }
}