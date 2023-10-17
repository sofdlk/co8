let balls = [];
let gravity;
const damping = 0.995;
let isMousePressed = false;

function setup() {
  createCanvas(640, 640);
  colorMode(HSB);
  gravity = createVector(0, 0.1);
}

function draw() {
  background(255);

  for (let i = balls.length - 1; i >= 0; i--) {
    let ball = balls[i];

    ball.applyGravity(gravity);
    ball.checkEdges();

    // 마우스를 클릭할 때만 힘을 가하도록 함
    if (isMousePressed) {
      let force = createVector(mouseX - ball.position.x, mouseY - ball.position.y);
      force.mult(0.01);
      ball.applyForce(force);
    }
    
    let upForce = createVector(0, -0.2);
    
    // 마우스를 클릭하지 않을 때만 위쪽 힘을 가함
    if (!isMousePressed && mouseY < height / 2) {
      ball.applyForce(upForce);
    }

    ball.applyDamping(damping);
    ball.update();
    ball.display();

    if (ball.isOutOfScreen()) {
      balls.splice(i, 1);
    }
  }

  if (random(1) < 0.02 && balls.length < 30) {
    let randomX = random(width);
    let randomY = random(height);
    let randomRadius = random(10, 30);
    let randomColor = color(random(200, 240), 100, 100);
    let newDroplet = new WaterDroplet(randomX, randomY, randomRadius, randomColor);
    balls.push(newDroplet);
  }
}

class WaterDroplet {
  constructor(x, y, radius, color) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-2, 2), random(-2, 2));
    this.acceleration = createVector(0, 0);
    this.radius = radius;
    this.color = color;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  applyGravity(gravity) {
    this.acceleration.add(gravity);
  }

  applyDamping(damping) {
    this.velocity.mult(damping);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  checkEdges() {
    if (this.position.x > width || this.position.x < 0) {
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.position.y > height || this.position.y < 0) {
      this.velocity.y = this.velocity.y * -1;
    }
  }

  isOutOfScreen() {
    return (
      this.position.x > width + this.radius ||
      this.position.x < -this.radius ||
      this.position.y > height + this.radius ||
      this.position.y < -this.radius
    );
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }
}

function mousePressed() {
  isMousePressed = true;
}

function mouseReleased() {
  isMousePressed = false;
}
