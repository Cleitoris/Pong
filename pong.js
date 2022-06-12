var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

window.onload= () => {
	gameLoop();
}

function gameLoop() {
	setInterval(show, 1000/30);
}

function show() {
	update();
	draw();
}

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ball.move();
	ball.checkHorizontalWalls();
	playerLeft.checkBallCollision();
	playerRight.checkBallCollision();
	checkGoal();
}

function draw() {
	createRect(0, 0, canvas.width, canvas.height, 'black') // Background

	createRect(ball.x, ball.y, ball.size, ball.size, 'white') // Balle

	createRect(playerLeft.x, playerLeft.y, playerLeft.width, playerLeft.height); // Player left
	createRect(playerRight.x, playerRight.y, playerRight.width, playerRight.height); // Player right

	createText(playerLeft.score, 40);
	createText(playerRight.score, canvas.width - 120);
}

function createRect(x, y, width, height, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}

function createText(score, x) {
	ctx.font = "20px Arial"
	ctx.fillStyle = "white"
	ctx.fillText("Score : " + score, x, 18)
}

function checkGoal() {
	if (ball.x < 0 ) {
		playerRight.score++;
		ball = new Ball(-ball.deltaX);
	} else if (ball.x > canvas.width - ball.size) {
		playerLeft.score++;
		ball = new Ball(-ball.deltaX);
	}
}

class Ball {
	constructor(deltaX) {
		this.size = 20;
		this.x = (canvas.width / 2) - (this.size / 2);
		this.y = 0;
		this.deltaX = deltaX; // -1 pour aller vers la gauche, +1 pour aller vers la droite
		this.deltaY =  Math.random() / 2 + 0.25; // entre 0.25 et 0.75 pour regler aléatoirement l'inclinaison de départ
	}

	move() {
		const ballMoveSpeed = 5; // 5 pixels par tick

		this.x = this.x + ballMoveSpeed * this.deltaX;
		this.y = this.y + ballMoveSpeed * this.deltaY;
	}

	checkHorizontalWalls() {
		if (this.y < 0 || this.y > canvas.height - this.size) {
			this.deltaY = -this.deltaY;
		}
	}
}

class Pad {
	constructor(x, keyCodeUp, keyCodeDown) {
		this.width = 20;
		this.height = 100;
		this.x = x;
		this.y = (canvas.height / 2) - (this.height / 2);
		this.keyCodeUp = keyCodeUp;
		this.keyCodeDown = keyCodeDown;
		this.score = 0;
	}

	checkBallCollision() {
		if ((ball.x < this.x + this.width && ball.x > this.x)  // Côté gauche de la balle
			|| (ball.x + ball.size < this.x + this.width && ball.x + ball.size > this.x)) { // Côté droit de la balle

			const ballHeightCenter = ball.y + (ball.size / 2)
			if (ballHeightCenter > this.y && ballHeightCenter < this.y + this.height) {  // Hauteur de la balle par rapport à la raquette
				ball.deltaX = -ball.deltaX;	
			}
		}
	}
}

window.addEventListener('keydown', (event) => {
	const padMoveSpeed = 10; // 10 pixels par tick

	if (event.keyCode == playerLeft.keyCodeUp && playerLeft.y > 0) {
		playerLeft.y = playerLeft.y - padMoveSpeed;
	} else if (event.keyCode == playerLeft.keyCodeDown && (playerLeft.y + playerLeft.height) < canvas.height) {
		playerLeft.y = playerLeft.y + padMoveSpeed;
	}

	if (event.keyCode == playerRight.keyCodeUp && playerRight.y > 0) {
		playerRight.y = playerRight.y - padMoveSpeed;
	} else if (event.keyCode == playerRight.keyCodeDown && (playerRight.y + playerRight.height) < canvas.height) {
		playerRight.y = playerRight.y + padMoveSpeed;
	}
})

var ball = new Ball(-1);
var playerLeft = new Pad(40, 90, 83);
var playerRight = new Pad(canvas.width - 60, 38, 40);