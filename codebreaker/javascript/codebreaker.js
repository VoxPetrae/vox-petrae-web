// Let's skip JQuery this time. And no OO stuff, just DOM manipulation and simple logic.
/** Globals */
var game = {};
game.markedId = "0-0"; // The id of the marked position in the guess table, e.g. "[Y]-[X]" where Y is the vertical row and X the horizontal column
game.guessIndex = 0; // The index of the current guess (corresponding to the index of the vertical row)
game.codeToCrack = []; // The image names for the 6 solution pegs (e.g. "images/red.png")
game.gameOver = false;
setUp();
placeMarker();

// Sets the marker at the next empty position on the guess bar
function placeMarker(){
	const emptyId = findFirstEmptyPegHoleInRow();
	if (emptyId !== ""){
		setImage(emptyId, "images/mark.png", "marker");
		game.markedId = emptyId;
	}
}
// Finds the peg hole where to a marker should be moved after a guess has been made
function findFirstEmptyPegHoleInRow(){
	let id = "";
	for (let i = 0; i < 6; i++){
		let current = game.guessIndex + "-" + i;
		const img = getImageFromElement(current);
		if (img.src.includes("images/empty.png")){
			id = current;
			break;
		}
	}
	return id;
}
/** Checks if all guess pegs are set (i.e. no empty peg holes in the guess bar) */
function allPegholesAreUsed(){
	let ready = true;
	for (let i = 0; i < 6; i++){
		let guessId = game.guessIndex + "-" + i;
		const img = getImageFromElement(guessId);
		if (img.src.includes("images/mark.png") || img.src.includes("images/empty.png")){
			ready = false;
			break;
		}
	}
	return ready;
}
/** Compares the guess with the solution and creates feedback pegs */
function checkGuess(){
	// Create a guess array to compare with the solution
	const guessedCode = [];
	for (let i = 0; i < 6; i++){
		const guessId = game.guessIndex + "-" + i;
		const guessSrc = getImageFromElement(guessId).src;
		guessedCode.push(guessSrc);
	}
	
	// Denote pegs that are already checked
	let used1 = new Array(6).fill(false);
	let used2 = new Array(6).fill(false);
	
	// Feedback pegs
	let black = 0; 
	let white = 0;
	let blackWhite = 0;
	let whiteBlack = 0;
	
	// Check for right color, right position, right shape
	for (let i = 0; i < 6; i++){
		if (getColor(guessedCode[i]) === getColor(game.codeToCrack[i]) && getShape(guessedCode[i]) === getShape(game.codeToCrack[i])){
			black++;
			used1[i] = true;
			used2[i] = true;
		}
		// Check for right color, right position, wrong shape
		else if (getColor(guessedCode[i]) === getColor(game.codeToCrack[i]) && getShape(guessedCode[i]) !== getShape(game.codeToCrack[i])){
			blackWhite++;
			used1[i] = true;
			used2[i] = true;
		}
	}
	// Check for right color, right shape, wrong position
	for (let i = 0; i < 6; i++){
		if (!used1[i]){
			for (let j = 0; j < 6; j++){
				if (getColor(guessedCode[i]) === getColor(game.codeToCrack[j]) && getShape(guessedCode[i]) === getShape(game.codeToCrack[j]) && !used2[j]){
					white++;
					used1[i] = true;
					used2[j] = true;
					break;
				}
			}
		}
	}
	// Check for right color, wrong shape, wrong position
	for (let i = 0; i < 6; i++){
		if (!used1[i]){
			for (let j = 0; j < 6; j++){
				if (getColor(guessedCode[i]) === getColor(game.codeToCrack[j]) && getShape(guessedCode[i]) !== getShape(game.codeToCrack[j]) && !used2[j]){
					whiteBlack++;
					used2[j] = true;
					break;
				}
			}
		}
	}
	showHint(black, blackWhite, white, whiteBlack);
	return black;
}
/** Checks if player has cracked the code or is out of guesses */
function checkIfGameIsOver(black){
	if (black === 6){
		playAudio("winSound");
		setMessage("GREAT CODE BREAKING!");
	}
	else if (game.guessIndex === 12){
		playAudio("looseSound");
		setMessage("WELL, AT LEAST YOU TRIED");
	}
	else {
		return false;
	}
	return true;
}
/** Plays an audio file on winning or loosing */
function playAudio(audioId){
	var sound = document.getElementById(audioId); 
	sound.play();
}
/** Gets the message on the message row */
function getMessage(){
	return document.getElementById("messageCell").innerHTML.toString();
}
/** Writes a message on the message row */
function setMessage(msg){
	document.getElementById("messageCell").innerHTML = msg;
}
/** Draws the hint pegs on the feedback row */
function showHint(black, blackWhite, white, whiteBlack){
	for (let i = 0; i < black; i++){
		let hintId = game.guessIndex + "_" + i;
		let imgSrc = "images/black.png";
		setImage(hintId, imgSrc, "Correct color, correct position, correct shape");
	}
	
	for (let i = black; i < black + blackWhite; i++){
		let hintId = game.guessIndex + "_" + i;
		let imgSrc = "images/black-white.png";
		setImage(hintId, imgSrc, "Correct color, correct position, wrong shape");
	}
	
	for (let i = black + blackWhite; i < black + blackWhite + white; i++){
		let hintId = game.guessIndex + "_" + i;
		let imgSrc = "images/white.png";
		setImage(hintId, imgSrc, "Correct color, wrong position, correct shape");
	}
	
	for (let i = black + blackWhite + white; i < black + blackWhite + white + whiteBlack; i++){
		let hintId = game.guessIndex + "_" + i;
		let imgSrc = "images/white-black.png";
		setImage(hintId, imgSrc, "Correct color, wrong position, wrong shape");
	}
}
/** Draws the correct pegs on the solution row */
function showSolution(){
	for (let [index, imgSrc] of game.codeToCrack.entries()) {
		getColor(imgSrc);
		const solCellId = "solution" + index;
		const titleText = getColor(imgSrc) + " " + getShape(imgSrc);
		setImage(solCellId, imgSrc, titleText);		
	}
}
/** Sets the image source for an element */
function setImage(elemId, imgSrc, titleText){
	const position = document.getElementById(elemId);
	const img = position.firstElementChild;
	img.src = imgSrc;
	img.setAttribute("title", titleText)
}
/** Returns the image for a given element */
function getImageFromElement(id){
	const elem = document.getElementById(id);
	const img = elem.querySelector("img");
	return img;
}
/** Returns the color for a given image */
function getColor(imgSrc){
	const pegName = getPegName(imgSrc);
	return pegName.split("-")[0];
}
/** Returns the shape for a given image */
function getShape(imgSrc){
	const pegName = getPegName(imgSrc);
	return pegName.split("-")[1];
}
/** Returns the descriptive part of the filename */
function getPegName(imgSrc){
	const path = imgSrc.toString();
	const filename = path.split("/").pop();
	return filename.split(".")[0];
}
/** Gets all the pegs for the peg selector area */
function getPegSelectorRowImages(index){
	let pickUrls = [];
	switch(index){
		case 0:
			pickUrls = ["images/red-circle.png", "images/red-cross.png", "images/red-square.png", "images/red-star.png"];
			break;
		case 1:
			pickUrls = ["images/green-circle.png", "images/green-cross.png", "images/green-square.png", "images/green-star.png"];
			break;
		case 2:
			pickUrls = ["images/blue-circle.png", "images/blue-cross.png", "images/blue-square.png", "images/blue-star.png"];
			break;
		case 3:
			pickUrls = ["images/magenta-circle.png", "images/magenta-cross.png", "images/magenta-square.png", "images/magenta-star.png"];
			break;
		case 4:
			pickUrls = ["images/cyan-circle.png", "images/cyan-cross.png", "images/cyan-square.png", "images/cyan-star.png"];
			break;
		case 5:
			pickUrls = ["images/orange-circle.png", "images/orange-cross.png", "images/orange-square.png", "images/orange-star.png"];
			break;
		case 6:
			pickUrls = ["images/yellow-circle.png", "images/yellow-cross.png", "images/yellow-square.png", "images/yellow-star.png"];
			break;
		case 7:
			pickUrls = ["images/grey-circle.png", "images/grey-cross.png", "images/grey-square.png", "images/grey-star.png"];
			break;
		case 8:
			pickUrls = ["images/brown-circle.png", "images/brown-cross.png", "images/brown-square.png", "images/brown-star.png"];
			break;
		case 9:
			pickUrls = ["images/darkgreen-circle.png", "images/darkgreen-cross.png", "images/darkgreen-square.png", "images/darkgreen-star.png"];
			break;
		case 10:
			pickUrls = ["images/black-circle.png", "images/black-cross.png", "images/black-square.png", "images/black-star.png"];
			break;
		case 11:
			pickUrls = ["images/white-circle.png", "images/white-cross.png", "images/white-square.png", "images/white-star.png"];
			break;
	}
	return pickUrls;	
}