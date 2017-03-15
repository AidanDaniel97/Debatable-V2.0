
$(".join_debate").click(function($this){
	console.log("Clicked to join debate: " , $(this).attr("data-debateName"));
	var destination = '/chat/'+ $(this).attr("data-debateName") + '/join/';   
	window.location.href = destination;


});

$(".spectate_debate").click(function($this){
	console.log("Clicked to spectate debate: " , $(this).attr("data-debateName"));
	var destination = '/chat/'+ $(this).attr("data-debateName") + '/spectate/';   
	window.location.href = destination; 

});


 