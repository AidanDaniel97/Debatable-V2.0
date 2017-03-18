
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


 