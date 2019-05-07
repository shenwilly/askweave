$(function(){
	$("#home-icon").click(function() {
		switch_to_page("index-page");
	})

	$(".question-card").click(function() {
		switch_to_page("detail-page");
	})

	$("#ask-btn").click(function() {
		var card = $("#card-template").html()
		$("#card-list").append(card);
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