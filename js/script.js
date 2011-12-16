// JavaScript Document
$(document).ready(function(){
/*    var test = apprise("You already have a puzzle saved. Do you want to overwrite it?",
               {'verify':true},
               function(r) {
                   alert(r);
               });*/

/*    // User enters a value in a cell\
    $("#puzzle input").change(function() {
        var selector = $(this).parent().attr("class").split("");
        console.log(selector[1] - 1, selector[4] - 1);
        console.log(typeof selector[1]);
        console.log(typeof selector[4]);
        if(isValidValue(selector[4] - 1, selector[1] - 1)) {
            console.log("Value is currently possible");
            //TODO
        } else {
            console.log("Value is FUBAR");
            //TODO highlightError()
        }
    });*/
    
    clearPuzzle();
//    showButtons();
    
    $("#puzzle input")
        .autotab_filter({format: 'custom', pattern: '[^1-9]' })
        .autotab_magic().on('change', function() {
        updateProgressBar();
        updateButtons();
    });

    $("#leftMenu button[title]").tooltip({tipClass: "tooltipLeft", position: "center left", effect: "slide", direction: "left"});
    $("#rightMenu button[title]").tooltip({tipClass: "tooltipRight", position: "center right", effect: "slide", direction: "right"});
    $(".difficultyOrbs[title]").tooltip({position: "top center", effect: "slide"});

    if (getDifficulty() == null) setDifficulty(4);
    else displayDifficulty(getDifficulty());
	
});
