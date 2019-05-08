function answer_question () {
    (async () => {
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
        tx.addTag('Type', 'answer')
        await arweave.transactions.sign(tx, wallet)
        console.log(tx.id)
        await arweave.transactions.post(tx)

        $("#input_answer").val('');
        alert('Answer dispatched!')
    })()
}
