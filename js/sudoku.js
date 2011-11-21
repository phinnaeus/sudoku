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

// test puzzles

function puzToDisArray(puz) {
    var dis = new Array(81);
    for (var i=0; i<81; i++) {
        dis[i] = false;
        if (puz[i] != "0") dis[i] = true;
    }
    return dis;
}

function loadTestMenu() {
    var tests = new testPuzzle();

    $("#testSelect").show();
    var options = {
        "challenging111":"",
        "fiendish017":"",
        "fiendish017":"",
        "fiendish100":"",
        "fiendish101":"",
        "fiendish102":"",
        "fiendish103":"",
        "fiendish104":""
    }

    $.each(options, function(key,value) {
        $("#testSelect").append($("<option></option>").attr("value", key).text(key));
    });

    $("#testSelect").change(function () {
        var puzId = $(this).val();
        displayPuzzle(eval(tests.puzId));
    });
}

function testPuzzle() {
    var posArr = new Array(81);
    for (var i=0; i<81; i++) posArr[i] = "";
    
    var p111 = "507100008000006005602500003200390000009080100000061002900008301100200000700003506".split("");
    this.challenging111 = new Puzzle(p111,puzToDisArray(p111),posArr);

    var p017 = "070006900006007820200005006030040000001602700000070010600200004028700300003500080".split("");
    this.fiendish017 = new Puzzle(p017,puzToDisArray(p017),posArr);

    var p071 = "007040600000900010209100500000600080006703400030001000008006304090002000003090271".split("");
    this.fiendish071 = new Puzzle(p071,puzToDisArray(p071),posArr);

    var p100 = "400000230500070000060009004030507800020030050007806010200900080000010002093000001".split("");
    this.fiendish100 = new Puzzle(p100,puzToDisArray(p100),posArr);

    var p101 = "201080003000507020008000000082100000009408100000005290000000300010709000900010507".split("");
    this.fiendish101 = new Puzzle(p101,puzToDisArray(p101),posArr);

    var p102 = "000900030600030000005680240780000001009000600100000094046027900000060005050008000".split("");
    this.fiendish102_ = new Puzzle(p102,puzToDisArray(p102),posArr);

    var p103 = "054800000600007000030040008200004080580030046090600002300080050000200003000003810".split("");
    this.fiendish103 = new Puzzle(p103,puzToDisArray(p103),posArr);

    var p104 = "200009000000070098050810004000040900900267001002080000700054080530090000000100007".split("");
    this.fiendish104 = new Puzzle(p104,puzToDisArray(p104),posArr);

    var p105 = "004001006000500048069008000013900000700000004000007310000300490920006000400700200".split("");
    this.fiendish105 = new Puzzle(p105,puzToDisArray(p105),posArr);

    var p106 = "306000490000605002080004003060007240000000000018300050100500080600803000024000605".split("");
    this.fiendish106 = new Puzzle(p106,puzToDisArray(p106),posArr);

    var p107 = "500103400000025709000000801050000608000407000203000010406000000301560000725901006".split("");
    this.fiendish107 = new Puzzle(p107,puzToDisArray(p107),posArr);

    var p108 = "980020010400003000300800072030040000200301007000090030170002006000400009040030081".split("");
    this.fiendish108 = new Puzzle(p108,puzToDisArray(p108),posArr);

    var p109 = "109020050870000000240306000050001000004030500000900020000509082000000061090070405".split("");
    this.fiendish109 = new Puzzle(p109,puzToDisArray(p109),posArr);

    var p110 = "006000405000640009200090360513020800000000000008030951072050004100079000309000500".split("");
    this.fiendish110 = new Puzzle(p110,puzToDisArray(p110),posArr);

    var p044 = "060003820004000600005640003020009000008000200000800010500067400001000500072500030".split("");
    this.hard044 = new Puzzle(p044,puzToDisArray(p044),posArr);

    var p109 = "000610400680700190104000007000439008000000000700285000800000703079003016001067000".split("");
    this.hard109 = new Puzzle(p109,puzToDisArray(p109),posArr);

    var p115 = "060081290090350700000042000200000031605000809370000002000610000003079060026830010".split("");
    this.medium115 = new Puzzle(p115,puzToDisArray(p115),posArr);
/*
    var _CHANGE_ = "_CHANGE_".split("");
    this._CHANGE_ = new Puzzle(_CHANGE_,puzToDisArray(_CHANGE_),null);
    */
}
