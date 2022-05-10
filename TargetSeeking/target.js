class Target {
    constructor() {
        this.position = createVector(width/2, height/2);
        this.angle = Math.random() * 360;
        this.velocity = 2;
        this.maxTurn = 10;
    }

    draw() {
        stroke(255);
        noFill();
        ellipse(this.position.x, this.position.y, 2);
        ellipse(this.position.x, this.position.y, 100);
    }

    update() {
        this.angle += (Math.random() * 2 - 1) * this.maxTurn;
        this.angle = this.angle % 360;
        let velocity = createVector(Math.cos(this.angle * Math.PI / 180) * this.velocity, Math.sin(this.angle * Math.PI / 180) * this.velocity);
        this.position.x += velocity.x;
        this.position.y += velocity.y;

        if (this.position.x < 0 || this.position.x > width || this.position.y < 0 || this.position.y > height) {
            this.angle = (this.angle + 180) % 360;
        }
    }
}