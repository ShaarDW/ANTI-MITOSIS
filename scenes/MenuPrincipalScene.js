export default class MenuPrincipalScene extends Phaser.Scene {
    static instruccionesMostrada = false; // <-- Agrega esto

    constructor() {
        super({ key: 'MenuPrincipalScene' });
    }
    init() {
        // resetea la celula 
        this.menuBubbles = [];
        if (this._menuUpdateEvent) {
            this.events.off('update', this._menuUpdateEvent);
            this._menuUpdateEvent = null;
        }
        if (this.agente) {
            this.agente.destroy();
            this.agente = null;
        }
        if (this.cell) {
            this.cell.destroy();
            this.cell = null;
        }
    }
    preload() {
        this.load.image("fondo", "public/assets/FONDO GAME PRUEBA.png");
        this.load.audio("navegar_abajo", "public/assets/Audio/navegar opciones 2.wav");
        this.load.audio("seleccionar", "public/assets/Audio/Seleccionar.wav");
        this.load.audio("musica_menu", "public/assets/Audio/musica menu.ogg");
        this.load.image("logo", "public/assets/logo.png");
        this.load.spritesheet("agente", "public/assets/agente.png", { frameWidth: 48, frameHeight: 48 });
        this.load.image("laser", "public/assets/laser.png");
        this.load.spritesheet("celula", "public/assets/CELULAS-SPRITESHEET.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("agente_shoot", "public/assets/agente disparo.png", { frameWidth: 48, frameHeight: 48 });
        this.load.image("pared_derecha", "public/assets/pared derecha.png");
    }
    create() {
        const { width, height } = this.scale;
        // Reproduce la música del menú
        if (this.sound) {
            if (!this.sys.game.globals.music) {
                this.sys.game.globals.music = this.sound.add("musica_menu", {
                    loop: true,
                    volume: this.sys.game.globals.musicVolume * 1.3
                });
                this.sys.game.globals.music.play();
            } else if (!this.sys.game.globals.music.isPlaying) {
                this.sys.game.globals.music.play();
            }
        }
        //logo
        this.add.image(width / 2, height * 0.32, "logo").setOrigin(0.5).setScale(1.1).setDepth(20);
        // Fondo
        this.add.image(320, 180, "fondo").setOrigin(0.5, 0.5).setDepth(1);
        // texto unraf
        this.add.text(65, 335, 'UNRaf  ', {
            fontSize: '170px',
            color: '#fff',
            fontFamily: 'Retro Gaming'
        }).setOrigin(0.5).setScale(0.1).setDepth(12);
        // texto alfaro
        this.add.text(585, 335, "Alfaro", {
            fontSize: '170px',
            color: '#fff',
            fontFamily: 'Retro Gaming'
        }).setOrigin(0.5).setScale(0.1).setDepth(12);
        const menuOptions = [
            { text: 'Jugar', scene: 'InstruccionesScene' },
            { text: 'Opciones', scene: 'OpcionesScene' },
        ];
        const startY = height * 0.70;
        const optionSpacingX = 180;
        this.menuTexts = [];
        this.selectedOption = 0;
        // Opciones de menú
        menuOptions.forEach((option, i) => {
            const menuText = this.add.text(
                width / 2 + (i - (menuOptions.length - 1) / 2) * optionSpacingX,
                startY,
                option.text,
                {
                    fontFamily: 'Retro Gaming',
                    fontSize: '240px',
                    color: i === 0 ? '#ffcc00' : '#ffffff'
                }
            ).setOrigin(0.5).setScale(0.1).setDepth(20);
            this.menuTexts.push(menuText);
        });
        this.setSelectedOption(this.selectedOption);
        this.input.keyboard.on('keydown-UP',  () => {
            const prev = this.selectedOption;
            this.setSelectedOption((this.selectedOption - 1 + menuOptions.length) % menuOptions.length, 'up');
        });
        this.input.keyboard.on('keydown-LEFT',  () => {
            const prev = this.selectedOption;
            this.setSelectedOption((this.selectedOption - 1 + menuOptions.length) % menuOptions.length, 'up');
        });
        this.input.keyboard.on('keydown-DOWN', () => {
            const prev = this.selectedOption;
            this.setSelectedOption((this.selectedOption + 1) % menuOptions.length, 'down');
        });
        this.input.keyboard.on('keydown-RIGHT', () => {
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
                    if (
                        menuOptions[this.selectedOption].scene === 'InstruccionesScene' ||
                        menuOptions[this.selectedOption].scene === 'GameplayScene'
                    ) {
                        if (this.sys.game.globals.music) {
                            this.sys.game.globals.music.stop();
                        }
                    }
                    if (
                        menuOptions[this.selectedOption].scene === 'InstruccionesScene' &&
                        !MenuPrincipalScene.instruccionesMostrada
                    ) {
                        // las instrucciones se muestran solo una vez
                        MenuPrincipalScene.instruccionesMostrada = true;
                        this.scene.start('InstruccionesScene');
                    } else if (menuOptions[this.selectedOption].scene === 'InstruccionesScene') {
                        this.scene.start('GameplayScene');
                    } else {
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


        // Variables para el movimiento de las celulas del menú
        const gravity = 0.18;
        const bounds = { left: 40, right: width - 40, floor: height * 0.85 };

        // --- Animación de introducción ---
        const logoCellX = width / 2;
        const logoCellY = height * 0.27 + 60;

        //crear la animación de la célula
        if (!this.anims.exists('circleAnim')) {
            this.anims.create({
                key: 'circleAnim',
                frames: this.anims.generateFrameNumbers('celula', { start: 0, end: 3 }),
                frameRate: 6,
                repeat: -1
            });
        }
        const cell = this.add.sprite(logoCellX, logoCellY, "celula", 0).setScale(2).setDepth(2);
        cell.play('circleAnim');
        if (!this.anims.exists('agente_walk')) {
            this.anims.create({
                key: 'agente_walk',
                frames: this.anims.generateFrameNumbers('agente', { start: 0, end: 2 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!this.anims.exists('agente_idle')) {
            this.anims.create({
                key: 'agente_idle',
                frames: [{ key: 'agente', frame: 3 }],
                frameRate: 1,
                repeat: -1
            });
        }
        if (!this.anims.exists('agente_shoot')) {
            this.anims.create({
                key: 'agente_shoot',
                frames: this.anims.generateFrameNumbers('agente_shoot', { start: 0, end: 15 }),
                frameRate: 50,
                repeat: 0
            });
        }
        
        const agente = this.add.sprite(36, logoCellY + 129, "agente", 0).setScale(-0.75, 0.75).setDepth(5);
        agente.play('agente_walk');
        agente.setDepth(5);
        this.tweens.add({
            targets: agente,
            x: logoCellX,
            duration: 7000,
            ease: "Power2",
            onComplete: () => {
                agente.play('agente_idle');
                this.time.delayedCall(400, () => {
                    agente.setTexture('agente_shoot');
                    agente.play('agente_shoot');
                    agente.once('animationcomplete-agente_shoot', () => {
                        agente.setTexture('agente');
                        agente.play('agente_walk');
                        agente.setScale(-0.75, 0.75);
                        this.tweens.add({
                            targets: agente,
                            x: width + 40,
                            duration: 7000,
                            ease: "Power2",
                            onComplete: () => {
                                agente.destroy();
                            }
                        });
                    });
                    const laser = this.add.image(agente.x, agente.y - 24, "laser").setScale(0.3).setDepth(2);
                    this.tweens.add({
                        targets: laser,
                        y: logoCellY,
                        duration: 250,
                        onComplete: () => {
                            laser.destroy();
                            cell.destroy();
                            // crear dos células pequeñas animadas
                            const cellLeft = this.add.sprite(logoCellX - 30, logoCellY, "celula", 0).setScale(1).setDepth(10);
                            const cellRight = this.add.sprite(logoCellX + 30, logoCellY, "celula", 0).setScale(1).setDepth(10);
                            cellLeft.play('circleAnim');
                            cellRight.play('circleAnim');
                            const velocity = [
                                { vx: -2, vy: -5.2 },
                                { vx: 2, vy: -5 } 
                            ];
                            this.menuBubbles = [
                                { sprite: cellLeft, vx: velocity[0].vx, vy: velocity[0].vy },
                                { sprite: cellRight, vx: velocity[1].vx, vy: velocity[1].vy }
                            ];
                        }
                    });
                });
            }
        });
        this.menuBubbles = this.menuBubbles || [];
        this._menuUpdateEvent = () => {
            this.menuBubbles.forEach(bubble => {
                if (!bubble.sprite.active) return;
                bubble.sprite.x += bubble.vx;
                bubble.sprite.y += bubble.vy;
                bubble.vy += gravity;
                if (bubble.sprite.y > logoCellY + 118) {
                    bubble.sprite.y = logoCellY + 118;
                    bubble.vy *= -0.97;
                    if (Math.abs(bubble.vy) < 1) bubble.vy = 0;
                }
                if (bubble.sprite.x < bounds.left) {
                    bubble.sprite.x = bounds.left;
                    bubble.vx *= -1;
                }
                if (bubble.sprite.x > bounds.right) {
                    bubble.sprite.x = bounds.right;
                    bubble.vx *= -1;
                }
            });
        };
        this.events.on('update', this._menuUpdateEvent);
        // Spawnea otra célula animada en el lugar del logo después de 12 segundos
        this.time.delayedCall(12000, () => {
            const newCell = this.add.sprite(logoCellX, logoCellY, "celula", 0)
                .setScale(2)
                .setDepth(20)
                .setAlpha(0);
            newCell.play('circleAnim');
            this.tweens.add({
                targets: newCell,
                alpha: 1,
                duration: 1200,
                ease: 'Linear'
            });
        });
        this.events.once('shutdown', () => {
            if (this._menuUpdateEvent) {
                this.events.off('update', this._menuUpdateEvent);
                this._menuUpdateEvent = null;
            }
        });
        // sprite de la pared derecha para que el tween del agente no se vea raro
        const paredDerecha = this.add.sprite(
            320, 180,        // Ajusta Y para que coincida con el fondo
            "pared_derecha" // El key que usaste en preload
        ).setOrigin(0.5, 0.5).setDepth(10); // Depth mayor que el agente
    }
    setSelectedOption(index, direction) {
        if (this.selectedOption !== index && this.sound) {
            this.sound.play("navegar_abajo", { rate: 0.8, volume: this.sys.game.globals.sfxVolume });
        }
        this.selectedOption = index;
        this.menuTexts.forEach((text, i) => {
            text.setStyle({ color: i === index ? '#ffcc00' : '#ffffff' });
            text.setScale(i === index ? 0.14 : 0.1);
        });
    }
}