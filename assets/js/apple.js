/**
 * This is the apple object. It contains all the important information for the apple.
 */
let apple = {
	// The apple's initial position (bottom right)
	x: (CANVAS_SIZE - 1) * CELL_SIZE,
	y: (CANVAS_SIZE - 1) * CELL_SIZE,

	// The apple's color
	color: "red",
};

// Get a random integer in a specific range
function getRandomInt(min, max) {
	// Math is a library built into JavaScript. It deals with mathematics that are more complicated than adding or subtracting numbers.
	return Math.floor(Math.random() * (max - min)) + min;
}

// Places the apple at a random location on the canvas

function randomizeApple(isGolden = false) {
	apple.x = getRandomInt(0, CANVAS_SIZE) * CELL_SIZE;
	apple.y = getRandomInt(0, CANVAS_SIZE) * CELL_SIZE;

	// If it's a golden apple, set a different color or perform other visual changes
	if (isGolden) {
		apple.color = "gold"; // Example: Change color to gold
	} else {
		apple.color = "red"; // Example: Default apple color
	}
}
