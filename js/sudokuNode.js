function sudokuNode(val) {
    this.value = val;
    if(val == 0)
        this.posValues = [9,1,1,1,1,1,1,1,1,1];
    else
        this.posValues = [0,0,0,0,0,0,0,0,0,0];

    this.setValue = setValue;
    this.getValue = getValue;
    this.setPossible = setPossible;
    this.setNotPossible = setNotPossible;
    this.isPossible = isPossible;
    this.howManyPossible = howManyPossible;
    this.clearPosValues = clearPosValues;
}

function setPossible(number) {
    if(this.posValues[number] == 0) {
        this.posValues[number] = 1;
        this.posValues[0] += 1;
    }
}

function setNotPossible(number) {
    if(this.posValues[number] == 1) {
        this.posValues[number] = 0;
        this.posValues[0] -= 1;
    }
}

function isPossible(number) {
    return (this.posValues[number] == 1);
}

function howManyPossible() {
    return this.posValues[0];
}

function clearPosValues() {
    for(var i = 0; i < 10; i++) 
        this.posValues[i] = 0;
}

function setValue(value) {
    this.value = value;
}

function getValue() {
    return this.value;
}
