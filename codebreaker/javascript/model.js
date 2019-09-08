/* 
 * Peg class
 */
function Peg(color, shape) {
    this.color = color;
    this.shape = shape;
	this.src = this.getSrc();
}

// Peg.prototype.color  = ["red", "green", "blue", "magenta", "cyan", "orange", "yellow", "bluegreen", "brown", "darkgreen", "black", "white"];
// Peg.prototype.shape = ["circle", "cross", "square", "star"];

Peg.prototype.getColor = function(){
    return this.color;
}

Peg.prototype.getShape = function(){
    return this.shape;
}

Peg.prototype.getSrc = function(){
    return "images/" + this.color + this.shape + ".gif";
}
/*
 * End Peg class
 */
 
 /*
 * PegContainer class
 */
 function PegContainer(id, peg){
	 this.id = id;
	 this.peg = peg;
 }
 
 PegContainer.prototype.getId = function(){
	 return this.id;
 }
 
 PegContainer.prototype.getPeg = function(){
	 return this.peg;
 }

// /*
 // * Guess class
 // */
// function Guess(){
    // this.row = new Array();
// }

// Guess.prototype.createDeck = function(){
    // for (i = 0; i < 4; i++) {
        // for (j = 0; j < 13; j++) {
            // var c = new Card(i, j); // i = color,  j = value
            // this.deck.push(c);
        // }
    // }
    // return this.deck;
// }

// Pack.prototype.size = function() {
    // return this.deck.length;
// }

// Pack.prototype.clear = function() {
    // this.deck.length = 0;
// }

// Pack.prototype.copyDeck = function(orgdeck){
    // this.deck = orgdeck.slice();
    // return this.deck;
// }

// Pack.prototype.shuffle = function(){
    
    // for (i = 0; i < 1000; i++){
        // for (j = 0; j < this.deck.length; j++) {
            // k = Math.floor(Math.random() * this.deck.length);
            // tmp = this.deck[j];
            // this.deck[j] = this.deck[k];
            // this.deck[k] = tmp;
        // }
    // }
// }

// /*
// * Returns a card. The deck index param corresponds to the div id in the grid table,
// * though the alpha part has been truncated (e.g. "pos23" -> 23).
// */
// Pack.prototype.getCardByDeckIndex = function(index){
    // return this.deck[index];
// }

// Pack.prototype.getCardByPosition = function(y, x){
    // var no = y * 13 + x;
	// return this.deck[no];
// }

// Pack.prototype.getDeckIndexForGridPosition = function(y, x){
	// return y * 13 + x;
// }

// Pack.prototype.pushCard = function(card){
    // this.deck.push(card);
// }

// Pack.prototype.shiftCard = function(){
    // return this.deck.shift();
// }

// Pack.prototype.getParentCard = function(card){
	// var parentCard = new Card(card.getColor(),card.getValue() - 1);
	// return parentCard;	
// }

// Pack.prototype.getDeckIndexForCard = function(color, value, offset){
    // for (i = 0; i < 4; i++) {
        // for (j = 0; j < 13; j++) {
            // var no = i * 13 + j;
            // var c = this.deck[no];
            // if (c.getColor() === color && c.getValue() === value){
                //console.log(c.getColor() + " = " + color + " and " + c.getValue() + " = " + value);
                // return no+offset;    
            // }
        // }
    // }
// }

// Pack.prototype.toggleCard = function(past, present){
    // var tmp = this.deck[past];
    // this.deck[past] = this.deck[present];
    // this.deck[present] = tmp;
// }

// Pack.prototype.removeColorAndValue = function(c, v){
    // for (var i = 0; i < this.deck.length; i++){
        // var card = this.deck[i];
        // var col = card.getColor();
        // var val = card.getValue();
        // if (col == c && val == v) {
            // this.deck.pop(card)
        // }
    // }
//}
/* 
 * End Deck class
 */
