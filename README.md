A Bit of Documentation
======================

Methods
-------

* **randomShittyPuzzle**

    A throwaway method, simply there to generate technically valid
    puzzles. Needs to be replaced. Uses helper methods genRow, 
    shuffle, rands, and offset.

* clearPuzzle

    Clears the sudoku board.

* updateButtons

    Shows/hides buttons depending on the state of the puzzle. If
    the puzzle is empty (void of any numbers) it hides:
    * Save
    * Clear
    * Possibles
    * Next
    * Solve
    As soon as any input is made or numbers are loaded into the
    puzzle it shows the buttons again.

* showButtons
    
    Helper method to show the applicable buttons.

* hideButtons
    
    Helper method to hide the applicable buttons.

* displayPuzzle

    Takes an array of puzzle entries to input. Interprets "0"
    elements as blank spots in the puzzle.

* puzzleToArray

    Returns the currently displayed puzzle as an array of 81
    elements.

* savePuzzle
    
    Accepts a key string and puzzle array and saves it to
    localStorage. Requires browser support.

* loadPuzzle

    Accepts a key string and loads the matching puzzle from
    localStorage, if it exists.

* countFilled

    Returns the number of currently filled in squares on the
    puzzle board.

* updateProgressBar
    
    Updates the progress bar displayed (if supported) below the
    puzzle to reflect the percentage of cells completed.

* genRow
* rands
* shuffle
* offset

