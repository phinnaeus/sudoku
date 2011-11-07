var cell = "";
var puzzle = genRow();

for (var i=1; i<10; i++) {
    for (var j=1; j<10; j++) {
       if (rands() < 3) {
           cell = ".r" + i + ".c" + j;
           $(cell).text(puzzle[j-1]);
       }       
    }
    if (i%3 == 0) puzzle = offset(puzzle,1);
    puzzle = offset(puzzle,3);
}

// solvers

function singlesInRow() {
    return false;
}

function singlesInColumn() {
    return false;
}

function singlesInBox() {
    return false;
}

function nakedPairInRow() {
    return false;
}

function nakedPairInColumn() {
    return false;
}

function nakedPairInBox() {
    return false;
}

function nakedTripletInRow() {
    return false;
}

function nakedTripletInColumn() {
    return false;
}

function nakedTripletInBox() {
    return false;
}

function hiddenPairInRow() {
    return false;
}

function hiddenPairInColumn() {
    return false;
}

function hiddenPairInBox() {
    return false;
}

function hiddenTripletInRow() {
    return false;
}

function hiddenTripletInColumn() {
    return false;
}

function hiddenTripletInBox() {
    return false;
}

// space for other crap here //

function nukeItFromOrbit() {
    return false;
}

// helpers

function genRow() {
    var puzzle = [7,3,1,8,4,2,9,5,6];
    return shuffle(puzzle);
}

function rands() {
    return Math.floor(Math.random() * 10);
}

function shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function offset(a,m) {
    var len = a.length;
    do {
        var t = a[len-1];
        for (var i=len-1; i>0; i--) {
            a[i] = a[i-1];
        }
        a[0] = t;
        m--;
    } while (m > 0);
    return a;
}
