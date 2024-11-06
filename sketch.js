let layers = [];
let customFont;
let maxLayers = 5;
let colors = [
  [67, 4, 120],
  [77, 4, 125],
  [87, 4, 130],
  [97, 4, 150],
  [107, 4, 170]
];
let layerSpeed = 500;
let groundHeight = 50;
let buildingGap;
let drawCounter = 0;
let stars = [];
let currentLayer = 0;
let allLayersComplete = false;
let santiagoY = -30;
let cardenasX = -100;
let textOpacity = 0;
let fallingStars = []; // Array para almacenar las estrellas fugaces
let song;
let amplitude;
let levelPower = 400;
let colorPower = 2;

function preload() {
  customFont = loadFont('./CyberpunkFont.otf');
  song = loadSound('./V-Song.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(15, 16, 38);
  textFont(customFont);
  textAlign(CENTER, CENTER);
  textSize(80);
  
  buildingGap = random(20, 50);
  
  amplitude = new p5.Amplitude();

  for (let i = 0; i < maxLayers; i++) {
    layers.push([]);
  }

  for (let i = 0; i < 200; i++) {
    let starX = random(width);
    let starY = random(height);
    let starSize = random(1, 3);
    stars.push({ x: starX, y: starY, size: starSize });
  }

  frameRate(layerSpeed);
}

function draw() {
  background(15, 16, 38);
  drawBackground();
  
  for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
    let layer = layers[layerIndex];
    let colorIndex = map(layerIndex, 0, layers.length - 1, 0, colors.length - 1);
    let col = colors[Math.floor(colorIndex)];

    if (layerIndex === currentLayer && drawCounter % (15 - layerIndex * 3) === 0 && layer.length * buildingGap < width) {
      let rectWidth = random(10, 30);
      let rectHeight = random(50, 100) * (layerIndex + 1) * 0.3;
      let x = layer.length * buildingGap + random(-50, 50);
      let y = height - groundHeight - rectHeight;

      layer.push({ x, y, w: rectWidth, h: rectHeight });
    }

    for (let building of layer) {
      let level = amplitude.getLevel();
      fill(col[0]*(level*colorPower), col[1]*(level*colorPower), col[2]*(level*colorPower));
      
      rect(building.x, building.y- (level*levelPower), building.w, building.h + (level*levelPower));
    }
  }

  if (layers[currentLayer].length * buildingGap >= width) {
    if (currentLayer < maxLayers - 1) {
      currentLayer++;
    }
  }

  drawCounter++;

  if (santiagoY < height * 0.3) {
    santiagoY += 0.5;
    textOpacity = map(santiagoY, -100, height * 0.3, 0, 255);
  }

  if (cardenasX < width / 2) {
    cardenasX += 2;
    textOpacity = map(cardenasX, -500, width / 2, 0, 255);
  }

  fill(252, 236, 12, textOpacity);
  let x = frameCount;
  
  textSize(40*(Math.abs(sin(x*0.005))+1));
  text("S", (cardenasX - width * 0.2), (height * 0.3));
  text("A", (width / 2) - width * 0.1, (-santiagoY + height * 0.6));
  text("N", (width / 2), santiagoY);
  text("T", (width / 2) + width * 0.12, (-santiagoY + height * 0.6));
  text("I", (-cardenasX + width * 1.22), (height * 0.3));

  text("C", (cardenasX - width * 0.3), (height * 0.4));
  text("A", (width / 2) - width * 0.2, (-santiagoY + height * 0.7));
  text("R", (width / 2) - width * 0.1, (santiagoY + height * 0.1));
  text("D", cardenasX, (height * 0.3) + height * 0.1);
  text("E", (width / 2) + width * 0.1, (santiagoY + height * 0.1));
  text("N", (-cardenasX + width * 1.2), (height * 0.4));
  text("A", width * 0.8, (santiagoY + height * 0.1));
  text("S", (-cardenasX + width * 1.4), (height * 0.4));

  // Dibujar y actualizar estrellas fugaces
  for (let i = fallingStars.length - 1; i >= 0; i--) {
    fallingStars[i].update();
    fallingStars[i].show();
    if (fallingStars[i].isDone()) {
      fallingStars.splice(i, 1);
    }
  }
}

function drawBackground() {
  noStroke();
  fill(255);
  for (let star of stars) {
    rect(star.x, star.y, star.size, star.size);
  }

  fill(25, 25, 45);
  rect(0, height - groundHeight, width, groundHeight);
}

function mousePressed() {
  console.log("cancion");
  if (!song.isPlaying()) {
    song.play();
  }
  fallingStars.push(new FallingStar(mouseX, mouseY));
}

class FallingStar {
  constructor(targetX, targetY) {
    this.x = random(width);
    this.y = random(height * 0.1); // Empieza en la parte superior de la pantalla
    this.targetX = targetX;
    this.targetY = targetY;
    this.particles = [];
    this.angle = atan2(targetY - this.y, targetX - this.x);
    this.speed = 5;
  }

  update() {
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);

    // Generar partículas para crear el efecto de la estela
    this.particles.push(new Particle(this.x, this.y));

    // Limitar el número de partículas en la estela
    if (this.particles.length > 50) {
      this.particles.shift();
    }
  }

  show() {
    for (let particle of this.particles) {
      particle.update();
      particle.show();
    }

    fill(235, 100, 2);
    noStroke();
    square(this.x, this.y, 5, 5);
  }

  isDone() {
    return dist(this.x, this.y, this.targetX, this.targetY) < 5;
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alpha = 255;
  }

  update() {
    this.alpha -= 5;
  }

  show() {
    noStroke();
    fill(235, 100, 2, this.alpha);
    ellipse(this.x, this.y, 3, 3);
  }
}
