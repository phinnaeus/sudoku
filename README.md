A Bit of Documentation
======================

NOTE : I AM LAZY AND THIS IS OUT OF DATE.
-----------------------------------------

Puzzle Object Prototype
-----------------------

    function Puzzle(puz, dis, pos) {
        this.value = puz;
        this.isDisabled = dis;
        this.possibles = pos;
    }

The Puzzle prototype contains 3 arrays, each of size 81: value, 
disabled, and possibles. Values contains strings of each cells
current number value, with "0" saved for an empty cell. isDisabled
contains a boolean value, true if the cell should be immutable.
Possibles contains strings that go into the uper left of each
cell, allowing the user to save possible values for each cell.

Currently Implemented Methods
-----------------------------

* **highlightRow**

    Pass a row and column, this function will visually highlight an
    entire row and the specific cell.

* **highlightColumn**

    Pass a row and column, this function will visually highlight an
    entire column and the specific cell.

* **highlightBox**

    Same as the above two, but this one higlights the box that the
    cell is in. I'm proud of this one, it uses MATH.

* **clearPuzzle**

    Clears the sudoku board.

* **clearPuzzleStyles**

    Removes any inline style attributes from the puzzle cells.

* **updateButtons**

    Shows/hides buttons depending on the state of the puzzle. If
    the puzzle is empty (void of any numbers) it hides:
    * Save
    * Clear
    * Possibles
    * Next
    * Solve
    As soon as any input is made or numbers are loaded into the
    puzzle it shows the buttons again.

* **showButtons**
    
    Helper method to show the applicable buttons.

* **hideButtons**
    
    Helper method to hide the applicable buttons.

* **displayPuzzle**

    Takes a Puzzle object displayes all included info in relevant
    place on the board. 

* **puzzleToObject**

    Returns the currently displayed puzzle as a Puzzle object.

* **savePuzzle**
    
    Accepts a key string and puzzle array and saves it to
    localStorage. Requires browser support.

* **loadPuzzle**

    Accepts a key string and loads the matching puzzle from
    localStorage, if it exists.

* **countFilled**

    Returns the number of currently filled in squares on the puzzle 
    board.

* **updateProgressBar**
    
    Updates the progress bar displayed (if supported) below the
    puzzle to reflect the percentage of cells completed.
