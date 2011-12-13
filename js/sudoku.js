/**
 * The grid of numbers that all the solving methods interact with.
 * Follows the format grid[ROW][COLUMN].
 */
var grid = new Array(9);        // create 9 rows
for(var r = 0; r < 9; r++) {    // in every row, create 9 cells
    grid[r] = new Array(9);
}

/**
 * Fills the grid with the initial values from the display table,
 * and fills the posVals array for each node.
 */
function createGrid() {
    // Fill the grid with initial values
    for(var row = 0; row < 9; row++) {
        for(var col = 0; col < 9; col++) {
            var selector = "td.r" + (row + 1) + ".c" + (col + 1) + ">input";
            var value = parseInt($(selector).val());
            if(isNaN(value))
                grid[row][col] = new sudokuNode(0);
            else
                grid[row][col] = new sudokuNode(value);

        }
    }

    // Update the possibility arrays
    for(var row = 0; row < 9; row++) {
        for(var col = 0; col < 9; col++) {
            clearRow(col, row);
            clearColumn(col, row);
            clearBox(col, row);
        }
    }

    //alertAllPos();
    //alertGrid();
}

/**
 * Clears the grid by reinitializing the 1st dimension of the array
 */
function clearGrid() {
    for(var r = 0; r < 9; r++) {    // in every row, create 9 cells
        grid[r] = new Array(9);
    }
}

// Solving Styles ##############################################################

var solvingSteps = 0;

/**
 * Attempts to solve any single cell in the puzzle
 */
function step() {
    solvingSteps++;

    // Create the grid if it does not already exist
    if(typeof grid[0][0] === "undefined") {
        createGrid();
    }

    // Flags for each solving method
    var nsFlag, srFlag, scFlag, sbFlag, stuck;
    nsFlag = srFlag = scFlag = sbFlag = stuck = false;

    nsFlag = nakedSingles(true);
    if(!nsFlag) {
        srFlag = singlesInRow(true);
        if(!srFlag) {
            scFlag = singlesInColumn(true);
            if(!scFlag) {
                sbFlag = singlesInBox(true);
                if(!sbFlag) {
                    stuck = true;
                }
            }
        }
    }

    if(isSolved()) {
        $("p#log").text("Solved in " + solvingSteps + " steps");
    }
    else if(stuck) {
        if(confirm("Stuck! Brute force is needed. This will likely be fast, but may take up to a few minutes to complete")) {
            clearNotes();
            bruteForce();
        }
    }
}

/**
 * Attempts to solve every cell in the puzzle
 */
function solve() {
    // Timer
    var seconds = new Date().getTime();

    // Clear notes
    clearNotes();

    // Create the grid if it does not already exist
    if(typeof grid[0][0] === "undefined") {
        createGrid();
    }

    // Flags for each solving method
    var nsFlag, srFlag, scFlag, sbFlag, stuck;
    nsFlag = srFlag = scFlag = sbFlag = stuck = false;

    while(!stuck) {
        //solvingSteps++;
        nsFlag = nakedSingles();
        if(!nsFlag) {
            srFlag = singlesInRow();
            if(!srFlag) {
                scFlag = singlesInColumn();
                if(!scFlag) {
                    sbFlag = singlesInBox();
                    if(!sbFlag) {
                        stuck = true;
                    }
                }
            }
        }
    }

    if(isSolved()) {
        //$("p#log").text("Solved in " + solvingSteps + " steps");
        $("p#log").text("Solved in " + ((new Date().getTime() - seconds) / 1000) + " seconds");
    } else if(stuck) {
        if(confirm("Stuck! Brute force is needed. This will likely be fast, but may take up to a few minutes to complete")) {
            bruteForce();
        }
    }
}

// Solving Helpers #############################################################

/**
 * Eliminate a value from all possibility arrays in a row
 *
 * @param row = Row of the cell holding the value to be eliminated
 * @param column = Column of the cell holding the value to be eliminated
 */
