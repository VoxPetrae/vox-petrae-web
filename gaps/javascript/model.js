/* 
 * Card class
 */
function Card(col, val) {
    this.col = col;
    this.val = val;
}

Card.prototype.swe_color = ["hjärter", "spader", "ruter", "klöver"];
Card.prototype.swe_value  = ["ess", "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio", "knekt", "dam", "kung"];
Card.prototype.eng_color = ["hearts", "spades", "diamonds", "clubs"];
Card.prototype.eng_value  = ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"];
Card.prototype.css_color = ["He", "Sp", "Di", "Cl"];
Card.prototype.css_value  = ["on", "tw", "th", "fo", "fi", "si", "se", "ei", "ni", "te", "ja", "qu", "ki"];

Card.prototype.getColor = function(){
    return this.col;
}

Card.prototype.getValue = function(){
    return this.val;
}

Card.prototype.toString = function(){
    return this.eng_value[this.getValue()] + " of " + this.eng_color[this.getColor()];
}

Card.prototype.forCss = function(){
    return this.css_value[this.getValue()] + "Of" + this.css_color[this.getColor()];
}
/*
 * End Card class
 */

/*
 * Deck class
 */
function Pack(){
    this.deck = new Array();
}

Pack.prototype.createDeck = function(){
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 13; j++) {
            let c = new Card(i, j); // i = color,  j = value
            this.deck.push(c);
        }
    }
    return this.deck;
}

Pack.prototype.size = function() {
    return this.deck.length;
}

Pack.prototype.clear = function() {
    this.deck.length = 0;
}

Pack.prototype.copyDeck = function(orgdeck){
    this.deck = orgdeck.slice();
    return this.deck;
}

Pack.prototype.shuffle = function(){
    
    for (let i = 0; i < 1000; i++){
        for (let j = 0; j < this.deck.length; j++) {
            let k = Math.floor(Math.random() * this.deck.length);
            let tmp = this.deck[j];
            this.deck[j] = this.deck[k];
            this.deck[k] = tmp;
        }
    }
}

/*
* Returns a card. The deck index param corresponds to the div id in the grid table,
* though the alpha part has been truncated (e.g. "pos23" -> 23).
*/
Pack.prototype.getCardByDeckIndex = function(index){
    return this.deck[index];
}

Pack.prototype.getCardByPosition = function(y, x){
    const no = y * 13 + x;
	return this.deck[no];
}

Pack.prototype.getDeckIndexForGridPosition = function(y, x){
	return y * 13 + x;
}

Pack.prototype.pushCard = function(card){
    this.deck.push(card);
}

Pack.prototype.shiftCard = function(){
    return this.deck.shift();
}

Pack.prototype.getParentCard = function(card){
	const parentCard = new Card(card.getColor(),card.getValue() - 1);
	return parentCard;	
}

Pack.prototype.getDeckIndexForCard = function(color, value, offset){
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 13; j++) {
            let no = i * 13 + j;
            let c = this.deck[no];
            if (c.getColor() === color && c.getValue() === value){
                //console.log(c.getColor() + " = " + color + " and " + c.getValue() + " = " + value);
                return no+offset;    
            }
        }
    }
}

Pack.prototype.toggleCard = function(past, present){
    const tmp = this.deck[past];
    this.deck[past] = this.deck[present];
    this.deck[present] = tmp;
}

Pack.prototype.removeColorAndValue = function(c, v){
    for (let i = 0; i < this.deck.length; i++){
        let card = this.deck[i];
        let col = card.getColor();
        let val = card.getValue();
        if (col == c && val == v) {
            this.deck.pop(card)
        }
    }
}
/* 
 * End Deck class
 */
