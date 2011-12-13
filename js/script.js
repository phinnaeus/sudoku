// JavaScript Document
$(document).ready(function(){
    
    clearPuzzle();
//    showButtons();
    
    $("#puzzle input")
        .autotab_filter({format: 'custom', pattern: '[^1-9]' })
        .autotab_magic().on('change', function() {
        updateProgressBar();
        updateButtons();
    });

    if (getDifficulty() == "") setDifficulty(4);
    else displayDifficulty(getDifficulty());
	
    //this function attached focus and blur events with input elements
	var addFocusAndBlur = function($input, $val){
		
		$input.focus(function(){
			if (this.value == $val) {this.value = '';}
		});
		
		$input.blur(function(){
			if (this.value == '') {this.value = $val;}
		});
	}

	// example code to attach the events
	//addFocusAndBlur(jQuery('#name'),'Name');
	
});
