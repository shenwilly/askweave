function post_comment (question_id, answer_id, comment) {
    (async () => {
        $(".comment-btn").addClass("disabled").addClass("wait");

        var unixTime = Math.round((new Date()).getTime() / 1000)

        var data = {
            'comment': comment,
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
        tx.addTag('Answer-Tx', answer_id)
        tx.addTag('Type', 'comment')
        await arweave.transactions.sign(tx, wallet)
        console.log(tx.id)
        await arweave.transactions.post(tx)

        $("textarea[name='input_comment']").val('');
        $(".comment-btn").removeClass("disabled").removeClass("wait");
        alert('Comment dispatched!')
    })()
}
