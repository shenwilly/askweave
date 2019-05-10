function answer_question (question_id) {
    (async () => {
        if (!$("#answer-form").valid() || $("#answer-btn").hasClass("disabled")) return;
        $("#answer-btn").addClass("disabled").addClass("wait");

        var answer = $("#input_answer").val();
        var unixTime = Math.round((new Date()).getTime() / 1000)

        var data = {
            'answer': answer,
        }

        var tx =
            await arweave.createTransaction(
                {
                    data: JSON.stringify(data),
                },
                wallet
            )

        tx.addTag('App-Name', 'querweave')
        tx.addTag('App-Version', versionNumber)
        tx.addTag('Unix-Time', unixTime)
        tx.addTag('Question-Tx', question_id)
        tx.addTag('Type', 'answer')
        await arweave.transactions.sign(tx, wallet)
        console.log(tx.id)
        await arweave.transactions.post(tx)

        $("#input_answer").val('');
        $("#answer-btn").removeClass("disabled").removeClass("wait");
        alert('Answer dispatched!')
    })()
}
