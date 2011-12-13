function sudokuNode(val) {
    this.value = val;
    if(val == 0)
        this.posValues = [9,true,true,true,true,true,true,true,true,true];
    else
        this.posValues = [0,false,false,false,false,false,false,false,false,false];

    this.setValue = setValue;
    this.getValue = getValue;
    this.setPossible = setPossible;
    this.setNotPossible = setNotPossible;
    this.isPossible = isPossible;
    this.howManyPossible = howManyPossible;
    this.clearPosValues = clearPosValues;
    this.getPosValues = getPosValues;
}

function setPossible(number) {
    if(this.posValues[number] === false) {
        this.posValues[number] = true;
        this.posValues[0] += 1;
    }
}

function setNotPossible(number) {
    if(this.posValues[number] === true) {
        this.posValues[number] = false;
        this.posValues[0] -= 1;
    }
}

function getPosValues() {
    return this.posValues.slice(1);
}

function isPossible(number) {
    return (this.posValues[number] === true);
}

function howManyPossible() {
    return this.posValues[0];
}

function clearPosValues() {
    for(var i = 0; i < 10; i++) 
        this.posValues[i] = false;
}

function setValue(value) {
    this.value = value;
}

function getValue() {
    return this.value;
}
