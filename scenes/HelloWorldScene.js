// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
  }

  preload() {
    // load assets
    //this.load.image("circulo", "public/assets/CELULAS SPRITESHEET.png");
    this.load.image("astronauta", "public/assets/astronauta.png");
    this.load.image("laser", "public/assets/laser.png");
    this.load.image("fondo game", "public/assets/FONDO GAME.png")
    this.load.spritesheet("circleSheet", "public/assets/CELULAS-SPRITESHEET.png", {
        frameWidth: 32, // ajusta al tamaño de tu frame
        frameHeight: 32
    });
    this.load.spritesheet("agente", "public/assets/agente.png", {
      frameWidth: 48, // Ajusta según el tamaño de tu frame
      frameHeight: 48
  });
  
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
    this.matter.add.rectangle(width / 2, height - thickness / 2, width, thickness, { isStatic: true });

    // Techo
    this.add.rectangle(width / 2, thickness / 2, width, thickness)
      .setOrigin(0.5)
      .setDepth(1);
    this.matter.add.rectangle(width / 2, thickness / 2, width, thickness, { isStatic: true });

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

    // Círculos estilo Super Pang
    const circleCount = 1;
    const scale = 3; // Más grande para que se vean tipo burbuja
    this.circles = [];

    for (let i = 0; i < circleCount; i++) {
      const x = Phaser.Math.Between(40, width - 40);
      const y = Phaser.Math.Between(80, height / 2);
      const circle = this.matter.add.sprite(x, y, "circleSheet");
      circle.setScale(scale);
      circle.setCircle(circle.width* 1.5); // Ajusta el cuerpo físico al tamaño visual
      circle.setBounce(1);
      circle.setFriction(0, 0, 0);
      circle.setFrictionAir(0); // Cambia aquí
      // Velocidad horizontal inicial aleatoria
      const dir = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
      circle.setVelocity(dir * 1.5, -2.5);
      circle.setFixedRotation();
      circle.direccionX = dir; // Guarda la dirección original
      circle.isBubble = true; // Marca el objeto como burbuja
      circle.play('circleAnim'); // <-- ¡Ahora sí puedes animar!
      this.circles.push(circle);
    }

    // Astronauta (personaje jugable)
    this.astronauta = this.matter.add.sprite(width / 2, height - thickness - 20, "agente");
    this.astronauta.setScale(1); // Ajusta si es necesario
    this.astronauta.play('agente_idle');
    this.astronauta.setRectangle(28, 38);
    this.astronauta.setFixedRotation();
    this.astronauta.setFriction(0.01, 0, 0);
    this.astronauta.setFrictionAir(0.02);
    this.astronauta.setBounce(0);


    // Limitar movimiento a suelo
    this.astronauta.setOnCollide(() => {
      // Puedes agregar lógica si quieres detectar cuando está en el suelo
    });

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.lasers = [];
    this.laserCooldown = 0; // Tiempo en milisegundos hasta el próximo disparo permitido
    this.laserDelay = 400;  // Delay entre disparos en ms (ajusta a tu gusto)

    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach(pair => {
        const a = pair.bodyA.gameObject;
        const b = pair.bodyB.gameObject;
        if (!a || !b) return;

        // Si colisionan un láser y una burbuja
        if ((a.isLaser && b.isBubble) || (a.isBubble && b.isLaser)) {
          const bubble = a.isBubble ? a : b;
          const laserObj = a.isLaser ? a : b;

          // Elimina el láser
          laserObj.destroy();
          this.lasers = this.lasers.filter(l => l !== laserObj);

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
                newCircle.play('circleAnim'); // <-- ¡Agrega esta línea!
                newCircle.setScale(newScale);
                newCircle.setCircle(newCircle.width * newScale * 0.5);
                newCircle.setBounce(1);
                newCircle.setFriction(0, 0, 0);
                newCircle.setFrictionAir(0);
                // Velocidad horizontal aleatoria entre 3 y 12 (puedes ajustar el rango)
                const velocidadX = dir * Phaser.Math.Between(3, 6);
                // Velocidad vertical aleatoria hacia arriba entre -8 y -14
                const velocidadY = Phaser.Math.FloatBetween(-3, -4);
                newCircle.setVelocity(velocidadX, velocidadY);
                newCircle.setFixedRotation();
                newCircle.direccionX = dir;
                newCircle.isBubble = true;
                newCircle.splitCount = bubble.splitCount + 1; // Aumenta el contador
                this.circles.push(newCircle);
              }
            }
          }
          // Elimina la burbuja original siempre
          bubble.destroy();
          this.circles = this.circles.filter(c => c !== bubble);
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
      });
    });

    // Spawnea un círculo nuevo cada 7 segundos
    this.time.addEvent({
      delay: 9000,
      loop: true,
      callback: () => {
        const x = Phaser.Math.Between(40, this.width - 40);
        const y = Phaser.Math.Between(80, this.height / 2);
        const scale = 3;
        const circle = this.matter.add.sprite(x, y, "circleSheet");
        circle.play('circleAnim'); // Inicia la animación
        circle.setScale(scale);
        circle.setCircle(circle.width * 1.5);
        circle.setBounce(1);
        circle.setFriction(0, 0, 0);
        circle.setFrictionAir(0);
        const dir = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
        circle.setVelocity(dir * 1.5, -3.5);
        circle.setFixedRotation();
        circle.direccionX = dir;
        circle.isBubble = true;
        this.circles.push(circle);
      }
    });
 
  }

  update() {
    const width = this.width;
    const thickness = this.thickness;
    const velocidadX = 1.5; // Antes 3
    const velocidadY = -3.5; // Antes -5
    const maxVel = 3.5; // Antes 7
    const sueloY = this.height - this.thickness;
    const tolerancia = 4;

    this.circles.forEach(circle => {
      // Si tocó una pared, invierte la dirección
      if (
        (circle.x - circle.displayWidth / 2 <= thickness && circle.direccionX < 0) ||
        (circle.x + circle.displayWidth / 2 >= width - thickness && circle.direccionX > 0)
      ) {
        circle.direccionX *= -1;
      }
      // Fuerza la velocidad horizontal constante según la dirección
      circle.setVelocityX(circle.direccionX * velocidadX);

      // Rebote manual si toca el suelo
      if (circle.y + circle.displayHeight / 2 >= this.height - this.thickness) {
        circle.setVelocityY(-5); // Ajusta este valor para más o menos rebote
      }

      // Limita la velocidad máxima de cada círculo
      const maxVel = 7; // Puedes ajustar este valor
      if (circle.body) {
        const vx = Phaser.Math.Clamp(circle.body.velocity.x, -maxVel, maxVel);
        const vy = Phaser.Math.Clamp(circle.body.velocity.y, -maxVel, maxVel);
        circle.setVelocity(vx, vy);
      }
    });

    // Movimiento del astronauta
    const velocidadJugador = 2.7;
    if (this.cursors.left.isDown) {
      this.astronauta.setVelocityX(-velocidadJugador);
      this.astronauta.setFlipX(false); // Camina a la izquierda
      this.astronauta.play('agente_walk', true);
    } else if (this.cursors.right.isDown) {
      this.astronauta.setVelocityX(velocidadJugador);
      this.astronauta.setFlipX(true); // Camina a la derecha (volteado)
      this.astronauta.play('agente_walk', true);
    } else {
      this.astronauta.setVelocityX(0);
      this.astronauta.play('agente_idle', true);
    }

    // Mantener al astronauta pegado al suelo
    this.astronauta.setVelocityY(0);

    // Disparo láser con Z
    if (Phaser.Input.Keyboard.JustDown(this.keyZ) && this.laserCooldown <= 0) {
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

      this.laserCooldown = this.laserDelay; // Reinicia el cooldown
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
  }
}
