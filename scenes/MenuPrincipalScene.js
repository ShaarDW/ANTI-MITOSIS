export default class MenuPrincipalScene extends Phaser.Scene {
    static instruccionesMostrada = false; // <-- Agrega esto

    constructor() {
        super({ key: 'MenuPrincipalScene' });
    }

    preload() {
        this.load.image("fondo", "public/assets/FONDO GAME PRUEBA.png");
        this.load.audio("navegar_arriba", "public/assets/navegar opciones.wav");
        this.load.audio("navegar_abajo", "public/assets/navegar opciones 2.wav");
        this.load.audio("seleccionar", "public/assets/Seleccionar.wav");
        this.load.audio("musica_menu", "public/assets/musica menu.mp3");
    }

    create() {
        const { width, height } = this.scale;

        // Reproduce la música del menú
        if (this.sound) {
            if (!this.sys.game.globals.music) {
                this.sys.game.globals.music = this.sound.add("musica_menu", {
                    loop: true,
                    volume: this.sys.game.globals.musicVolume
                });
                this.sys.game.globals.music.play();
            } else if (!this.sys.game.globals.music.isPlaying) {
                this.sys.game.globals.music.play();
            }
        }
        

        // Fondo
        this.add.image(320, 180, "fondo").setOrigin(0.5, 0.5).setDepth(0);

        const menuOptions = [
            { text: 'Jugar', scene: 'InstruccionesScene' }, // Cambia aquí
            { text: 'Opciones', scene: 'OpcionesScene' },
        ];

        const startY = height * 0.6;
        const optionSpacing = 40;

        this.menuTexts = [];
        this.selectedOption = 0;

        menuOptions.forEach((option, i) => {
            const menuText = this.add.text(width / 2, startY + i * optionSpacing, option.text, {
                fontFamily: 'Retro Gaming',
                fontSize: '20px',
                color: i === 0 ? '#ffcc00' : '#ffffff'
            }).setOrigin(0.5);

            // No setInteractive, solo teclado
            this.menuTexts.push(menuText);
        });

        this.input.keyboard.on('keydown-UP', () => {
            const prev = this.selectedOption;
            this.setSelectedOption((this.selectedOption - 1 + menuOptions.length) % menuOptions.length, 'up');
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            const prev = this.selectedOption;
            this.setSelectedOption((this.selectedOption + 1) % menuOptions.length, 'down');
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.sound) {
                this.sound.play("seleccionar", { volume: this.sys.game.globals.sfxVolume });
            }
            const selectedText = this.menuTexts[this.selectedOption];
            this.tweens.add({
                targets: selectedText,
                alpha: 0,
                yoyo: true,
                repeat: 4,
                duration: 100,
                onComplete: () => {
                    // Si se selecciona "Jugar", detén la música
                    if (
                        menuOptions[this.selectedOption].scene === 'InstruccionesScene' ||
                        menuOptions[this.selectedOption].scene === 'GameplayScene'
                    ) {
                        if (this.sys.game.globals.music) {
                            this.sys.game.globals.music.stop();
                        }
                    }
                    // Solo muestra instrucciones la primera vez
                    if (
                        menuOptions[this.selectedOption].scene === 'InstruccionesScene' &&
                        !MenuPrincipalScene.instruccionesMostrada
                    ) {
                        MenuPrincipalScene.instruccionesMostrada = true;
                        this.scene.start('InstruccionesScene');
                    } else if (menuOptions[this.selectedOption].scene === 'InstruccionesScene') {
                        // Si ya se mostró, salta directo a GameplayScene
                        this.scene.start('GameplayScene');
                    } else {
                        // Justo antes de this.scene.start('OpcionesScene');
                        if (this.sys.game.globals.music) {
                            this.sys.game.globals.musicTime = this.sys.game.globals.music.seek;
                        }
                        this.scene.start(menuOptions[this.selectedOption].scene);
                    }
                }
            });
        });

        // Evita el scroll de la página con las flechas cuando el canvas de Phaser está activo
        window.addEventListener('keydown', function(e) {
            // Solo si la tecla es flecha arriba o abajo
            if (["ArrowUp", "ArrowDown", " "].includes(e.key)) {
                e.preventDefault();
            }
        }, false);
    }

    setSelectedOption(index, direction) {
        if (this.selectedOption !== index && this.sound) {
            this.sound.play("navegar_abajo", { rate: 0.8, volume: this.sys.game.globals.sfxVolume });
        }
        this.selectedOption = index;
        this.menuTexts.forEach((text, i) => {
            text.setStyle({ color: i === index ? '#ffcc00' : '#ffffff' });
        });
    }
}