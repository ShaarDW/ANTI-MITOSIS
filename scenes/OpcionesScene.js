export default class OpcionesScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OpcionesScene' });
    }
    preload() {
        this.load.image("fondo", "public/assets/FONDO GAME PRUEBA.png");
        this.load.audio("Seleccionar", "public/assets/Audio/Seleccionar.wav");
        this.load.audio("musica_menu", "public/assets/Audio/musica menu.wav");
        this.load.audio("navegar_opciones", "public/assets/Audio/navegar opciones 2.wav");
    }

    create() {
        const centerX = 320;
        const baseY = 50;
        const spacingY = 60;

        // Fondo y título
        this.add.image(centerX, 180, "fondo").setOrigin(0.5, 0.5).setDepth(0);

        this.add.text(centerX, baseY, 'Opciones', { fontSize: '280px', color: '#fff', fontFamily: 'Retro Gaming' }).setOrigin(0.5).setScale(0.1);

 ;
        // Volumen de Música
        this.add.text(centerX - 110, baseY + spacingY, "Música", { fontSize: '200px', color: '#fff', fontFamily: 'Retro Gaming' }).setOrigin(1, 0.5).setScale(0.1);

        this.musicSlider = this.add.rectangle(centerX, baseY + spacingY + 4, 200, 10, 0x888888);
        this.musicHandle = this.add.rectangle(centerX + 100, baseY + spacingY + 4, 24, 24, 0xffffff);

        // Volumen de Sonidos
        this.add.text(centerX - 110, baseY + spacingY * 2, "Sonido", { fontSize: '200px', color: '#fff', fontFamily: 'Retro Gaming' }).setOrigin(1, 0.5).setScale(0.1);

        this.sfxSlider = this.add.rectangle(centerX, baseY + spacingY * 2 + 4, 200, 10, 0x888888);
        this.sfxHandle = this.add.rectangle(centerX + 100, baseY + spacingY * 2 + 4, 24, 24, 0xffffff);
        // Valores iniciales
        this.musicVolume = (this.sys.game.globals.musicVolume !== undefined) ? this.sys.game.globals.musicVolume : 1;
        this.sfxVolume = (this.sys.game.globals.sfxVolume !== undefined) ? this.sys.game.globals.sfxVolume : 1;

        this.updateMusicHandle();
        this.updateSfxHandle();

        // Opciones de menú: 0 = música, 1 = sonidos, 2 = volver
        this.selectedBar = 0;
        const volverY = baseY + spacingY * 2.4 + 30;
        const volverBtn = this.add.text(centerX, volverY, "Volver", {
            fontSize: '280px',
            color: '#fff',
            fontFamily: 'Retro Gaming'
        }).setOrigin(0.5).setScale(0.1);



        // Resalta la barra o el botón seleccionado
        const updateBarHighlight = () => {
            this.musicHandle.setStrokeStyle(this.selectedBar === 0 ? 4 : 0, 0xffff00);
            this.sfxHandle.setStrokeStyle(this.selectedBar === 1 ? 4 : 0, 0xffff00);
            volverBtn.setStyle({ backgroundColor: this.selectedBar === 2 ? '#ffcc00' : '', color: this.selectedBar === 2 ? '#333' : '#fff' });
        };
        updateBarHighlight();

        // Cambiar selección con ARRIBA/ABAJO
        this.input.keyboard.on('keydown-UP', () => {
            this.selectedBar = (this.selectedBar - 1 + 3) % 3;
            updateBarHighlight();
            if (this.sound) {
                this.sound.play("navegar_opciones", { volume: this.sfxVolume });
            }
        });
        this.input.keyboard.on('keydown-DOWN', () => {
            this.selectedBar = (this.selectedBar + 1) % 3;
            updateBarHighlight();
            if (this.sound) {
                this.sound.play("navegar_opciones", { volume: this.sfxVolume });
            }
        });

        // Modificar solo la barra seleccionada con IZQUIERDA/DERECHA
        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.selectedBar === 0) {
                this.musicVolume = Phaser.Math.Clamp(this.musicVolume - 0.1, 0, 1);
                this.updateMusicHandle();
            } else if (this.selectedBar === 1) {
                this.sfxVolume = Phaser.Math.Clamp(this.sfxVolume - 0.1, 0, 1);
                this.updateSfxHandle();
                if (this.sound) {
                    this.sound.play("Seleccionar", { volume: this.sfxVolume });
                }
            }
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.selectedBar === 0) {
                this.musicVolume = Phaser.Math.Clamp(this.musicVolume + 0.1, 0, 1);
                this.updateMusicHandle();
            } else if (this.selectedBar === 1) {
                this.sfxVolume = Phaser.Math.Clamp(this.sfxVolume + 0.1, 0, 1);
                this.updateSfxHandle();
                if (this.sound) {
                    this.sound.play("Seleccionar", { volume: this.sfxVolume });
                }
            }
        });

        // Seleccionar "Volver" with ESPACIO
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.selectedBar === 2) {
                if (this.sound) {
                    this.sound.play("Seleccionar", { volume: this.sfxVolume });
                }
                this.sys.game.globals.musicVolume = this.musicVolume;
                this.sys.game.globals.sfxVolume = this.sfxVolume;
                this.scene.start('MenuPrincipalScene');
            }
        });

        // Música de menú (no la vuelvas a crear si ya existe)
        if (this.sys.game.globals.music) {
            this.sys.game.globals.music.setVolume(this.musicVolume);
        }
    }

    updateMusicHandle() {
        const centerX = 320;
        this.musicHandle.x = centerX - 100 + this.musicVolume * 200;
        if (this.sys.game.globals.music) {
            this.sys.game.globals.music.setVolume(this.musicVolume);
        }
        this.sys.game.globals.musicVolume = this.musicVolume;
    }

    updateSfxHandle() {
        const centerX = 320;
        this.sfxHandle.x = centerX - 100 + this.sfxVolume * 200;
        this.sys.game.globals.sfxVolume = this.sfxVolume;
    }

    updateMusicVolume() {
        this.updateMusicHandle();
    }

    updateSfxVolume() {
        this.updateSfxHandle();
    }
}

