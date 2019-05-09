function tip_answer (question_id, answer_id, author_id, amount) {
    (async () => {
        console.log("TIP", question_id, answer_id, author_id, amount);
        // if (!$("#answer-form").valid() || $("#answer-btn").hasClass("disabled")) return;
        
        $(".tip-btn").addClass("disabled").addClass("wait");

        var unixTime = Math.round((new Date()).getTime() / 1000)

        var tx = 
            await arweave.createTransaction(
            {
                target: author_id,
                quantity: arweave.ar.arToWinston(amount)
            }, 
            wallet
        );

        tx.addTag('App-Name', 'querweave')
        tx.addTag('App-Version', versionNumber)
        tx.addTag('Unix-Time', unixTime)
        tx.addTag('Question-Tx', question_id)
        tx.addTag('Answer-Tx', answer_id)
        tx.addTag('Type', 'tip')
        await arweave.transactions.sign(tx, wallet)
        console.log(tx.id)
        await arweave.transactions.post(tx)

        $(".tip-input").val('');
        $(".tip-btn").removeClass("disabled").removeClass("wait");
        alert('Tip dispatched!')
    })()
}
