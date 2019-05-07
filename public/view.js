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

function update_login_state(is_logged_in, address) {
	if (is_logged_in) {
		$(".not-logged-in").hide();
		$(".logged-in").show();
		$("#public-address").html(address);
	} else {
		$(".not-logged-in").show();
		$(".logged-in").hide();
		$("#public-address").html();
	}
}