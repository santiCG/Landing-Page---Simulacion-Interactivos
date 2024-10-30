let particles = [];
let lastMouseX = 0;  // Para rastrear el movimiento horizontal del mouse
let radius = 200;    // Radio del hoyo en la capa negra
let fireTexture;     // Variable para la textura de fuego

function preload() {
    // Cargar la textura de fuego
    fireTexture = loadImage("texture.png");
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);  // Coloca el canvas en la esquina superior izquierda
    canvas.style('z-index', '2');  // Asegura que el canvas esté encima del contenido
    noCursor();  // Oculta el cursor
}

function draw() {
    blendMode(ADD);

    clear();  // Limpia el canvas para evitar acumulación
    fill(0, 0, 0, 230);  // Fondo semitransparente negro
    rect(0, 0, width, height);  // Capa negra que cubre todo el canvas

    // Crear el hoyo que sigue el mouse
    erase();
    circle(mouseX, mouseY, radius * 2);
    noErase();

    // Actualizar y mostrar el sistema de partículas
    updateParticles();
}

function updateParticles() {
    // Generar nuevas partículas en la posición del mouse
    particles.push(new Particle(mouseX, mouseY, fireTexture));

    // Calcular la dirección del movimiento horizontal del mouse
    let wind = 0;
    if (mouseX < lastMouseX) {
        wind = 0.02;  // Viento hacia la derecha si el mouse va hacia la izquierda
    } else if (mouseX > lastMouseX) {
        wind = -0.02;  // Viento hacia la izquierda si el mouse va hacia la derecha
    }
    lastMouseX = mouseX;  // Actualizar la última posición del mouse en X

    // Actualizar y dibujar cada partícula
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].applyForce(createVector(wind, -0.01));  // Aplica viento y una leve fuerza hacia arriba
        particles[i].update();
        particles[i].display();

        // Eliminar partículas que ya se han desvanecido
        if (particles[i].isFinished()) {
            particles.splice(i, 1);
        }
    }
}

// Clase para definir partículas individuales con gradiente de color
class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-1, 1), random(-2, -0.5));
        this.acc = createVector(0, 0);
        this.lifespan = 255;  // Duración de la partícula
        this.size = random(20, 40);  // Tamaño aleatorio de la partícula
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);  // Resetear aceleración después de aplicar
        this.lifespan -= 4;  // Reducir la vida de la partícula
    }

    display() {
        // Cambiar el color gradualmente de blanco a rojo según la vida útil
        let r = map(this.lifespan, 0, 255, 255, 150);  // De blanco a rojo
        let g = map(this.lifespan, 0, 200, 220, 0);     // Reducir verde
        let b = 0;                                     // Sin azul para tonos cálidos
      
        
        tint(r, g, b, this.lifespan); // Aplicar el color con transparencia
        // Dibujar la textura de fuego con el color
        image(fireTexture, this.pos.x, this.pos.y, this.size, this.size);
    }

    isFinished() {
        return this.lifespan < 0;
    }
}

// Ajustar el tamaño del canvas al cambiar el tamaño de la ventana
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