function clearRow(column, row) {
    if(column >= 0 && column < 9 && row >= 0 && row < 9) {
        var value = grid[row][column].getValue();
        for(var i = 0; i < 9; i++)
            grid[row][i].setNotPossible(value);
        
        //alert("In ROW " + (row + 1) + ", cleared cell r" + (row + 1) + "c" + (column + 1) + " which now has " + grid[row][column].howManyPossible() + " possible values");
    }
}

/**
 * Eliminate a value from all possibility arrays in a column
 *
 * @param row = Row of the cell holding the value to be eliminated
 * @param column = Column of the cell holding the value to be eliminated
 */
function clearColumn(column, row) {
    if(column >= 0 && column < 9 && row >= 0 && row < 9) {
        var value = grid[row][column].getValue();
        for(var i = 0; i < 9; i++)
            grid[i][column].setNotPossible(value);

        //alert("In COLUMN " + (column + 1) + ", cleared cell r" + (row + 1) + "c" + (column + 1) + " which now has " + grid[row][column].howManyPossible() + " possible values");
    }
}

/**
 * Eliminate a value from all possibility arrays in a 3x3 box
 *
 * @param row = Row of the cell holding the value to be eliminated
 * @param column = Column of the cell holding the value to be eliminated
 */
function clearBox(column, row) {
    if(column >= 0 && column < 9 && row >= 0 && row < 9) {
        var value = grid[row][column].getValue();
        var rOffset = 3 * Math.floor(row / 3);
        var cOffset = 3 * Math.floor(column / 3);

        for(var bRow = 0; bRow < 3; bRow++) {
            for(var bCol = 0; bCol < 3; bCol++)
                grid[bRow + rOffset][bCol + cOffset].setNotPossible(value);

        }
        //alert("In a BOX, cleared cell r" + (row + 1) + "c" + (column + 1) + " which now has " + grid[row][column].howManyPossible() + " possible values");
    }
}

/**
 * Check if num is a valid value for the given row.
 * Is only called by method recursiveBacktracking().
 *
 * @param row = The row to check for conflicts
 * @param num = The value to check for conflicts
 * @return FALSE if num conflicts with other cells in row, TRUE otherwise.
 */
function checkRow(row, num) {
    for(var col = 0; col < 9; col++) {
        if(grid[row][col].getValue() == num)
            return false;
    }
    return true;
}

/**
 * Check if num is a valid value for the given column.
 * Is only called by method recursiveBacktracking().
 *
 * @param col = The column to check for conflicts
 * @param num = The value to check for conflicts
 * @return FALSE if num conflicts with other cells in column, TRUE otherwise
 */
function checkColumn(col, num) {
    for(var row = 0; row < 9; row++) {
        if(grid[row][col].getValue() == num)
            return false;
    }
    return true;
}

/**
 * Check if num is a valid value for the given box.
 * Is only called by method recursiveBacktracking().
 *
 * @param col The column to check for conflicts
 * @param row The row to check for conflicts
 * @param num The value to check for conflicts
 * @return FALSE if num conflicts with other cells in box, TRUE otherwise.
 */
function checkBox(col, row, num) {
    var bCol = 3 * Math.floor(col / 3);
    var bRow = 3 * Math.floor(row / 3);

    for(var r = 0; r < 3; r++) {
        for(var c = 0; c < 3; c++) {
            if(grid[bRow + r][bCol + c].getValue() == num)
                return false;
        }
    }
    return true;
}

/**
 * Check if puzzle is solved. Does not check for accuracy because it assumes
 * all changes to the grid[][] are done by my solving methods, and that all
 * my solving methods will only insert correct values.
 *
 * @return TRUE if all 81 cells have values, FALSE otherwise.
 */
function isSolved() {
    var count = 0;
    for(var row = 0; row < 9; row++) {
        for(var col = 0; col < 9; col++) {
            if(grid[row][col].getValue() != 0)
                count++;
        }
    }
    return count == 81;
}

