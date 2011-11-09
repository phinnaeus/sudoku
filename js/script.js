// JavaScript Document
$(document).ready(function(){
    
    clearPuzzle();

    jQuery.easing.def = 'easeInExpo';

	function hideOverlay() {
        $(".tooltip").hide();
        $("#overlayBar").animate({
            top: '-16%',
        }, 500, function() {
            $("#overlay").fadeOut()
            $("#overlayBar").hide();
            $(".hidden").animate({
                opacity: '1',
            });
        });
    }

    $(".overlayButton").bind('mouseenter', function() {
        var p = $(this).position();
        var t = $(this).children(".tooltip");
        t.css({
            'top' : p.top + 60,
            'left' : p.left - 20
        });
        t.fadeIn('fast');
    });
    

    $(".overlayButton").bind('mouseleave', function() {        
        var t = $(this).children(".tooltip");
        t.delay(500).fadeOut('fast');
    });

    $("#solverButton").click(function() {
        hideOverlay();
        $("#rightMenu").show().animate({
            right: '-2px',
        });
        randomShittyPuzzle();
    });

    $("#creatorButton").click(function() {
        hideOverlay();
        $("#leftMenu").show().animate({
            left: '-2px',
        });
    });

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
	
           /* $("#leftMenu").show().animate({
                left: '-2px',
            });*/
});
