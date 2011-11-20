function SudokuNode(value) {
    this.value = value;
    this.posValues = [];

    this.setValue = setValue;
    this.getValue = getValue;
}

function SudokuNode() {
    this.value = 0;
    this.posValues = [1,2,3,4,5,6,7,8,9];

    this.setValue = setValue;
    this.getValue = getValue;
}

function setValue(value) {
    this.value = value;
}

function getValue() {
    return value;
}