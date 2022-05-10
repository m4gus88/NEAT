class Ship {
    constructor() {
        let cornerX = Math.random() > 0.5 ? 1 : 0;
        let cornerY = Math.random() > 0.5 ? 1 : 0;
        this.position = createVector(cornerX * (width - 40) + 20, cornerY * (height - 40) + 20);
        this.angle = Math.random() * 360;
        this.velocity = 5;
        this.turnSpeed = 10;
    }

    draw() {
        fill(0, 0, 255, 255);
        noStroke();
        push();
        translate(this.position.x, this.position.y);
        rotate(this.angle * Math.PI / 180 + Math.PI/2);
        triangle(0, -10, -5, 5, 5, 5);
        pop();
    }

    update(genome) {
        this.angle = this.angle % 360;
        let velocity = createVector(Math.cos(this.angle * Math.PI / 180) * this.velocity, Math.sin(this.angle * Math.PI / 180) * this.velocity);
        this.position.x += velocity.x;
        this.position.y += velocity.y;

        if (this.position.x < 0) {
            this.position.x = 0;
        }

        if (this.position.x > width) {
            this.position.x = width;
        }

        if (this.position.y < 0) {
            this.position.y = 0;
        }

        if (this.position.y > height) {
            this.position.y = height;
        }
    }
}