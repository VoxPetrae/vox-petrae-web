$(document).ready(function(){
	var globals = {};
    globals.deals = 0; // number of deals = 3
    globals.pack = new Pack();
    globals.pack.deck = globals.pack.createDeck();
    globals.cardToMove = null;
    globals.gameOver = false;
    globals.dealOver = false;
    globals.pack.shuffle();
    deal();
	marcConnectedCards();
    utildeals("Deal: " + globals.deals + " of 3");
    utilgaps("Gaps after kings: " + checkForGaps());
    /*
     * Game loop
	 * The flow runs like this (remember that ace means empty/gap):
	 * If mouse click on cell:
	 *   If the cell is marked as destination (i.e. user has clicked on a 2 and then in an empty destination cell at the beginning of a row):
	 *     If it is empty (i.e. contains an ace, this should always be the case):
	 *       If a card with value 2 has been chosen for move (this should always be the case):
	 *         Swap the ace and the card to move.
	 *     Skip to end of turn.
	 *   Else if the cell's card is neither a 2 or an ace (i.e. user has chosen a card to move):
     *      If the card's parent card is followed by an empty cell (ace):
     *         Swap the ace and the card to move (the one in the clicked cell).    	 
	 *   Else if the cell contains a 2 (i.e. user will have to choose a destination cell if there are more than one row with empty first cell):
	 *      If the first cell in any row is empty:
	 *         If the clicked cell is at the first cell in a row:
     *            Show an error message ("You cannot move a 2 that has already been placed at the beginning of a row") .    
	 *         Else if there is only one empty cell in the beginning of any row:
	 *            Move the 2 instantly to the empty cell.
	 *         Else if there are more than one row with empty first cell:
	 *            Mark the empty cells as possible destinations.
	 *            Skip to end of turn.
	*/
    $(".cp").each(function(){
        // $(this).dblclick(function(){
			// console.log("Single click");
		// });
		$(this).click(function(){
			if (globals.gameOver) {
                utilmessage("End of game! Reload the page if you want to start a new game.");
                return;
            }
            if (globals.dealOver) {
                utilmessage("Four gaps after kings and no card to move. Click on 'Redeal' to shuffle and redeal the unsuitable cards.");
                return;
            }
			// Get the id and card for the selected cell
            const htmlId = $(this).attr("id"); // For example "pos25"
            const selectedDeckIndex = htmlId.substring(3); // The card's position in deck
			const selectedCard = globals.pack.getCardByDeckIndex(selectedDeckIndex);
			// If the cell is marked as destination it should be an empty cell in the beginning of a row,
			// and a card with value 2 should have been selected for movement.
			const beginNewRow = $(this).hasClass("markedAsDestination");
			//console.log("Clicked on " + $(this).attr("id") + " which is " + (beginNewRow ? "marked as destination" : "not marked as destination"));
			if (beginNewRow){
				// Get the id for the source card (in this case a 2)
				const sourceDeckIndex = globals.pack.getDeckIndexForCard(globals.cardToMove.getColor(), globals.cardToMove.getValue(), 0);
				moveCard(sourceDeckIndex, selectedDeckIndex);
				// Remove all markers (white borders)
				unmarkCellsMarkedAsDestination();
				checkGameStatus();
			}
			// If the card is not an ace or a 2, it may be possible to move it to an empty (as in ace) position instantly.
			else if (selectedCard.getValue() > 1) { // 0 means ace, 1 means 2
				// Get the selected card's parent card (e.g. five of clubs for six of clubs)  
				const parentCard = globals.pack.getParentCard(selectedCard);
				// console.log("Parent card for " + selectedCard + ": " + parentCard);
				// If the clicked card is not at the beginning of a row: get the card before it
				let precedingCard = new Card();
				if (selectedDeckIndex != 0 && selectedDeckIndex != 13 && selectedDeckIndex != 26 && selectedDeckIndex != 39) {
					precedingCard = globals.pack.getCardByDeckIndex(selectedDeckIndex - 1);
				}
				//console.log("Selected card: " + selectedCard + " with preceding card in grid: " + precedingCard);
				// Make sure that the clicked card's parent and its preceding card in the grid are different
				if (parentCard != precedingCard){
					const destinationDeckIndex = globals.pack.getDeckIndexForCard(parentCard.getColor(), parentCard.getValue(), 1); // The offset param gets the position after the parent card's position		
					//console.log("Position in grid for destination: " + destinationDeckIndex);
					// The destination position cannot be outside the grid and it must be empty (i.e. contain an ace)
					if (destinationDeckIndex != 13 && destinationDeckIndex != 26 && destinationDeckIndex != 39 && destinationDeckIndex != 52 && globals.pack.getCardByDeckIndex(destinationDeckIndex).getValue() == 0){
						// Now we can move the clicked card to its destination. 
						moveCard(selectedDeckIndex, destinationDeckIndex);
						checkGameStatus();
					}
					else {
						//console.log("Card can not be moved");
					}
				}
				// In case the cards are already in suite, nothing should transpire
				else{
					//console.log("Observe: parent card " + parentCard + " is the same as the preceding card " + precedingCard + ", no need to move anything");
				}
			}
			// If the selected card is a 2, it can only be moved to the first cell of a row.
			// If it already is at the beginning of a row, it cannot be moved again.
			else if(selectedCard.getValue() == 1 && checkIfSelectedCellIsAtBeginningOfARow(selectedDeckIndex) && countEmptyFirstCellsInRows() > 0) {
				utilmessage("You cannot move a 2 that has already been placed at the beginning of a row!");
			}
			// If there is only one empty cell to move it, it can be moved instantly.
			else if(selectedCard.getValue() == 1 && countEmptyFirstCellsInRows() == 1){
				//console.log("Selected card is " + selectedCard + ", and there is only one place to put it.")
				const destinationDeckIndex = getDeckIndexForFirstEmptyCellInAnyRow();
				moveCard(selectedDeckIndex, destinationDeckIndex);
				checkGameStatus();
			}
			// If there are more than one row with an empty first cell, the player must choose one.
			else if(selectedCard.getValue() == 1 && countEmptyFirstCellsInRows() > 1) { 
				//console.log("Selected card is " + selectedCard + ", time to choose its destination.")
				// Unmark any previously selected 2:s (except the current one)
				unmarkMarkedCells(selectedCard);
				// Mark the selected card and the possible destination cells
				toggleClass(selectedCard, "unmarked", "marked");
				globals.cardToMove = selectedCard;
				markEmptyFirstCellsInRows();
				utilmessage("Choose which first row cell to move to.");
			}
			// Else, do nothing.
            else {
				utilmessage("That is a nice card.");
            }
            //checkClasses();
        return;
        });
    });
	$("#newDeal").click(function(){
        if (globals.gameOver || globals.deals === 3) {
            utilmessage("No more deals! Reload the page if you want to start a new game.");
            return;
        }
        reorderPack();
        deal();
        globals.dealOver = false;
        utildeals("Deal: " + globals.deals + " of 3");
        // utilgaps("Gaps after kings: " + checkForGaps());
		checkGameStatus();
    });
	$("#presentationLink").click(function(){
		$("#presentation").toggle();
		if ($("#presentation").is(":visible")){
			$("#presentationLink").text("Hide");
		} 
		else{
			$("#presentationLink").text("Info");
		}
	});
	/**
	 * Moves a card from one grid cell to an empty cell
	 * (by "swapping" it with the ace in the empty cell).
	*/
    function moveCard(sourceDeckIndex, destinationDeckIndex){
		// Get the cards
		const sourceCard = globals.pack.getCardByDeckIndex(sourceDeckIndex);
		const destinationCard = globals.pack.getCardByDeckIndex(destinationDeckIndex);
		//console.log("Moving: " + sourceCard + " from " + sourceDeckIndex + " to " + destinationDeckIndex);
		utilmessage("Moving: " + sourceCard + "...");
		// Toggle their indices in the deck
		globals.pack.toggleCard(sourceDeckIndex, destinationDeckIndex)
		// Concatenate the html id strings
		const sourceHtmlId = "#pos" + sourceDeckIndex;
		const destinationHtmlId = "#pos" + destinationDeckIndex;
		// Swap the html classes so that the correct card images are showing.
		$(destinationHtmlId).removeClass("blank").addClass(sourceCard.forCss());
		$(sourceHtmlId).removeClass(sourceCard.forCss()).addClass("blank");
		// If the card is marked (happens in one special case, see "unmarkMarkedCells" function), unmark it
		if ($(sourceHtmlId).hasClass("marked")){
			$(sourceHtmlId).removeClass("marked").addClass("unmarked");
		}
	}
	function checkGameStatus(){
		marcConnectedCards();
		// Update the count for gaps (empty cells following a king)
		const gaps = checkForGaps();
        utilgaps("Gaps after kings: " + gaps);
        //console.log("connected cards: " + countConnectedCards())
		// If there are four gaps after kings, no more moves can be made and the deal is over
        if (gaps == 4) {
			globals.dealOver = true;
            utilmessage("Four gaps after kings! Press redeal button.");
			// If all cards are in suite, the solitaire is won
            if (countConnectedCards() == 48) {
				globals.gameOver = true;
				utilmessage("Hooray! You win!");
				//$("#newDeal").val("New Game");
            }
			// After 3 deals, the solitaire is over
            else if (globals.deals == 3) {
				globals.gameOver = true;
                utilmessage("Sorry! Four gaps after kings and no more deals. Game over.");
				//$("#newDeal").val("New Game");
            }
		}
	}
    /**
     * Counts ordered cards.
     * @return an int with the value
     */
    function countConnectedCards() { //Checked
        let cis = 0;
        for (let i = 0; i < 4; i++) {
            if (globals.pack.getCardByPosition(i, 0).getValue() == 1) { // If the card at the beginning of the row has value 2
                cis++;
                for (let j = 0; j < 11; j++) {
                    const c1 = globals.pack.getCardByPosition(i, j);
                    const c2 = globals.pack.getCardByPosition(i, j + 1);
                    if (c2.getColor() == c1.getColor() && c2.getValue() == c1.getValue() + 1) {
						cis++;
                    } else {
                        break;
                    }
                }
            }
        }
        return cis;
    }
	/**
	 * Marks connected cards (those who are in suite).
	 */
	function marcConnectedCards(){
		// For each row: Check if first cell contains a deuce
		// If not so: Skip to next row
		// If so:
		// Mark it
		// For each column following the first one: Check if the card is in suite with the previous card
		// If not so: Skip to next row
		// If so: Mark it
		for (let i = 0; i < 4; i++) {
			const firstCardInRow = globals.pack.getCardByPosition(i, 0);
            if (firstCardInRow.getValue() == 1) { // If the card at the beginning of the row has value 2
				const pos = globals.pack.getDeckIndexForCard(firstCardInRow.getColor(), firstCardInRow.getValue(), 0);
				markAsInSuite(pos, firstCardInRow.getColor());
                for (let j = 1; j < 12; j++) {
                    const cardToCheck = globals.pack.getCardByPosition(i, j);
                    const precedingCard = globals.pack.getCardByPosition(i, j - 1);
					const cardToCheckColor = cardToCheck.getColor();
					const precedingCardColor = precedingCard.getColor();
                    if (cardToCheckColor == precedingCardColor && cardToCheck.getValue() == precedingCard.getValue() + 1) {
						//console.log(precedingCard.forCss() + " is followed by " + cardToCheck.forCss());
						const pos = globals.pack.getDeckIndexForCard(cardToCheckColor, cardToCheck.getValue(), 0);
						markAsInSuite(pos, cardToCheckColor);
                    } else {
                        break;
                    }
                }
            }
        }
	} 
	/** The "marked" class is used in one case: when a 2 can be moved to more than one cell
	 *  Then the current 2 will be marked with a white border, and the previous 2 (if any) will be unmarked.
	 *  This function seeks out any previous 2:s (should never be more than one) an unmarks them.
	 */
	function unmarkMarkedCells(excludedCard){
		for (let i = 0; i < 52; i++) {
			const cellId = "#pos" + i;
			if ($(cellId).hasClass("marked")){
				const card = globals.pack.getCardByDeckIndex(i);
				if (card !== excludedCard){
					console.log("Remove marked from " + card.toString());
					$(cellId).removeClass("marked").addClass("unmarked");	
				}
			}
        }
	}
	function toggleClass(theCard, classToRemove, classToAdd){
		const pos = globals.pack.getDeckIndexForCard(theCard.getColor(), theCard.getValue(), 0);
		const posInGrid = "#pos" + pos;
		if ($(posInGrid).hasClass(classToRemove)){
			//console.log("marking " + posInGrid);
			$(posInGrid).removeClass(classToRemove).addClass(classToAdd);
		}
	}
	function markAsInSuite(pos, color){
		//console.log("COLOR: " + color);
		const posInGrid = "#pos" + pos;
		const classToRemove = "unmarked";
		if ($(posInGrid).hasClass("unmarked")){
			//console.log("marking " + posInGrid);
			const classToAdd = (isEven(color) ? "redsuite" : "blacksuite");
			$(posInGrid).removeClass(classToRemove).addClass(classToAdd);
		}
	}
	function isEven(n) {
		return n == parseFloat(n)? !(n%2) : void 0;
	}
	/**
	 * Checks for empty first cells in each row
	 */
	function markEmptyFirstCellsInRows(){
		for (let i = 0; i < 4; i++) {
			const card = globals.pack.getCardByPosition(i, 0);
			if (globals.pack.getCardByPosition(i, 0).getValue() == 0) { // If the card at the beginning of the row is an ace (= "empty")
				const pos = globals.pack.getDeckIndexForCard(card.getColor(), card.getValue(), 0);
				const posInGrid = "#pos" + pos;
				//console.log("Empty cell: " + globals.pack.getCardByPosition(i, 0) + ", pos in deck: " + pos + " pos in cell grid: " + posInGrid);
				$(posInGrid).removeClass("unmarked").addClass("markedAsDestination");
			}
		}
	}
	/**
	 * Unmark cells that are marked as destination
	 */
	function unmarkCellsMarkedAsDestination(){
		for (let i = 0; i < 4; i++) {
			const card = globals.pack.getCardByPosition(i, 0);
			const pos = globals.pack.getDeckIndexForCard(card.getColor(), card.getValue(), 0);
			const posInGrid = "#pos" + pos;
			if ($(posInGrid).hasClass("markedAsDestination")){
				//console.log("Unmarking " + posInGrid);
				$(posInGrid).removeClass("markedAsDestination").addClass("unmarked");
			}
		}
	}
	/**
	 * Counts empty first cells in each row
	 */
	function countEmptyFirstCellsInRows(){
		let count = 0;
		for (let i = 0; i < 4; i++) {
			const card = globals.pack.getCardByPosition(i, 0);
			if (globals.pack.getCardByPosition(i, 0).getValue() == 0) { // If the card at the beginning of the row is an ace (= "empty")
				count++;
			}
		}
		return count;
	}
	/**
	 * Gets the first empty cell in any row
	 */
	function getDeckIndexForFirstEmptyCellInAnyRow(){
		for (let i = 0; i < 4; i++) {
			const card = globals.pack.getCardByPosition(i, 0);
			if (globals.pack.getCardByPosition(i, 0).getValue() == 0) { // If the card at the beginning of the row is an ace (= "empty")
				return globals.pack.getDeckIndexForGridPosition(i, 0);
			}
		}
		return -1;
	}
	/**
	 * Checks if the position of a selected cell is at the beginning of a row.
	 * This matters since a 2 in the first cell of a row cannot be moved. 
	 */
	function checkIfSelectedCellIsAtBeginningOfARow(selectedPosition){
		if (selectedPosition == 0 || selectedPosition == 13 || selectedPosition == 26 || selectedPosition == 39){
			return true;
		}
		return false;
	}
    function reorderPack() {
        const connected = new Pack();
        const unconnected = new Pack();
        let suited = false;
        
        for (let i = 0; i < 4; i++) {
            if (globals.pack.getCardByPosition(i, 0).getValue() == 1) { // If the card at the beginning of the row has value 2
               suited =  true; 
                connected.pushCard(globals.pack.getCardByPosition(i, 0))
                for (let j = 0; j < 12; j++) {
                    const c1 = globals.pack.getCardByPosition(i, j);
                    const c2 = globals.pack.getCardByPosition(i, j + 1);
                    if (suited && c2.getColor() == c1.getColor() && c2.getValue() == c1.getValue() + 1) {
                        connected.pushCard(c2);
                        } else {
                        unconnected.pushCard(c2);
                        connected.pushCard(null);
                        suited = false;
                    }
                }
             }
             else {
                 for (let j = 0; j < 13; j++) {
                     unconnected.pushCard(globals.pack.getCardByPosition(i, j))
                     connected.pushCard(null);
                 }
             }
        }
        unconnected.shuffle();
        // Empty the deck and fill it with unnconnected and connected cards
        globals.pack.clear();
        
        for (let i = 0; i < connected.size(); i++) {
            if (connected.getCardByDeckIndex(i) == null) {
                const tmpc = unconnected.shiftCard();
                globals.pack.pushCard(tmpc);
            }
            else {
                globals.pack.pushCard(connected.getCardByDeckIndex(i));
            }
        }
    }
    
    function deal() {
        let pos = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 13; j++) {
                const c = globals.pack.getCardByDeckIndex(pos);
                //console.log(c.forCss());
                if (c.getValue() == 0) {
                    $("#pos" + pos++).attr("class", "cp unmarked blank")
                }
                else {
                    $("#pos" + pos++).attr("class", "cp unmarked " + c.forCss())
                }
            }
        }
        removeAces();
        globals.cardToMove = null;
        globals.deals++;
        utilmessage("G-A-P-S");
    }
    function removeAces() {
        $(".OnOfHe").removeClass("OnOfHe").addClass("blank");
        $(".OnOfSp").removeClass("OnOfSp").addClass("blank");
        $(".OnOfDi").removeClass("OnOfDi").addClass("blank");
        $(".OnOfCl").removeClass("OnOfCl").addClass("blank");
    }
    function checkForGaps() {
		//console.log("Commencing gap check...")
        let gak = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 13; j++) {
                if (globals.pack.getCardByPosition(i, j).getValue() == 12) { // If the card at the given position is a king
					//console.log("Am now at a king: " + globals.pack.getCardByPosition(i, j))
                    let k = j + 1; // k refers to the position after the king
                    while (k < 13 && globals.pack.getCardByPosition(i, k).getValue() == 0) { // k should be less than 13 (not outside the row)
						//console.log("A gap!");
                        gak++;
                        k++;
                    }
                }
            }
        }
        return gak;
    }
    function checkClasses(){
        $("#checkClasses").empty();
        $(".cp").each(function(){
            $("#checkClasses").append("<li>" + $(this).attr("class") + "</li>");
        });
    } 
    function utilmessage(content) {
        $("#message").text(content);
    }
	function debugmessage(content){
		$("#debug").text(content);
	}
    function errormessage(content) {
        if (globals.dealOver) {
            $("#message").text("Fyra luckor efter kung!");
        }
        else {
            $("#message").text(content);
        }
    }
    function utildeals(content) {
        $("#deals").text(content);
    }
    function utilgaps(content) {
        $("#gaps").text(content);
    }
    function utilclone(obj) {
		for (let i in obj) {
			if (typeof obj[i] == 'object') {
				this[i] = new utilclone(obj[i]);
			}
			else {
				this[i] = obj[i];
			}
		}
	}
});

