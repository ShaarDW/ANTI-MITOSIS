export default class FinalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FinalScene' });
    }

    init(data) {
        // Recibe la puntuación final desde la escena gameplay
        this.finalScore = data.score || 0;
        
    }
    preload() {
        this.load.image("fondo game", "public/assets/FONDO GAME PRUEBA.png");
        this.load.audio("navegar_abajo", "public/assets/navegar opciones 2.wav");
        this.load.audio("contador_puntos", "public/assets/contador puntos.mp3");
        this.load.audio("fin_contador", "public/assets/cuando salen los numeritos.wav");
    }

    create() {
        const { width, height } = this.scale;

        // Imagen de fondo
        this.add.image(width / 2, height / 2, "fondo game").setOrigin(0.5);

        this.add.text(
            width / 2,
            height / 2 - 50,
            '¡Juego Terminado!',
            { fontSize: '48px', color: '#fff' , fontFamily: 'Retro Gaming' }
        ).setOrigin(0.5).setDepth(100);

        this.displayedScore = 0;
        const scoreText = this.add.text(
            width / 2,
            height / 2 + 10,
            `Puntuación final: 0`,
            { fontSize: '32px', color: '#fff', fontFamily: 'Retro Gaming' }
        ).setOrigin(0.5).setDepth(100);

        // Reproduce el sonido del contador de puntos solo si el score es mayor a 0
        if (this.sound && this.finalScore > 0) {
            this.sound.play("contador_puntos", { loop: true, volume: 0.3 * this.sys.game.globals.sfxVolume });
        }

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
            { text: 'Volver al menú principal', scene: 'MenuPrincipalScene' },
            { text: 'Jugar otra partida', scene: 'GameplayScene' }
        ];
        let selected = 0;
        const optionTexts = opciones.map((op, i) =>
            this.add.text(width / 2, height / 2 + 70 + i * 40, op.text, {
                fontSize: '20px',
                color: i === 0 ? '#ffcc00' : '#fff',
                fontFamily: 'Retro Gaming'
            }).setOrigin(0.5).setDepth(100)
        );

        const updateSelection = () => {
            optionTexts.forEach((txt, i) =>
                txt.setColor(i === selected ? '#ffcc00' : '#fff')
            );
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
    }
}