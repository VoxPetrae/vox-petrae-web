/** When user clicks on the game button */
function buttonClicked(){
	if (game.gameOver)
		return false;
	const checkReady = allPegholesAreUsed();
	if (!checkReady){
		setMessage("YOU MUST PLACE PEGS IN ALL PEG HOLES");
	}
	else{
		const black = checkGuess();
		game.guessIndex++;
		if (checkIfGameIsOver(black)){
			showSolution();
			game.gameOver = true;
		}
		else {
			placeMarker();
			if (getMessage().includes("ALL PEG HOLES"))
				setMessage("BREAK THE CODE");
		}
	}
}
/** When user clicks on a colored shape in the peg selector table.
The selected peg should replace the current marker.
The marker should be moved to the first empty peg hole in the guess row (unless there are no empty peg holes to mark). */
function pegSelectorClicked(){
	if (game.gameOver)
		return false;
	const img = this.querySelector("img");
	const selectedPegSrc = img.src;
	// There must be a marked peg hole in the guess row to set the selected peg
	if (game.markedId != "" && !allPegholesAreUsed()){
		const titleText = getColor(selectedPegSrc) + " " + getShape(selectedPegSrc);
		setImage(game.markedId, selectedPegSrc, titleText);
		// There must be an empty peghole to set a new marker
		if (findFirstEmptyPegHoleInRow() !== ""){
			placeMarker();	
		}
	}
}
/** When user clicks on a peg hole or placed peg in the guess table.
The clicked peg (or hole) should be replaced by a marker.
The old marker should be replaced by a peg hole.*/
function guessClicked(){
	if (game.gameOver)
		return false;
	const img = this.querySelector("img");
	const markY = this.id.split("-")[0];
	// If the peg is on the current guess row... 
	if (markY.toString() === game.guessIndex.toString()){
		// ... and is not a marker, then mark it
		if (!img.src.includes("images/mark.png")){
			setImage(this.id, "images/mark.png", "marker");
			// If there already is a marker on the guess row, then replace it with an empty peg hole
			const lastMarkedSrc = document.getElementById(game.markedId).querySelector("img").src;
			if (lastMarkedSrc.includes("images/mark.png")){
				setImage(game.markedId, "images/empty.png", "empty");	
			}
			// Update the marked id						
			game.markedId = this.id;
		}
	}
}
/** "Meta" function for toggling the info area */
function infoClicked(){
	const presentationArea = document.getElementById("presentation");
	const styles = window.getComputedStyle(presentationArea);
	const display = styles.getPropertyValue("display");
	if (display === "none"){
		presentationArea.style.display = "block";
		this.innerHTML = "Hide";
	}
	else{
		presentationArea.style.display = "none";
		this.innerHTML = "Info";
	}
}