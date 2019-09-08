/** Sets up the GUI */
function setUp(){
	const gameBoard = document.getElementById("gameBoard");
	const gameTable = document.createElement("table");
	gameTable.id = "gameTable";
	const topRow = gameTable.insertRow(-1);
	// The solution pattern
	const solutionCell = topRow.insertCell(-1);
	const solutionPegTable = createSolutionPegTable();
	solutionCell.appendChild(solutionPegTable);
	solutionCell.id = "solutionCell";
	// The game button
	const buttonCell = topRow.insertCell(-1);
	buttonCell.colSpan = 2;
	buttonCell.id = "buttonCell";
	const modalButton = document.createElement("button");
	modalButton.appendChild(document.createTextNode("CHECK"));
	modalButton.id = "modalButton";
	modalButton.type = "button";
	buttonCell.appendChild(modalButton);
	// The guess area
	for (let i = 11; i >= 0; i--) {
		// Guess pegs
		const guessRow = gameTable.insertRow(-1);
		const guessCell = guessRow.insertCell(-1);
		guessCell.className = "guessCell";
		// Create a nested table with six peg holes for the guess.
		const guessPegTable = createGuessPegTable(i);
		guessCell.appendChild(guessPegTable);
		// Feedback pegs
		const feedbackCell = guessRow.insertCell(-1);
		feedbackCell.className = "feedbackCell";
		const feedbackPegTable = createFeedbackPegTable(i);
		feedbackCell.appendChild(feedbackPegTable);
		// Peg selector (shape and color)
		const selectorCell = guessRow.insertCell(-1);
		selectorCell.className = "selectorCell";
		const PegSelectorTable = createPegSelectorTable(i);
		selectorCell.appendChild(PegSelectorTable);
	}
	const messageRow = gameTable.insertRow(-1);
	const messageCell = messageRow.insertCell(-1);
	messageCell.colSpan = 3;
	messageCell.id = "messageCell";
	gameBoard.appendChild(gameTable);
	modalButton.addEventListener("click", buttonClicked, false);
	createCode();
	//showSolution(); // just for testing
	setMessage("BREAK THE CODE");
	// Meta code for info area
	const presentationArea = document.getElementById("presentation");
	presentationArea.style.display = "none";
	const infoLink = document.getElementById("presentationLink");
	infoLink.addEventListener("click", infoClicked, false);
}
/** Creates a nested table with six question marks for the hidden solution */
function createSolutionPegTable(){
	const imgUrls = ["images/qmark.png", "images/qmark.png", "images/qmark.png", "images/qmark.png", "images/qmark.png", "images/qmark.png"];
	const table = document.createElement("table");
	const row = table.insertRow(-1);
	for (let [index, url] of imgUrls.entries()) {
		const cell = row.insertCell(-1);
		cell.id = "solution" + index;
		cell.appendChild(loadImage(url));
	}
	return table;
}
/** Creates a table for the guess with an unique id for each row/cell combination */
function createGuessPegTable(yIndex){
	const emptyUrls = ["images/empty.png", "images/empty.png", "images/empty.png", "images/empty.png", "images/empty.png", "images/empty.png"];
	const table = document.createElement("table");
	const row = table.insertRow(-1);
	for (let [xIndex, url] of emptyUrls.entries()) {
		const cell = row.insertCell(-1);
		cell.id = yIndex + "-" + xIndex;
		cell.appendChild(loadImage(url));
		cell.addEventListener("click", guessClicked, false);
	}
	return table;
}
/** Creates a table for the feedback with an unique id for each row/cell combination */
function createFeedbackPegTable(feedbackIndex){
	const feedbackUrls = ["images/empty2.png", "images/empty2.png", "images/empty2.png", "images/empty2.png", "images/empty2.png", "images/empty2.png"];
	const table = document.createElement("table");
	let pegIndex = 0;
	for (let i = 0; i < 2; i++){
		const row = table.insertRow(-1);
		for (let j = 0; j < 3; j++){
			const cell = row.insertCell(-1);
			cell.id = feedbackIndex + "_" + pegIndex; // Underscore instead of hyphen to differ from guess cell id
			cell.appendChild(loadImage(feedbackUrls[pegIndex]));
			pegIndex++;
		}
	}
	return table;
}
/** Creates a table for the peg selector with an unique id for each row/cell combination */
function createPegSelectorTable(selectorIndex){
	const table = document.createElement("table");
	const row = table.insertRow(-1);
	const imgUrls = getPegSelectorRowImages(selectorIndex);
	for (let [pegIndex, url] of imgUrls.entries()) {
		const cell = row.insertCell(-1);
		cell.id = selectorIndex + ":" + pegIndex;
		cell.appendChild(loadImage(url));
		cell.addEventListener("click", pegSelectorClicked, false);
	}
	return table;
}
/** Creates a random code for the player to guess
and adds the corresponding images to the codeToCrack array */
function createCode(){
	for (let i = 0; i < 6; i++){
		let y = Math.floor(Math.random() * 12);	
		let x = Math.floor(Math.random() * 4);
		let yxId = y + ":" + x;
		const imgSrc = document.getElementById(yxId).querySelector("img").src;
		game.codeToCrack.push(imgSrc);
	}
}
/** Returns a new image with the given src */
function loadImage(url){
	const img = document.createElement("img");
	img.src = url;
	return img;
}