/**
 * Displays an alert box with all the values of the sudoku puzzle
 */
function alertGrid() {
    var string = "    A B C D E F G H I";
    for(var row = 0; row < 9; row++) {
        var rowString = "\n" + (row + 1) + ":";
        for(var col = 0; col < 9; col++) {
            var v = grid[row][col].getValue();
            if(v == 0)
                rowString += " ~";
            else
            rowString += (" " + v);
        }
        string += rowString;
    }
    alert(string);
}

/**
 * Displays an alert box which lists all the possible values for all unsolved
 * cells.
 */
function alertAllPos() {
    var string = "CELL | # | POSSIBILITIES";
    for(var row = 0; row < 9; row++) {
        for(var col = 0; col < 9; col++) {
            if(grid[row][col].howManyPossible() != 0) {
                string += "\nR" + (row + 1) + "C" + (col + 1);
                string += "   " + grid[row][col].howManyPossible() + "   ";
                for(var i = 1; i < 10; i++) {
                    if(grid[row][col].isPossible(i))
                        string += (i + " ");
                }
            }
        }
    }
    console.log(string);
}

// Solvers #####################################################################

/**
 * Checks for naked singles.
 * A naked single arises when there is only one possible value for a cell.
 *
 * @param step Whether the method should do a step-by-step solve
 * @returns TRUE if method solves any cells, FALSE otherwise
 */
function nakedSingles(step) {
    var flag = false;

    clearPuzzleStyles();

    // Check for naked singles
    for(var row = 0; row < 9; row++) {
        for(var col = 0; col < 9; col++) {
            if(grid[row][col].howManyPossible() == 1) {
                for(var i = 0; i < 9; i++) {
                    if(grid[row][col].isPossible(i + 1)) {
                        grid[row][col].setValue(i + 1);
                        grid[row][col].clearPosValues();
                        clearRow(col, row);
                        clearColumn(col, row);
                        clearBox(col, row);
                        flag = true;
                        updateProgressBar();
                        $("td.r" + (row + 1) + ".c" + (col + 1)).css("background-color","#99CCFF");
                        $("td.r" + (row + 1) + ".c" + (col + 1) + ">input").val(i + 1);
                        $("p#log").text("r" + (row + 1) + "c" + (col + 1) + " solved with nakedSingles()");
                        if(step) {
                            updateNotes(col, row);
                            return flag;
                        }
                    }
                }
            }
        }
    }
    return flag;
}

/**
 * Checks for hidden singles in each row.
 * A hidden single arises when there is only one possible cell for a value.
 *
 * @returns TRUE if method solves any cells, FALSE otherwise.
 */
function singlesInRow(step) {
    var flag = false;

    clearPuzzleStyles();

    // Check for hidden singles
    for(var row = 0; row < 9; row++) {
        // Tally the frequencies
        var freq = [0,0,0,0,0,0,0,0,0];
        for(var col = 0; col < 9; col++) {
            for(var i = 0; i < 9; i++) {
                if(grid[row][col].isPossible(i + 1))
                    freq[i]++;
            }
        }

        // Check the frequencies
        var single = 0;
        for(var i = 0; i < 9; i++) {
            if(freq[i] == 1) {
                single = i + 1;
                break;
            }
        }

        // If a single exists, solve the cell it occurs in
        if(single != 0) {
            for(var col = 0; col < 9; col++) {
                if(grid[row][col].isPossible(single)) {
                    grid[row][col].setValue(single);
                    grid[row][col].clearPosValues();
                    clearColumn(col, row);
                    clearBox(col,row);
                    flag = true;
                    updateProgressBar();
                    $("td.r" + (row + 1) + ".c" + (col + 1)).css("background-color","#99CCFF");
                    $("td.r" + (row + 1) + ".c" + (col + 1) + ">input").val(single);
                    $("p#log").text("r" + (row + 1) + "c" + (col + 1) + " solved with singlesInRow()");
                    if(step) {
                        updateNotes(col, row);
                        return flag;
                    }
                }
            }
        }
    }
    return flag;
}

