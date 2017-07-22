
$(".join_debate").click(function($this){
	console.log("Clicked to join debate: " , $(this).attr("data-debateName"));
	var destination = '/chat/'+ $(this).attr("data-debateName") + '/' + $(this).attr("data-debateList") + '/join/';
	window.location.href = destination;


});

$(".spectate_debate").click(function($this){
	console.log("Clicked to spectate debate: " , $(this).attr("data-debateName"));
	var destination = '/chat/'+ $(this).attr("data-debateName") + '/' + $(this).attr("data-debateList") + '/spectate/';
	window.location.href = destination;

});


$(".bookmark_debate").click(function($this){
	console.log("Clicked to bookmark debate: " , $(this).attr("data-debateInfo"));

});

//Types.js code
/*
 document.addEventListener('DOMContentLoaded', function(){

        Typed.new("#typed", {
            stringsElement: document.getElementById('typed-strings'),
            typeSpeed: 1,
            backDelay: 1000,
            loop: true,
            contentType: 'html', // or text
            // defaults to null for infinite loop
            loopCount: null
            //callback: function(){ foo(); },
            //resetCallback: function() { newTyped(); }
        });

        var resetElement = document.querySelector('.reset');
        if(resetElement) {
            resetElement.addEventListener('click', function() {
                document.getElementById('typed')._typed.reset();
            });
        }

    });*/
