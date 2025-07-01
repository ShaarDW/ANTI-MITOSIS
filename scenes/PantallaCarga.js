export default class PantallaCarga extends Phaser.Scene {
    constructor() {
        super({ key: 'PantallaCarga' });
    }

    preload() {
        this.load.spritesheet("celula", "public/assets/CELULAS-SPRITESHEET.png", { frameWidth: 32, frameHeight: 32 });

        //-------------------------Barra de carga-------------------------
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 + 50, 300 * value, 30);
        });
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 + 40, 320, 50);
         this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
        });
        //------------------------------------------------------------------------
         // Texto "Cargando..."
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 140, 'Cargando...', {
            font: '32px Arial',
            fill: '#ffffff',
            fontFamily: 'Retro Gaming',
        }).setOrigin(0.5);

       
        // ---------------------------Carga de todos los recursos---------------------
        this.load.image("fondo", "public/assets/FONDO GAME PRUEBA.png");
        this.load.audio("navegar_abajo", "public/assets/Audio/navegar opciones 2.wav");
        this.load.audio("seleccionar", "public/assets/Audio/Seleccionar.wav");
        this.load.audio("musica_menu", "public/assets/Audio/musica menu.ogg");
        this.load.image("logo", "public/assets/logo.png");
        this.load.spritesheet("agente", "public/assets/agente.png", { frameWidth: 48, frameHeight: 48 });
        this.load.image("laser", "public/assets/laser.png");
        this.load.spritesheet("agente_shoot", "public/assets/agente disparo.png", { frameWidth: 48, frameHeight: 48 });
        this.load.image("pared_derecha", "public/assets/pared derecha.png");
        this.load.audio("Seleccionar", "public/assets/Audio/Seleccionar.wav");
        this.load.audio("navegar_opciones", "public/assets/Audio/navegar opciones 2.wav");
        this.load.image('flecha_izq', 'public/assets/flecha izquierda.png');
        this.load.image('flecha_der', 'public/assets/flecha derecha.png');
        this.load.image('espacio', 'public/assets/espacio.png');
        this.load.spritesheet("virus", "public/assets/virus.png", { frameWidth: 16, frameHeight: 16 });
        this.load.image("powerup_shield", "public/assets/escudo.png");
        this.load.image("powerup_triple", "public/assets/triple disparo.png");

        this.load.spritesheet("virus muerte", "public/assets/virus muerte.png", {
      frameWidth: 16, 
      frameHeight: 16
    });
       this.load.spritesheet("celula muerte", "public/assets/muerte celula.png", {
      frameWidth: 32, 
      frameHeight: 32
    });
      this.load.spritesheet("500", "public/assets/500.png", {
      frameWidth: 21, 
      frameHeight: 21
    });
       this.load.spritesheet("2000", "public/assets/2000.png", {
      frameWidth: 21, 
      frameHeight: 21
    });
       this.load.spritesheet("500", "public/assets/500.png", {
      frameWidth: 21, 
      frameHeight: 21
    });
       this.load.spritesheet("celula jijeo", "public/assets/celula jijeo.png", {
      frameWidth: 32, 
      frameHeight: 34
    });
       this.load.spritesheet("virus jijeo", "public/assets/virus jijeo.png", {
      frameWidth: 16, 
      frameHeight: 17
    });
    this.load.audio("laser_shoot", "public/assets/Audio/Laser_Shoot.wav");
    this.load.audio("muerte_celula", "public/assets/Audio/muerte celula.wav");
    this.load.audio("muerte_virus", "public/assets/Audio/muerte virus.wav");
    this.load.audio("hit_agente", "public/assets/Audio/Hit_agente.wav");
    this.load.audio("Pickup_Powerup", "public/assets/Audio/Pickup_Coin2.wav");
    this.load.audio("muerte agente", "public/assets/Audio/muerte agente.wav");
    this.load.audio("musica_gameplay_1", "public/assets/Audio/musica gameplay 1.ogg");
    this.load.audio("musica_gameplay_2", "public/assets/Audio/musica gameplay 2.ogg");
    this.load.audio("risa_celula", "public/assets/Audio/risas.wav");
    this.load.audio("contador_puntos", "public/assets/Audio/contador puntos.mp3");
    this.load.audio("fin_contador", "public/assets/Audio/cuando salen los numeritos.wav");
    //------------------------------------------------------------------------------------------
    }

    create() {
    }
    update(time, delta) {
        // Cuando termine la carga, pasa a la siguiente escena
        if (this.load.totalComplete === this.load.totalToLoad) {
            this.scene.start('MenuPrincipalScene');
        }
    }
}