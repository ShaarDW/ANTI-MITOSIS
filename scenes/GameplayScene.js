// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class GameplayScene extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("GameplayScene");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
    this.score = 0; // Inicializa el score aquí
    this.invulnerable = false; // Para evitar perder varias vidas en un solo frame
    this.lives = 3; // Inicializa las vidas
    this.maxLives = 3;
    this.astronauta = null; // El personaje jugable
    this.circles = []; // Array para las burbujas
    this.lasers = []; // Array para los láseres
    this.viruses = [];
    this.powerUps = []; // Array para los power-ups
    this.lifeSprites = [];
    this.hasShield = false; // Para el power-up de escudo
    this.tripleShot = false; // Para el power-up de triple disparo
    this.bubbleSpeedMultiplier = 1; // Para aumentar la velocidad de las burbujas
    this.isShooting = false; // Para controlar el estado de disparo
    this.laserCooldown = 0; // Tiempo en milisegundos hasta el próximo disparo permitido
    this.laserDelay = 500; // Delay entre disparos en ms (ajusta a tu gusto)
    this.spawnDelay = 9000; // 9 segundos en ms
    this.gameOverTriggered = false;
    this.activePowerUpIcon = null;
    this.fadeRect = null;
    this.input.keyboard.enabled = true
  }

  preload() {
    // load assets
    //this.load.image("circulo", "public/assets/CELULAS SPRITESHEET.png");
    this.load.image("laser", "public/assets/laser.png");
    this.load.image("fondo game", "public/assets/FONDO GAME PRUEBA.png")
    this.load.spritesheet("circleSheet", "public/assets/CELULAS-SPRITESHEET.png", {
        frameWidth: 32, // ajusta al tamaño de tu frame
        frameHeight: 32
    });
    this.load.spritesheet("agente", "public/assets/agente.png", {
      frameWidth: 48, // Ajusta según el tamaño de tu frame
      frameHeight: 48 
    });
    this.load.image("vida agente", "public/assets/vida agente.png");
    this.load.image("powerup_shield", "public/assets/escudo.png");
    this.load.image("powerup_triple", "public/assets/triple disparo.png");
    this.load.spritesheet("agente disparo", "public/assets/agente disparo.png", {
      frameWidth: 48, // Ajusta según el tamaño de tu frame
      frameHeight: 48
    });
    this.load.spritesheet("virus", "public/assets/virus.png", {
      frameWidth: 16, // Ajusta según el tamaño de tu frame
      frameHeight: 16
    });
    this.load.spritesheet("celula muerte", "public/assets/muerte celula.png", {
      frameWidth: 32, // Ajusta según el tamaño de tu frame
      frameHeight: 32
    });
    this.load.spritesheet("500", "public/assets/500.png", {
      frameWidth: 21, // Ajusta según el tamaño de tu frame
      frameHeight: 21
    });
    this.load.spritesheet("2000", "public/assets/2000.png", {
      frameWidth: 21, // Ajusta según el tamaño de tu frame
      frameHeight: 21
    });
    this.load.spritesheet("500", "public/assets/500.png", {
      frameWidth: 21, // Ajusta según el tamaño de tu frame
      frameHeight: 21
    });

  
    this.load.audio("laser_shoot", "public/assets/Laser_Shoot.wav");
    this.load.audio("muerte_celula", "public/assets/muerte celula.wav");
    this.load.audio("muerte_virus", "public/assets/muerte virus.wav");
    this.load.audio("hit_agente", "public/assets/Hit_agente.wav");
    this.load.audio("Pickup_Powerup", "public/assets/Pickup_Coin2.wav");
    this.load.audio("muerte agente", "public/assets/muerte agente.wav");
    this.load.audio("musica_gameplay_1", "public/assets/musica gameplay 1.mp3");
    this.load.audio("musica_gameplay_2", "public/assets/musica gameplay 2.mp3");
  }

  create() {
    //que se muestre el fondo
    this.add.image(320, 180, "fondo game").setOrigin(0.5, 0.5).setDepth(0);

    // Dimensiones
    this.width = 640;
    this.height =  360;
    this.thickness = 23;
    const width = this.width;
    const height = this.height;
    const thickness = this.thickness;

    // Suelo
    this.add.rectangle(width / 2, height - thickness / 2, width, thickness)
      .setOrigin(0.5)
      .setDepth(1);
    this.matter.add.rectangle(width / 2, height - thickness / 2 -34 , width, thickness, { isStatic: true });

    // Techo
    this.add.rectangle(width / 2, thickness / 2, width, thickness)
      .setOrigin(0.5)
      .setDepth(1);
    this.matter.add.rectangle(width / 2, thickness / 2 -4, width, thickness, { isStatic: true });

    // Pared izquierda
    this.add.rectangle(thickness / 2, height / 2, thickness, height)
      .setOrigin(0.5)
      .setDepth(1);
    this.matter.add.rectangle(thickness / 2, height / 2, thickness, height, { isStatic: true });

    // Pared derecha
    this.add.rectangle(width - thickness / 2, height / 2, thickness, height)
      .setOrigin(0.5)
      .setDepth(1);
    this.matter.add.rectangle(width - thickness / 2, height / 2, thickness, height, { isStatic: true });

      // 1. Crea la animación primero
    this.anims.create({
        key: 'circleAnim',
        frames: this.anims.generateFrameNumbers('circleSheet', { start: 0, end: 3 }), // Cambia end: 4 por end: 3
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
      key: 'agente_idle',
      frames: [{ key: 'agente', frame: 3 }],
      frameRate: 1,
      repeat: -1
  });
  this.anims.create({
      key: 'agente_walk',
      frames: this.anims.generateFrameNumbers('agente', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
  });
  const shootFrames = 16; // Cambia este número por la cantidad real de frames de tu spritesheet
  this.anims.create({
    key: 'agente_shoot',
    frames: this.anims.generateFrameNumbers('agente disparo', { start: 0, end: shootFrames - 1 }),
    frameRate: shootFrames / 0.3, // Duración total: 0.2 segundos
    repeat: 0
});
this.anims.create({
  key: 'virusAnim',
  frames: this.anims.generateFrameNumbers('virus', { start: 0, end: 3 }),
  frameRate: 8,
  repeat: -1
});
this.anims.create({
  key: 'celula_muerte_anim',
  frames: this.anims.generateFrameNumbers('celula muerte', { start: 0, end: 3 }), // Ajusta end según tus frames
  frameRate: 12,
  repeat: 0
});
this.anims.create({
  key: 'score2000',
  frames: this.anims.generateFrameNumbers('2000', { start: 0, end: 3 }), // Ajusta end según tus frames
  frameRate: 10,
  repeat: 0
});
this.anims.create({
  key: 'score500',
  frames: this.anims.generateFrameNumbers('500', { start: 0, end: 3 }), // Ajusta end según tus frames
  frameRate: 10,
  repeat: 0
});

    // Círculos estilo Super Pang
    const circleCount = 1;
    const scale = 2; // Más grande para que se vean tipo burbuja
    this.circles = [];

    for (let i = 0; i < circleCount; i++) {
      const x = Phaser.Math.Between(40, width - 40);
      const y = Phaser.Math.Between(80, height / 2);
      const circle = this.matter.add.sprite(x, y, "circleSheet");
      circle.setScale(scale);
      circle.setCircle(circle.width); // Ajusta el cuerpo físico al tamaño visual
      circle.setBounce(1);
      circle.setFriction(0, 0, 0);
      circle.setFrictionAir(0); // Cambia aquí
      // Velocidad horizontal inicial aleatoria
      const dir = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
      circle.setVelocity(dir * 1.5, -1.5);
      circle.setFixedRotation();
      circle.direccionX = dir; // Guarda la dirección original
      circle.isBubble = true; // Marca el objeto como burbuja
      circle.play('circleAnim'); // <-- ¡Ahora sí puedes animar!
      this.circles.push(circle);
    }

    // Astronauta (personaje jugable)
    this.astronauta = this.matter.add.sprite(width / 2, height - thickness - 34, "agente");
    this.astronauta.setScale(0.75); // Ajusta si es necesario
    this.astronauta.play('agente_idle');
    this.astronauta.setRectangle(21, 34);
    this.astronauta.setFixedRotation();
    this.astronauta.setFriction(0.01, 0, 0);
    this.astronauta.setFrictionAir(0.01);
    this.astronauta.setBounce(0);


    // Limitar movimiento a suelo
    this.astronauta.setOnCollide(() => {
      // Puedes agregar lógica si quieres detectar cuando está en el suelo
    });

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyShoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.lasers = [];
    this.laserCooldown = 0; // Tiempo en milisegundos hasta el próximo disparo permitido
    this.laserDelay = 500;  // Delay entre disparos en ms (ajusta a tu gusto)

       // PUNTUACIÓN
    this.score = 0; // Inicializa el score aquí
    this.scoreText = this.add.text(430, 320, '00000000', {
      fontSize: '28px',
      fill: '#fff',
      fontFamily: 'Retro Gaming',
      resolution: 3
    }).setScrollFactor(0).setDepth(10);

    
    // Limpia listeners previos para evitar duplicados
    this.matter.world.off('collisionstart');

    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach(pair => {
        const a = pair.bodyA.gameObject;
        const b = pair.bodyB.gameObject;
        if (!a || !b) return;

        // Si colisionan un láser y una burbuja
        if ((a.isLaser && b.isBubble) || (a.isBubble && b.isLaser)) {
          const bubble = a.isBubble ? a : b;
          const laserObj = a.isLaser ? a : b;

          // Reproduce el sonido de muerte de célula
          if (this.sound) {
              this.sound.play("muerte_celula");
          }

          // Elimina el láser
          laserObj.destroy();
          this.lasers = this.lasers.filter(l => l !== laserObj);

          // ---- SUMA PUNTOS SEGÚN TAMAÑO ----
          let puntos = 0;
          if (bubble.scaleX >= 1.5) {
            puntos = 100;
          } else if (bubble.scaleX >= 0.9 && bubble.scaleX < 1.5) {
            puntos = 300;
          } else {
            puntos = 500;
          }
          this.score += puntos;
          if (this.scoreText) {
            this.scoreText.setText(this.score.toString().padStart(8, '0'));
          }
          // ---- FIN SUMA PUNTOS ----

          // Animación de "500" SOLO si es la burbuja más pequeña
          if (puntos === 500) {
            const scoreSprite = this.add.sprite(bubble.x, bubble.y, '500');
            scoreSprite.setScale(1); // Opcional: iguala el tamaño de la burbuja
            scoreSprite.play({ key: 'score500', repeat: 0 });
            scoreSprite.on('animationcomplete', () => {
              scoreSprite.destroy();
            });
          }


          // Guarda las coordenadas antes de destruir la burbuja
          const bubbleX = bubble.x;
          const bubbleY = bubble.y;
          const bubbleScale = bubble.scaleX;

          // Control de divisiones
          const maxSplits = 2;
          bubble.splitCount = bubble.splitCount || 0;

          if (bubble.splitCount < maxSplits) {
            const minScale = 0.04;
            const newScale = bubble.scaleX * 0.6;
            if (bubble.scaleX > minScale) {
              for (let dir of [-1, 1]) {
                const newCircle = this.matter.add.sprite(
                  bubble.x + dir * 10,
                  bubble.y,
                  "circleSheet"
                );
                newCircle.play('circleAnim');
                newCircle.setScale(newScale);
                newCircle.setCircle(newCircle.width * newScale * 0.5);
                newCircle.setBounce(1);
                newCircle.setFriction(0, 0, 0);
                newCircle.setFrictionAir(0);
                const velocidadX = dir * Phaser.Math.Between(2, 5);
                const velocidadY = Phaser.Math.FloatBetween(-1.5, -2.5);
                newCircle.setVelocity(velocidadX, velocidadY);
                newCircle.setFixedRotation();
                newCircle.direccionX = dir;
                newCircle.isBubble = true;
                newCircle.splitCount = bubble.splitCount + 1;
                this.circles.push(newCircle);
              }
            }
          }

          // Elimina la burbuja original SIEMPRE, pero antes muestra la animación de muerte
          // 1. Desactiva física y oculta la burbuja original
          bubble.setVisible(false);
          bubble.setActive(false);
          bubble.body && bubble.body.destroy && bubble.body.destroy();

          // 2. Crea el sprite de muerte en la misma posición y escala
          const deathSprite = this.add.sprite(bubbleX, bubbleY, 'celula muerte');
          deathSprite.setScale(bubbleScale);
          deathSprite.play('celula_muerte_anim');

          // 3. Cuando termine la animación, destruye el sprite de muerte
          deathSprite.on('animationcomplete', () => {
              deathSprite.destroy();
          });

          // 4. Elimina la burbuja del array y destruye el objeto
          this.circles = this.circles.filter(c => c !== bubble);
          bubble.destroy();

          // 10% de probabilidad de soltar power-up
          if (Phaser.Math.FloatBetween(0, 1) < 0.1 && bubbleX !== undefined && bubbleY !== undefined) {
            const tipo = Phaser.Math.Between(0, 1) === 0 ? "powerup_shield" : "powerup_triple";
            const powerUp = this.matter.add.sprite(bubbleX, bubbleY, tipo);
            powerUp.setScale(1);
            powerUp.setRectangle(20, 20);
            powerUp.setIgnoreGravity(false);
            powerUp.isPowerUp = true;
            powerUp.tipo = tipo;
            this.powerUps.push(powerUp);
          }
        }

        // Si colisiona un láser con un borde (suelo, techo, paredes)
        if (a.isLaser && b.label === "Rectangle Body" && b.isStatic) {
          a.destroy();
          this.lasers = this.lasers.filter(l => l !== a);
        }
        if (b.isLaser && a.label === "Rectangle Body" && a.isStatic) {
          b.destroy();
          this.lasers = this.lasers.filter(l => l !== b);
        }

        // Colisión burbuja-agente
        if (
          (a.isBubble && b === this.astronauta) ||
          (b.isBubble && a === this.astronauta)
        ) {
          // Evita perder varias vidas en un solo frame
          if (!this.invulnerable && this.lives > 0) {
            // Reproduce el sonido de golpe al agente
            if (this.sound) {
              this.sound.play("hit_agente");
            }
            this.perderVida();
            this.invulnerable = true;
            this.astronauta.setAlpha(0.5); // Efecto visual

            // --- Haz que la burbuja salga disparada hacia arriba ---
            const bubbleObj = a.isBubble ? a : b;
            bubbleObj.setVelocityY(-4); // Ajusta la velocidad si quieres

            // Quita la invulnerabilidad después de 1 segundo
            this.time.delayedCall(1000, () => {
              this.invulnerable = false;
              this.astronauta.setAlpha(1);
            });

            // Si se queda sin vidas, termina el juego
            if (this.lives <= 0) {
              this.gameOver();
            }
          }
        }

        // Colisión agente-powerup
        if (
          (a.isPowerUp && b === this.astronauta) ||
          (b.isPowerUp && a === this.astronauta)
        ) {
          const powerUp = a.isPowerUp ? a : b;

          // Reproduce el sonido de recoger power-up
          if (this.sound) {
            this.sound.play("Pickup_Powerup");
          }

          // Desactiva cualquier power-up anterior
          if (this.hasShield) {
            this.hasShield = false;
            this.astronauta.clearTint();
          }
          if (this.tripleShot) {
            this.tripleShot = false;
          }

          // Activa el nuevo power-up
          if (powerUp.tipo === "powerup_shield") {
            this.hasShield = true;
            this.astronauta.setTint(0x00ffff); // Efecto visual
            this.activePowerUpIcon.setTexture("powerup_shield").setVisible(true);
            this.time.delayedCall(5000, () => {
              this.hasShield = false;
              this.astronauta.clearTint();
              this.activePowerUpIcon.setVisible(false);
            });
          } else if (powerUp.tipo === "powerup_triple") {
            this.tripleShot = true;
            this.activePowerUpIcon.setTexture("powerup_triple").setVisible(true);
            this.time.delayedCall(5000, () => {
              this.tripleShot = false;
              this.activePowerUpIcon.setVisible(false);
            });
          }
          powerUp.destroy();
          this.powerUps = this.powerUps.filter(p => p !== powerUp);
        }

        // Colisión virus-agente
        if (
          (a.isVirus && b === this.astronauta) ||
          (b.isVirus && a === this.astronauta)
        ) {
          if (!this.invulnerable && this.lives > 0) {
            // Reproduce el sonido de golpe al agente
            if (this.sound) {
              this.sound.play("hit_agente");
            }
            this.perderVida();
            this.invulnerable = true;
            this.astronauta.setAlpha(0.5); // Efecto visual
            //el virus sale disparado hacia arriba
            const virusObj = a.isVirus ? a : b;
            virusObj.setVelocity(0, -4); // Sale disparado hacia arriba

            // Quita la invulnerabilidad después de 1 segundo
            this.time.delayedCall(1000, () => {
              this.invulnerable = false;
              this.astronauta.setAlpha(1);
            });

            // Si se queda sin vidas, termina el juego
            if (this.lives <= 0) {
              this.gameOver();
            }
          }
        }

        // Colisión láser-virus (nuevo)
        if (
          (a.isLaser && b.isVirus) ||
          (b.isLaser && a.isVirus)
        ) {
          const virusObj = a.isVirus ? a : b;
          const laserObj = a.isLaser ? a : b;

          // Reproduce el sonido de muerte de virus
          if (this.sound) {
            this.sound.play("muerte_virus");
          }

          // Elimina el virus y el láser
          const virusX = virusObj.x;
          const virusY = virusObj.y;
          virusObj.destroy();
          laserObj.destroy();
          this.viruses = this.viruses.filter(v => v !== virusObj);
          this.lasers = this.lasers.filter(l => l !== laserObj);

          // Suma 2000 puntos
          this.score += 2000;
          if (this.scoreText) {
            this.scoreText.setText(this.score.toString().padStart(8, '0'));
          }

          // Animación de "2000"
          const scoreSprite = this.add.sprite(virusX, virusY, '2000');
          scoreSprite.setScale(1);
          scoreSprite.play({ key: 'score2000', repeat: 0 });

          // Si no tienes la animación, créala una vez en create():
          // this.anims.create({
          //   key: 'score2000',
          //   frames: this.anims.generateFrameNumbers('2000', { start: 0, end: 3 }), // Ajusta end según tus frames
          //   frameRate: 10,
          //   repeat: 0
          // });

          scoreSprite.on('animationcomplete', () => {
            scoreSprite.destroy();
          });
        }
      });
    });

    this.spawnDelay = 9000; // 9 segundos en ms

    this.spawnEvent = this.time.addEvent({
      delay: this.spawnDelay,
      loop: true,
      callback: () => {
        const x = Phaser.Math.Between(40, this.width - 40);
        const y = Phaser.Math.Between(80, this.height / 2);
        const scale = 2;
        const circle = this.matter.add.sprite(x, y, "circleSheet");
        circle.play('circleAnim');
        circle.setScale(scale);
        circle.setCircle(circle.width);
        circle.setBounce(1);
        circle.setFriction(0, 0, 0);
        circle.setFrictionAir(0);
        const dir = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
        circle.setVelocity(dir * 1.5, -1.5);
        circle.setFixedRotation();
        circle.direccionX = dir;
        circle.isBubble = true;
        this.circles.push(circle);

        // Reduce el delay en 100 ms (10 décimas de segundo)
        this.spawnDelay = Math.max(80, this.spawnDelay - 80); // No baja de 70 ms
        this.spawnEvent.reset({
          delay: this.spawnDelay,
          callback: this.spawnEvent.callback,
          callbackScope: this.spawnEvent.callbackScope,
          loop: true
        });
      }
    });
 
    this.maxLives = 3;
    this.lives = this.maxLives;
    this.lifeSprites = [];
    for (let i = 0; i < this.maxLives; i++) {
      const life = this.add.image(40 + i * 40, 336, "vida agente")
        .setScale(1)
        .setScrollFactor(0)
        .setDepth(10);
      this.lifeSprites.push(life);
    }

    this.powerUps = [];
    this.hasShield = false;
    this.tripleShot = false;
    this.bubbleSpeedMultiplier = 1;
    this.isShooting = false; // Inicializa la bandera

    this.viruses = [];

    // --- En create(), reemplaza el timer de virus por: ---
