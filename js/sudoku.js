function randomShittyPuzzle() {
    var cell = "";
    var puzzle = genRow();
    
    clearPuzzle();

    for (var i=1; i<10; i++) {
        for (var j=1; j<10; j++) {
            cell = ".r" + i + ".c" + j + " input";
            if (rands() < 3) {
                $(cell).val(puzzle[j-1]);
                $(cell).attr("disabled", "disabled");
            } else if (rands() < 2) {
                $(cell).next().text(rands() + " " + rands());
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

function highlightRow(row, col) {
    clearPuzzleStyles();
    var rowSelector = "#puzzle .r" + row;
    var cellSelector = "#puzzle .r" + row + ".c" + col;
    $(rowSelector).css({
        'color':'#000',
        'background-color':'#9D9EA9',
    });
    $(cellSelector).css('background-color','#B2B0A4');
}

function highlightColumn(row, col) {
    clearPuzzleStyles();
    var colSelector = "#puzzle .c" + col;
    var cellSelector = "#puzzle .c" + col + ".r" + row;
    $(colSelector).css({
        'color':'#000',
        'background-color':'#9D9EA9',
    });
    $(cellSelector).css('background-color','#B2B0A4');
}

function highlightBox(row, col) {
    var box = (Math.ceil(row/3)-1)*3 + Math.ceil(col/3);
    clearPuzzleStyles();
    var boxSelector = "#puzzle .b" + box;
    var cellSelector = "#puzzle .r" + row + ".c" + col;
    $(boxSelector).css({
        'color':'#000',
        'background-color':'#9D9EA9',
    });
    $(cellSelector).css('background-color','#B2B0A4');
}

function clearPuzzleStyles() {
    $("#puzzle td").removeAttr("style");
}

function clearPuzzle() {
    $("#puzzle input").val("").removeAttr("disabled").next().text("");
    clearPuzzleStyles();
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
    $(".hidden").show();
}

function hideButtons() {
    $(".hidden").hide();
}

function displayPuzzle(puz) {
    clearPuzzle();
    $("#puzzle input").each(function(index) {
        var num = puz.value[index];
        if (num != "0") $(this).val(num);

        $(this).next().text(puz.possibles[index]);
        
        if (puz.isDisabled[index]) $(this).attr("disabled","disabled");
    });
    updateButtons();
    updateProgressBar();
}    

function puzzleToObject() {
    var i=0;
    var puz = new Array(81);
    var dis = new Array(81);
    var pos = new Array(81);
    $("#puzzle input").each(function() {
        var num = $(this).val();
        if (num === "") puz[i] = "0";
        else puz[i] = num;

        pos[i] = $(this).next().text();

        dis[i] = $(this).attr("disabled");
        i++;
    });
    return new Puzzle(puz, dis, pos);
}

function savePuzzle(key, puz) {
    try {
        localStorage.setObject(key,puz);
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            alert("No more room for puzzles somehow! I'm sorry!");
        } else alert(e);
    }
    return key;
}

function loadPuzzle(key) {
    var puzzle = localStorage.getObject(key);
    // have to do this to make the thing typeOf Puzzle
    return new Puzzle(puzzle.value, puzzle.isDisabled, puzzle.possibles);
}

function setPossible(row, col, pos) {
    var cellSelector = "#puzzle .r" + row + ".c" + col + " span.possibles";
    $(cellSelector).text(pos);
}

function appendPossible(row, col, pos) {
    var cellSelector = "#puzzle .r" + row + ".c" + col + " span.possibles";
    var cellObj = $(cellSelector)
    var cur = cellObj.text();
    if (cur == null) cellObj.text(pos);
    if (cur < pos) cellObj.text(cur + " " + pos);
    else cellObj.text(pos + " " + cur);
}

function countFilled() {
    var c=0;
    $("#puzzle input").each(function() {
        if ($(this).val() != "") c++;
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

// Puzzle object constructor

function Puzzle(puz, dis, pos) {
    this.value = puz;
    this.isDisabled = dis;
    this.possibles = pos;
}

// localStorage only stores strings. Fuck that.

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key, value) {
    return JSON.parse(this.getItem(key));
}

