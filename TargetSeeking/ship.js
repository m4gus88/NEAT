class Ship {
    constructor() {
        let cornerX = Math.random() > 0.5 ? 1 : 0;
        let cornerY = Math.random() > 0.5 ? 1 : 0;
        this.position = createVector(cornerX * (game.width - 40) + 20, cornerY * (game.height - 40) + 20);
        this.angle = Math.random() * 90 + (cornerX + cornerY) * 90;

        if (cornerY === 1 && cornerX === 0) {
            this.angle = (this.angle - 180) % 360;
        }

        this.velocity = 5;
        this.turnSpeed = 10;
    }

    draw(color) {
        fill(d3.color(color).formatHex());
        noStroke();
        push();
        translate(this.position.x, this.position.y);
        rotate(this.angle * Math.PI / 180 + Math.PI/2);
        triangle(0, -10, -5, 5, 5, 5);
        pop();
    }

    update() {
        this.angle = this.angle % 360;
        let velocity = createVector(Math.cos(this.angle * Math.PI / 180) * this.velocity, Math.sin(this.angle * Math.PI / 180) * this.velocity);
        this.position.x += velocity.x;
        this.position.y += velocity.y;

        if (this.position.x < 0 || this.position.x > game.width || this.position.y < 0 || this.position.y > game.height) {
            return false;
        }

        return true;
    }
}