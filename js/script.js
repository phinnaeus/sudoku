// JavaScript Document
$(document).ready(function(){
    
    clearPuzzle();

//    $("#puzzle input").autotab_filter("numeric").autotab_magic().change(
//        "updateButtons(this)"
//    );
    

    function updateButtons(inputs) {
        var data = inputs.val().length;
        if (data > 0) {
            showButtons();
        } else hideButtons();
    }

    function showButtons() {
        $("#leftMenu button, #rightMenu button").removeClass("hidden");
    }

    function hideButtons() {
        $("#leftMenu button, #rightMenu button").addClass("hidden");
    }

	
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