/**
 * Checks for hidden singles in each column.
 * A hidden single arises when there is only one possible cell for a value.
 *
 * @returns TRUE if method solves any cells, FALSE otherwise.
 */
function singlesInColumn(step) {
    var flag = false;

    clearPuzzleStyles();

    // Check for hidden singles
    for(var col = 0; col < 9; col++) {
        // Tally the frequencies
        var freq = [0,0,0,0,0,0,0,0,0];
        for(var row = 0; row < 9; row++) {
            for(var i = 0; i < 9; i++) {
                if(grid[row][col].isPossible(i + 1))
                    freq[i]++;
            }
        }

        // Check the frequencies
        var single = 0;
        for(var i = 0; i < 9; i++) {
            if(freq[i] == 1) {
                single = i + 1;
                break;
            }
        }

        // If a single exists, solve the cell it occurs in
        if(single != 0) {
            for(var row = 0; row < 9; row++) {
                if(grid[row][col].isPossible(single)) {
                    grid[row][col].setValue(single);
                    grid[row][col].clearPosValues();
                    clearRow(col, row);
                    clearBox(col, row);
                    flag = true;
                    updateProgressBar();
                    $("td.r" + (row + 1) + ".c" + (col + 1)).css("background-color","#99CCFF");
                    $("td.r" + (row + 1) + ".c" + (col + 1) + ">input").val(single);
                    $("p#log").text("r" + (row + 1) + "c" + (col + 1) + " solved with singlesInColumn()");
                    if(step) {
                        updateNotes(col, row);
                        return flag;
                    }
                }
            }
        }
    }
    return flag;
}

/**
 * Check for hidden singles in each box.
 * A hidden single arises when there is only one possible cell for a value.
 *
 * @returns TRUE if method solves any cells, FALSE otherwise.
 */
