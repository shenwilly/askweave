function get_question (question_id) {
    (async () => {
        var tx = await this.arweave.transactions.get(question_id)
        var jsonData = tx.get('data', {decode: true, string: true})
        var data = JSON.parse(jsonData);

        var question = data["question"]
        var description = data["description"]

        $("#detail-page .question-title").html(question);
        $("#detail-page .question-description").html(description);
    })()
}
