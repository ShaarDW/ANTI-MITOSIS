export default class FinalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FinalScene' });
    }

    init(data) {
        // recibir la puntuacion final desde la escena gameplay
        this.finalScore = data.score || 0; 
    }
    preload() {
        this.load.image("fondo game", "public/assets/Audio/FONDO GAME PRUEBA.png");
        this.load.audio("navegar_abajo", "public/assets/Audio/navegar opciones 2.wav");
        this.load.audio("contador_puntos", "public/assets/Audio/contador puntos.mp3");
        this.load.audio("fin_contador", "public/assets/Audio/cuando salen los numeritos.wav");
    }

    create() {
        const { width, height } = this.scale;
        // fondo
        this.add.image(width / 2, height / 2, "fondo game").setOrigin(0.5);
        // texto juego terminado y puntaje final
        this.add.text(
            width / 2,
            height / 2 - 50,
            '¡Juego Terminado!',
            { fontSize: '420px', color: '#fff' , fontFamily: 'Retro Gaming' }
        ).setOrigin(0.5).setDepth(100).setScale(0.1);
        this.displayedScore = 0;
        const scoreText = this.add.text(
            width / 2,
            height / 2 - 10,
            `Puntuación final: 0`,
            { fontSize: '280px', color: '#fff', fontFamily: 'Retro Gaming' }
        ).setOrigin(0.5).setDepth(100).setScale(0.1);
        // si el score final es 0, no reproducir el contador de puntos
        if (this.sound && this.finalScore > 0) {
            this.sound.play("contador_puntos", { loop: true, volume: 0.3 * this.sys.game.globals.sfxVolume });
        }
        // tween para animar el contador de puntos
        this.tweens.addCounter({
            from: 0,
            to: this.finalScore,
            duration: 2000,
            onUpdate: tween => {
                this.displayedScore = Math.floor(tween.getValue());
                scoreText.setText(`Puntuación final: ${this.displayedScore}`);
            },
            onComplete: () => {
                scoreText.setText(`Puntuación final: ${this.finalScore}`);
                // Solo detiene/reproduce sonido si el score es mayor a 0
                if (this.sound && this.finalScore > 0) {
                    this.sound.stopByKey("contador_puntos");
                    this.sound.play("fin_contador", { volume: this.sys.game.globals.sfxVolume });
                }
            }
        });
        // Opciones de menú
        const opciones = [
            { text: 'Jugar de nuevo', scene: 'GameplayScene' },
            { text: 'Volver al menú', scene: 'MenuPrincipalScene' }
        ];
        let selected = 0;
        const optionTexts = opciones.map((op, i) =>
            this.add.text(width / 2, height / 2 + 50 + i * 40, op.text, {
                fontSize: '200px',
                color: i === 0 ? '#ffcc00' : '#fff',
                fontFamily: 'Retro Gaming'
            }).setOrigin(0.5).setDepth(100).setScale(0.1)
        );
        const updateSelection = () => {
            optionTexts.forEach((txt, i) => {
                txt.setColor(i === selected ? '#ffcc00' : '#fff');
                txt.setScale(i === selected ? 0.14 : 0.1);
            });
        };
        this.input.keyboard.on('keydown-UP', () => {
            if (this.sound) this.sound.play("navegar_abajo", { rate: 0.8, volume: this.sys.game.globals.sfxVolume });
            selected = (selected - 1 + opciones.length) % opciones.length;
            updateSelection();
        });
        this.input.keyboard.on('keydown-DOWN', () => {
            if (this.sound) this.sound.play("navegar_abajo", { rate: 0.8, volume: this.sys.game.globals.sfxVolume });
            selected = (selected + 1) % opciones.length;
            updateSelection();
        });
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.sound) this.sound.stopByKey("contador_puntos");
            if (opciones[selected].scene === 'MenuPrincipalScene') {
                this.scene.stop('GameplayScene');
                this.scene.stop();
                this.scene.start('MenuPrincipalScene');
            } else {
                this.scene.stop('GameplayScene');
                this.scene.stop();
                this.scene.start('GameplayScene');
            }
        });
        updateSelection();
    }
}