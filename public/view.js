$(function(){
	switch_to_page("index-page");
	
	$("#home-icon").click(function() {
		switch_to_page("index-page");
	})

	$(".question-card").click(function() {
		switch_to_page("detail-page");
	})

	$("#ask-btn").click(function() {
		var card = $("#question-card-template").html()
		$("#question-card-list").append(card);
	})
});

function switch_to_page(page) {
	let pages =
		[
			"index-page",
			"detail-page",
		];
	pages.forEach(function(p) {
		$("#"+p).hide();
	});$("#"+page).show();
}