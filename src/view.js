$(function(){
	switch_to_page("index-page");

	$("#home-icon").click(function() {
		switch_to_page("index-page");
	})

	$("#question-card-list").on('click', '.question-card', function() {
		var question_id = $(this).attr('card-id');
		var question_author = $(this).attr('author-id');
		var question_datetime = $(this).find('.card-datetime').html();
		var question_title = $(this).find('.card-title').html();
		var question_description = $(this).find('.card-description').html();

		var address = $("#public-address").html();
		if (address === question_author) question_author = "You created this";

		$("#detail-page .question-author").html(question_author);
		$("#detail-page .question-datetime").html(question_datetime);
		$("#detail-page .question-title").html(question_title);
		$("#detail-page .question-description").html(question_description);
		$("#answer-btn").attr("question-id", question_id);

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
		mark_owned_questions()
	} else {
		$(".not-logged-in").show();
		$(".logged-in").hide();
		$("#public-address").html();
	}
}

function mark_owned_questions() {
	var address = $("#public-address").html();

	if (address.length > 0) {
		$("#question-card-list .question-card").each(function(index) {
			if ($(this).attr('author-id') == address) {
				$(this).find('.card-is-owner').html('You created this - ')
			}
		});

	}
}