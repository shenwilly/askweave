function get_question (question_id) {
    (async () => {
        var tx = await this.arweave.transactions.get(question_id)
        var jsonData = tx.get('data', {decode: true, string: true})
        var data = JSON.parse(jsonData);

        var question_datetime = '0'
        tx.get('tags').forEach(tag => {
            let key = tag.get('name', { decode: true, string: true })
            let value = tag.get('value', { decode: true, string: true })
            if (key === 'Unix-Time') {
            	var unix_time = value
            	var datetime = new Date(unix_time*1000);
	            var date_options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
	            question_datetime = datetime.toLocaleDateString('default', date_options)
            }
        })

        var question = data["question"]
        var description = data["description"]
        var question_author = await get_name(await arweave.wallets.ownerToAddress(tx.owner))

		var address = $("#public-address").html();
		if (address === question_author) question_author = "You created this";

		$("#detail-page .question-author").html(question_author);
		$("#detail-page .question-datetime").html(question_datetime);
        $("#detail-page .question-title").html(question);
        $("#detail-page .question-description").html(description);
		$("#answer-btn").attr("question-id", question_id);
    })()
}
