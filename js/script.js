// JavaScript Document
$(document).ready(function(){
    
    clearPuzzle();

    jQuery.easing.def = 'easeInExpo';

    $("#puzzle input").autotab_filter("numeric").autotab_magic();
	
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