const spawnVirus = () => {
  const x = Phaser.Math.Between(4, this.width - 40);
  const y = Phaser.Math.Between(80, this.height / 2);
  const virus = this.matter.add.sprite(x, y, "virus");
  virus.play('virusAnim');
  virus.setScale(1);
  virus.setRectangle(16, 16); // Hitbox cuadrada de 16x16
  virus.setBounce(1);
  virus.setFriction(0, 0, 0);
  virus.setFrictionAir(0);
  virus.setIgnoreGravity(true);
  virus.setFixedRotation(); // No rota
  virus.isVirus = true;
  const dir = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
  const speedX = 12 + Phaser.Math.FloatBetween(0, 0.8); // Velocidad horizontal entre 0.4 y 1
  const speedY = Phaser.Math.FloatBetween(-3, 3);
  virus.setVelocity(dir * speedX, speedY);
  virus.direccionX = dir;
  this.viruses.push(virus);

  // Programa el próximo spawn con delay aleatorio entre 7 y 10 segundos
  const nextDelay = Phaser.Math.Between(12000, 15000);
  this.time.delayedCall(nextDelay, spawnVirus, [], this);
};

// Inicia el primer spawn
spawnVirus();

this.activePowerUpIcon = this.add.image(310, 340, null)
  .setScale(1.2)
  .setVisible(false)
  .setDepth(20);

  this.fadeRect = this.add.rectangle(320, 180, 640, 360, 0x000000, 0)
  .setDepth(100)
  .setScrollFactor(0)
  .setOrigin(0.5);

  // Música de fondo alterna
  this.musicKeys = ["musica_gameplay_1", "musica_gameplay_2"];
  this.currentMusicIndex = Phaser.Math.Between(0, 1); // <-- Random al inicio
  this.music = null;

  const playNextMusic = () => {
      if (this.music) {
          this.music.off('complete');
          this.music.stop();
      }
      const key = this.musicKeys[this.currentMusicIndex];
      this.music = this.sound.add(key, { loop: false, volume: this.sys.game.globals.musicVolume });
      this.music.play();
      this.music.once('complete', () => {
          // Alterna a la otra pista
          this.currentMusicIndex = (this.currentMusicIndex + 1) % this.musicKeys.length;
          playNextMusic();
      });
  };

  playNextMusic();
  }

  update() {
    const width = this.width;
    const thickness = this.thickness;
    const velocidadX = 1.5; // Antes 3
    this.bubbleSpeedMultiplier += 0.00004;

    this.circles.forEach(circle => {
      // Si tocó una pared, invierte la dirección
      if (
        (circle.x - circle.displayWidth / 2 <= thickness && circle.direccionX < 0) ||
        (circle.x + circle.displayWidth / 2 >= width - thickness && circle.direccionX > 0)
      ) {
        circle.direccionX *= -1;
      }
      // Fuerza la velocidad horizontal constante según la dirección
      circle.setVelocityX(circle.direccionX * velocidadX * this.bubbleSpeedMultiplier);

      // Rebote manual si toca el suelo
      if (circle.y + circle.displayHeight / 2 >= this.height - this.thickness -34) {
        circle.setVelocityY(-5); // Ajusta este valor para más o menos rebote
      }

      // Limita la velocidad máxima de cada círculo
      const maxVel = 6; // Puedes ajustar este valor
      if (circle.body) {
        const vx = Phaser.Math.Clamp(circle.body.velocity.x, -maxVel, maxVel);
        const vy = Phaser.Math.Clamp(circle.body.velocity.y, -maxVel, maxVel);
        circle.setVelocity(vx, vy);
      }
    });

    // Movimiento del astronauta
    const velocidadJugador = 2.5;
    if (!this.isShooting) {
      if (this.cursors.left.isDown) {
        this.astronauta.setVelocityX(-velocidadJugador);
        this.astronauta.setFlipX(false);
        this.astronauta.play('agente_walk', true);
      } else if (this.cursors.right.isDown) {
        this.astronauta.setVelocityX(velocidadJugador);
        this.astronauta.setFlipX(true);
        this.astronauta.play('agente_walk', true);
      } else {
        this.astronauta.setVelocityX(0);
        this.astronauta.play('agente_idle', true);
      }
    } else {
      this.astronauta.setVelocityX(0); // Detiene movimiento horizontal
    }

    // Mantener al astronauta pegado al suelo
    this.astronauta.setVelocityY(0);

    // Disparo láser with Z
    if (Phaser.Input.Keyboard.JustDown(this.keyShoot) && this.laserCooldown <= 0 && !this.isShooting) {
      if (this.tripleShot) {
        for (let dx of [-0.8, 0, 0.8]) {
          const laser = this.matter.add.image(
            this.astronauta.x + dx * 30,
            this.astronauta.y - this.astronauta.displayHeight / 2,
            "laser"
          );
          laser.setScale(0.2);
          laser.setVelocity(dx * 3, -9);
          laser.setIgnoreGravity(true);
          laser.setSensor(true);
          laser.isLaser = true;
          this.lasers.push(laser);
        }
      } else {
        const laser = this.matter.add.image(
          this.astronauta.x,
          this.astronauta.y - this.astronauta.displayHeight / 2,
          "laser"
        );
        laser.setScale(0.2);
        laser.setVelocityY(-9);
        laser.setIgnoreGravity(true);
        laser.setSensor(true);
        laser.isLaser = true;
        this.lasers.push(laser);
      }

      // Reproduce el sonido del disparo
      if (this.sound) {
        this.sound.play("laser_shoot");
      }

      this.laserCooldown = this.laserDelay;

      // Cambia animación a disparo y bloquea movimiento
      this.isShooting = true;
      this.astronauta.play('agente_shoot', true);

      // Cuando termine la animación de disparo, vuelve a idle y desbloquea movimiento
      this.astronauta.once('animationcomplete-agente_shoot', () => {
        this.isShooting = false;
        this.astronauta.play('agente_idle', true);
      });
    }

    // Resta el tiempo transcurrido al cooldown
    if (this.laserCooldown > 0) {
      this.laserCooldown -= this.game.loop.delta;
    }

    // Actualiza y elimina láseres fuera de pantalla
    this.lasers = this.lasers.filter(laser => {
      if (laser.y < -20) {
        laser.destroy();
        return false;
      }
      return true;
    });

    // Movimiento y rebote de virus
    this.viruses.forEach(virus => {
      // Rebote en paredes laterales
      if (virus.x - virus.displayWidth / 2 <= this.thickness && virus.direccionX < 0) {
        virus.direccionX *= -1;
      }
      if (virus.x + virus.displayWidth / 2 >= this.width - this.thickness && virus.direccionX > 0) {
        virus.direccionX *= -1;
      }
      // Fuerza velocidad X constante
      const speedX = 2.5 + Phaser.Math.FloatBetween(0, 0.8); // Velocidad horizontal entre 0.4 y 1
      virus.setVelocityX(virus.direccionX * speedX);

      // Rebote manual en suelo
      if (virus.y + virus.displayHeight / 2 >= this.height - this.thickness -55) {
        virus.setVelocityY(-2.5); // Rebote hacia arriba
      }
      // Rebote manual en techo
      if (virus.y - virus.displayHeight / 2 <= this.thickness + 2) {
        virus.setVelocityY(2); // Rebote hacia abajo
      }
      // Limita velocidad máxima en Y
      if (virus.body) {
        const vy = Phaser.Math.Clamp(virus.body.velocity.y, -4, 4);
        virus.setVelocityY(vy);
      }
    });
  }


  perderVida() {
    if (this.hasShield) return; // No pierde vida si tiene escudo
    if (this.lives > 0) {
      this.lives--;
      this.lifeSprites[this.lives].setVisible(false);
    }
  }

