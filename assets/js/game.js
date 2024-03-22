Window.Game = {};
(function (Game) {
	// Grab the canvas, which is the part of the screen the game is played in
	let canvas = document.getElementById("game");
	// Retrieve the context of the canvas html element, compare it to taking the image data from an image
	let context = canvas.getContext("2d");
	let scoreText = document.getElementById("score");

	// Startup values
	let frameCounter = 0;
	let acceptInput = true;
	let score = 0;
	let pauze = false;

	// Global variable to represent whether a golden apple is active
	let goldenAppleActive = false;

	// Limits the game speed by reducing the rate at which frames are drawn
	let frameCounterLimit = 18;

	// Set the canvas height and width
	canvas.height = canvas.width = CANVAS_SIZE * CELL_SIZE;

	// random snake colors, applied when ate an apple
	const randomSnakeColor = [
		"tomato",
		"orange",
		"green",
		"white",
		"yellow",
		"white",
		"cyan",
		"blue",
		"pink",
		"hotpink",
		"violet",
		"gray",
		"teal",
	];

	// Game loop
	function loop() {
		// Lets the browser decide when its best to render the game
		requestAnimationFrame(loop);

		// Limits the framerate to reduce game speed
		if (++frameCounter < frameCounterLimit) {
			return;
		}

		frameCounter = 0;
		acceptInput = true;

		// Empty the entire canvas before redrawing all elements
		context.clearRect(0, 0, canvas.width, canvas.height);

		// Modify the snake's currect x and y values by their directional offsets
		if (!pauze) {
			snake.x += snake.dx;
			snake.y += snake.dy;
		}

		// Checks if the snake has reached edge of the screen
		checkEdgeCollision();

		// Draw the apple
		drawApple();

		// Loop over each part of the snake to draw it for the next frame and check for collision with itself
		moveSnake();
	}

	// When the snake reaches a horizontal or vertical edge, wrap it around to the opposite edge
	function checkEdgeCollision() {
		// Check horizontal edges
		if (snake.x < 0) {
			GameOver(); // Call GameOver function when snake hits horizontal edges
		}

		// Check vertical edges
		if (snake.y < 0) {
			GameOver(); // Call GameOver function when snake hits vertical edges
		}

		// Additional checks for negative x and y directions
		if (snake.x >= canvas.width) {
			GameOver();
		}

		if (snake.y >= canvas.height) {
			GameOver();
		}
	}

	function resetGame() {
		pauze = false;
		Window.Utils.DismissModal();
		resetScore();
		resetSnake();
		randomizeApple();

		// reset the frame Count
		frameCounterLimit = 18;
	}

	function GameOver() {
		pauze = true;
		Window.Utils.CreateModal("Game over", "You scored: <i>" + score + "</i> points");
	}

	Game.Reset = resetGame;

	function resetScore() {
		score = 0;
		updateScore();
	}

	// Increase the length of the snake and place the apple at a new location
	function eatApple() {
		// Check if the golden apple should appear
		const isGoldenApple = Math.random() < 0.1; // 10% chance
		if (isGoldenApple) {
			// Increase score by a larger amount
			score += 10; // Increase score by 10 for golden apple
			// Update the score text
			updateScore();
			// Place a golden apple on a random location in the canvas
			randomizeApple(true);
		} else {
			// Increase the snake's length
			snake.length++;
			// Speedup the snake x amount of apple eaten
			frameCounterLimit = frameCounterLimit - 1;
			// Update the score every time the snake ate the apple
			score++;
			// Update the score text
			updateScore();
			// Place a new apple on a random location in the canvas
			randomizeApple();
		}
	}

	// Handles movement, collision and drawing of the snake
	function moveSnake() {
		// Keep track of where snake has been, the front of the array is always the head
		snake.cells.unshift({ x: snake.x, y: snake.y });

		// Remove cells as we move away from them
		if (snake.cells.length > snake.length) {
			snake.cells.pop();
		}

		// Draw each of the snake's cells
		snake.cells.forEach(function (cell, index) {
			// Set the snake's color
			context.fillStyle = snake.color;

			// A cell is a piece of the snake, and the index and the index defines the position in the snake
			context.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);

			// Check if the snake eats an apple
			if (cell.x === apple.x && cell.y === apple.y) {
				eatApple();
			}

			// Check for collision with all cells after the current one to see if the snake collides with itself
			for (var i = index + 1; i < snake.cells.length; i++) {
				// Snake has collided with itself
				if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y && !pauze) {
					GameOver();
				}
			}
		});
	}

	// Updates the score text
	function updateScore() {
		scoreText.textContent = "Score: " + score;
	}

	// Draws the apple on the screen
	function drawApple() {
		context.fillStyle = apple.color;
		context.fillRect(apple.x, apple.y, CELL_SIZE - 1, CELL_SIZE - 1);
	}

	// Draws the golden apple on the screen
	function drawGoldenApple() {
		context.fillStyle = "gold"; // Set color to gold
		context.fillRect(apple.x, apple.y, CELL_SIZE - 1, CELL_SIZE - 1);
	}

	// Listens to keyboard events, used to control the snake
	document.addEventListener("keydown", function (keyBoardEvent) {
		if (false === acceptInput) {
			return;
		}

		// Change direction when the left arrow key is pressed and is not moving on the X axis
		if (keyBoardEvent.which === KEY_LEFT && snake.dx === 0) {
			snake.dx = -CELL_SIZE;
			snake.dy = 0;
			acceptInput = false;
		}
		// Change direction when the up arrow key is pressed and is not moving on the Y axis
		else if (keyBoardEvent.which === KEY_UP && snake.dy === 0) {
			snake.dx = 0;
			snake.dy = -CELL_SIZE;
			acceptInput = false;
		} else if (keyBoardEvent.which === KEY_DOWN && snake.dy === 0) {
			snake.dx = 0;
			snake.dy = CELL_SIZE;
			acceptInput = false;
		} else if (keyBoardEvent.which === KEY_RIGHT && snake.dx === 0) {
			snake.dx = CELL_SIZE;
			snake.dy = 0;
			acceptInput = false;
		}
	});

	// Starts the game
	requestAnimationFrame(loop);
})(Window.Game);