function singlesInBox(step) {
    var flag = false;

    clearPuzzleStyles();

    // Check for hidden singles
    for(var bRow = 0; bRow < 9; bRow += 3) {            // Inter-box row traversal
        for(var bCol = 0; bCol < 9; bCol += 3) {        // Inter-box column traversal
            // Tally the frequencies
            var freq = [0,0,0,0,0,0,0,0,0];
            for(var row = 0; row < 3; row++) {          // Intra-box row traversal
                for(var col = 0; col < 3; col++) {      // Intra-box column traversal
                    if(grid[row][col].isPossible(i + 1))
                        freq[i]++;
                }
            }

            // Check the frequencies
            var single = 0;
            for(var i = 0; i < 9; i++) {
                if(freq[i] == 1) {
                    single = i + 1;
                    break;
                }
            }

            // If a single exists, solve the cell it occurs in
            if(single != 0) {
                for(var row = 0; row < 3; row++) {      // Intra-box row traversal
                    for(var col = 0; col < 3; col++) {  // Intra-box column traversal
                        if(grid[bRow + row][bCol + col].isPossible(single)) {
                            grid[bRow + row][bCol + col].setValue(single);
                            grid[bRow + row][bCol + col].clearPosValues();
                            clearRow(bCol + col, bRow + row);
                            clearColumn(bCol + col, bRow + row);
                            flag = true;
                            updateProgressBar();
                            $("td.r" + (bRow + row + 1) + ".c" + (bCol + col + 1)).css("background-color","#99CCFF");
                            $("td.r" + (bRow + row + 1) + ".c" + (bCol + col + 1) + ">input").val(single);
                            $("p#log").text("r" + (bRow + row + 1) + "c" + (bCol + col + 1) + " solved with singlesInBox()");
                            if(step) {
                                updateNotes(bCol + col, bRow + row);
                                return flag;
                            }
                        }
                    }
                }
            }
        }
    }
    return flag;
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

/**
 * Attempts to solve the puzzle using brute force tactics. 
 * recursiveBacktracking() is currently the only method it uses.
 */
function bruteForce() {
    var startTime = new Date().getTime();
    try {
        recursiveBacktracking(0,0);
    } catch(e) {
        $("p#log").html("Puzzle solved in " + ((new Date().getTime() - startTime) / 1000) + " seconds" + "<br />" + e + " recursions were required to solve");   
    }
}

var numRecursions = 0;      // Counter for recursiveBacktracking()

/**
 * Uses recursive backtracking to solve a sudoku puzzle. Currently only finds
 * one solution, the first one it finds. Could be made to find all solutions or
 * to check if the puzzle has a unique solution.
 *
 * REQUIRES: numRecursions variable for use as a counter
 *
 * @param startingCol The starting column for the next step in the recursion
 * @param startingRow The starting row for the net step in the recursion
 */
function recursiveBacktracking(startingCol, startingRow) {
    var flag = false;

    numRecursions++;        // increment the counter

    // Check if puzzle is solved
    if(startingRow > 8) {
        for(var row = 0; row < 9; row++) {
            for(var col = 0; col < 9; col++) {
                if($("td.r" + (row + 1) + ".c" + (col + 1) + ">input").val() == "")
                    $("td.r" + (row + 1) + ".c" + (col + 1) + ">input").val(grid[row][col].getValue());
            }
        }
        updateProgressBar();
        // End all pending recursions
        throw (numRecursions);
    } else {
        // If cell is not empty, continue with next cell
        if(grid[startingRow][startingCol].getValue() != 0) {
            if(startingCol < 8)
                flag = recursiveBacktracking(startingCol + 1, startingRow);
            else
                flag = recursiveBacktracking(0, startingRow + 1);
        } else {
            // Find a valid value for the empty cell
            for(var value = 1; value < 10; value++) {
                if(grid[startingRow][startingCol].isPossible(value) &&
                    checkRow(startingRow, value) &&
                    checkColumn(startingCol, value) &&
                    checkBox(startingCol, startingRow, value)) {
                    
                    grid[startingRow][startingCol].setValue(value);

                    // Recursive call to solve the next cell
                    if(startingCol < 8)
                        flag = recursiveBacktracking(startingCol + 1, startingRow);
                    else
                        flag = recursiveBacktracking(0, startingRow + 1);
                }
            }

            // No valid number was found, so undo changes to grid[][]
            grid[startingRow][startingCol].setValue(0);
        }
    }
    return flag;
}

// Helpers #####################################################################

/**
 * Toggles the visibility of the notes.
 * REQUIRES: notesVisible toggle
 */
var notesVisible = false;
function notes() {
    if(notesVisible) {
        notesVisible = false;
        clearNotes();
    }
    else {
        notesVisible = true;
        createNotes();
    }
}

/**
 * Creates the initial possible value notes.
 * Creates the grid array if it doesn't exist.
 */
function createNotes() {
    // Create the grid if it doesn't already exist
    if(typeof grid[0][0] === "undefined") {
        createGrid();
    }
    
    // Fill the Notes spans
    for(var row = 0; row < 9; row++) {
        for(var col = 0; col < 9; col++) {
            if(grid[row][col].howManyPossible() > 0) {
                for(var i = 1; i < 10; i++) {
                    if(grid[row][col].isPossible(i))
                        $("td.r" + (row + 1) + ".c" + (col + 1) + " span.possibles" + i).text(i);
                }
            }
        }
    }

    alertAllPos();
}

/**
 * Updates the notes for all neighboring cells.
 *
 * REQUIRES: notesVisible toggle
 * @param col The column of the cell that was updated
 * @param row The row of the cell that was updated
 */
function updateNotes(col, row) {
    if(notesVisible) {
        var value = grid[row][col].getValue();
    
        // Clear notes in the solved cell
        for(var i = 1; i < 10; i++) {
            $("td.r" + (row + 1) + ".c" + (col + 1) + " span.possibles" + i).html("&nbsp;");
        }

        // Update notes in the row
        for(var nCol = 0; nCol < 9; nCol++) {
            if(grid[row][nCol].howManyPossible() > 0) {
                $("td.r" + (row + 1) + ".c" + (nCol + 1) + " span.possibles" + value).html("&nbsp;");
            }
        }

        // Update notes in the column
        for(var nRow = 0; nRow < 9; nRow++) {
            if(grid[nRow][col].howManyPossible() > 0) {
                $("td.r" + (nRow + 1) + ".c" + (col + 1) + " span.possibles" + value).html("&nbsp;");
            }
        }

        // Update notes in the box
        var bCol = 3 * Math.floor(col / 3);
        var bRow = 3 * Math.floor(row / 3);

        for(var r = 0; r < 3; r++) {
            for(var c = 0; c < 3; c++) {
                if(grid[bRow + r][bCol + c].howManyPossible() > 0) {
                    $("td.r" + (bRow + r + 1) + ".c" + (bCol + c + 1) + " span.possibles" + value).html("&nbsp;");
                }
            }
        }
    }
}

/**
 * Clear the notes from all cells
 */
function clearNotes() {
    for(var row = 0; row < 9; row++) {
        for(var col = 0; col < 9; col++) {
            for(var i = 1; i < 10; i++)
                $("td.r" + (row + 1) + ".c" + (col + 1) + " span.possibles" + i).html("&nbsp;");
        }
    }
}

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

    // Reset all necessary backend stuff
    clearGrid();
    $("#log").text("");
    numRecursions = 0;
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

function updateCell(row, col, value) {
    if (value > 9 || value < 1) return false;
    var cellSelector = "#puzzle .r" + row + ".c" + col + " input";
    $(cellSelector).val(value);
    updateButtons();
    updateProgressBar();
    return true;
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

function savePuzzle(puz) {
    //TODO: check to see if "davistm+coleycj" exists in localStorage
    //          if yes, popup confirm dialog about overwriting
    //              if confirmed, save puzzle
    //              if cancelled, return;;
    //          if no, just save it
    try {
        localStorage.setObject("davistm+coleycj",puz);
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            alert("No more room for puzzles somehow! I'm sorry!");
        } else alert(e);
    }
    return true;
}

function loadPuzzle() {
    //TODO: the button should only be available if "davistm+coleycj" exists in localStorage
    //          should fire an event on load if the key exits, or when something is saved.
    //          until that event fires, load button should be hidden
    var puzzle = localStorage.getObject("davistm+coleycj");
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

function getDifficulty() {
    return localStorage.getItem("davistm+coleycj_diff");
}

function setDifficulty(diff) {
    try {
        localStorage.setItem("davistm+coleycj_diff",diff);
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            alert("well, fuck. we ran out of room.");
        } else alert(e);
    }
}

function displayDifficulty(diff) {
    $(".difficultyOrbs").removeClass("on").addClass("off");
    for (; diff>=1; diff--) {
        $("orb" + diff).addClass("on");
    }
}

// test puzzles

function grabPuzzle(difficulty) {
    if (difficulty < 1 || difficulty > 4) return false;

    var diffMap = ["", "m", "c", "h", "f"];

    var posArr = new Array(81);
    for (var i=0; i<81; i++) posArr[i] = "";
    
    var url = "testpuzzles/";
    var num = Math.ceil(Math.random()*13);
    url += diffMap[difficulty] + num + ".txt";

    $.get(url, function(data) {
        data = data.split("");
        var puz = new Puzzle(data,puzToDisArray(data), posArr);
        displayPuzzle(puz);
    });
}


function puzToDisArray(puz) {
    var dis = new Array(81);
    for (var i=0; i<81; i++) {
        dis[i] = false;
        if (puz[i] != "0") dis[i] = true;
    }
    return dis;
}