gameOver() {
    if (this.gameOverTriggered) return;
    this.gameOverTriggered = true;
    if (this.music) {
        this.music.stop();
    }
    // Reproduce el sonido de muerte del agente
    if (this.sound) {
        this.sound.play("muerte agente", { volume: 0.5 * this.sys.game.globals.sfxVolume });
    }

    // Detén física y animaciones
    this.matter.world.enabled = false;
    this.circles.forEach(c => c.anims.pause());
    this.viruses.forEach(v => v.anims.pause());
    if (this.astronauta.anims) this.astronauta.anims.pause();
    this.lasers.forEach(l => l.setVelocity(0, 0));
    this.powerUps.forEach(p => p.setVelocity && p.setVelocity(0, 0));

    // Bloquea input y animaciones del astronauta
    this.input.keyboard.enabled = false;
    this.isShooting = true; // Bloquea movimiento y disparo en update

    // Detén el evento de spawn de burbujas si existe
    if (this.spawnEvent) {
        this.spawnEvent.remove(false);
    }

    // Detén el spawn de virus (si usas delayedCall en spawnVirus)
    if (this.virusSpawnTimer) {
        this.virusSpawnTimer.remove(false);
    }

    // Fade opcional (si quieres)
    if (this.fadeRect) {
      this.fadeRect.setDepth(9999);
      this.tweens.add({
        targets: this.fadeRect,
        alpha: 1,
        duration: 1000,
        onComplete: () => {
          this.time.delayedCall(500, () => {
            this.scene.start('FinalScene', { score: this.score });
          });
        }
      });
    } else {
      this.time.delayedCall(500, () => {
        this.scene.start('FinalScene', { score: this.score });
      });
    }
}
}
