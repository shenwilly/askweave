function ask_question () {
    (async () => {
        var question = $("#input_question").val();
        var description = $("#input_description").val();
        var unixTime = Math.round((new Date()).getTime() / 1000)

        var data = {
            'question': question,
            'description': description,
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
        tx.addTag('Type', 'question')
        await arweave.transactions.sign(tx, wallet)
        console.log(tx.id)
        await arweave.transactions.post(tx)
        alert('Question dispatched!')

        $('#askQuestionModal').modal('hide');
    })()
}
