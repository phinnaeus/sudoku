// Tyler
// Chris
//
function randomShittyPuzzle() {
    var cell = "";
    var puzzle = genRow();
    
    clearPuzzle();

    for (var i=1; i<10; i++) {
        for (var j=1; j<10; j++) {
            if (rands() < 3) {
                cell = ".r" + i + ".c" + j + " input";
                $(cell).val(puzzle[j-1]);
                $(cell).attr("disabled", "disabled");
            }       
        }
        if (i%3 == 0) puzzle = offset(puzzle,1);
        puzzle = offset(puzzle,3);
    }
    updateButtons();
    updateProgressBar();
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

//TODO: for each of the highlight methods, pass just row and column of cell.
//      figure out the rest through magic.
function highlightRow(row, cell) {
    clearTableStyles();
    var rowSelector = "#puzzle .r" + row;
    var cellSelector = "#puzzle .r" + row + ".c" + cell;
    $(rowSelector).css({
        'color':'#000',
        'background-color':'#9D9EA9',
    });
    $(cellSelector).css('background-color','#B2B0A4');
}

function highlightColumn(col, cell) {
    clearTableStyles();
    var colSelector = "#puzzle .c" + col;
    var cellSelector = "#puzzle .c" + col + ".r" + cell;
    $(colSelector).css({
        'color':'#000',
        'background-color':'#9D9EA9',
    });
    $(cellSelector).css('background-color','#B2B0A4');
}

function highlightBox(box, row, col) {
    clearTableStyles();
    var boxSelector = "#puzzle .b" + box;
    var cellSelector = "#puzzle .r" + row + ".c" + col;
    $(boxSelector).css({
        'color':'#000',
        'background-color':'#9D9EA9',
    });
    $(cellSelector).css('background-color','#B2B0A4');
}

function clearTableStyles() {
    $("#puzzle td").removeAttr("style");
}

function clearPuzzle() {
    $("#puzzle input").val("").removeAttr("disabled");
    updateButtons();
    updateProgressBar();
}

function updateButtons() {
    var data = countFilled();
    if (data > 0) {
        showButtons();
    } else hideButtons();
}

function showButtons() {
    $("#leftMenu button.hidden, #rightMenu button.hidden").show();
}

function hideButtons() {
    $("#leftMenu button.hidden, #rightMenu button.hidden").hide();
}

function displayPuzzle(arrPuz) {
    clearPuzzle();
    var cell,value;
    for (var i=1; i<10; i++) {
        for (var j=1; j<10; j++) {
            cell = ".r" + i + ".c" + j + " input";
            value = arrPuz[(i*j)-1];
            if (value != "0")
                $(cell).val(arrPuz[(i*j)-1]);
        }
    }
    updateButtons();
    updateProgressBar();
}


function puzzleToArray() {
    var i=0;
    var puz = new Array(81);
    $("#puzzle input").each(function() {
        if (this.value === "") puz[i] = "0";
        else puz[i] = this.value;
        i++;
    });
    return puz;
}

//TODO: save disabled or not (separate array, 1 if disabled 0 if editable)
//      implement possibles, (array of strings for each cell)
function savePuzzle(key, puz) {
    try {
        localStorage.setItem(key,puz);
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            alert("No more room for puzzles somehow! I'm sorry!");
        }
    }
    return key;
}

function loadPuzzle(key) {
    var puzzle = localStorage.getItem(key);
    return puzzle.split(',');
}

function countFilled() {
    var c=0;
    $("#puzzle input").each(function() {
        if (this.value != "") c++;
    });
    return c;
}

function updateProgressBar() {
    var c = countFilled();
    $("progress.puzzleInfo").val(c);
    return c;
}

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
