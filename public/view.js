$(function(){
	switch_to_page("index-page");

	$("#home-icon").click(function() {
		switch_to_page("index-page");
	})

	$("#question-card-list").on('click', '.question-card', function() {
		var question_id = $(this).attr('card-id');
		var question_title = $(this).find('.card-title').html();
		var question_description = $(this).find('.card-description').html();
		$("#detail-page .question-title").html(question_title);
		$("#detail-page .question-description").html(question_description);
		$("#answer-btn").attr("question-id", question_id);
		console.log(question_id);

	    get_answers(question_id);
	    switch_to_page("detail-page");
	});

	$("#answer-btn").click(function() {
		var question_id = $('#answer-btn').attr('question-id');
		answer_question(question_id);
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