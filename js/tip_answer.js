function tip_answer (question_id, answer_id, author_id, amount) {
    (async () => {
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

        $(".tip-btn").removeClass("disabled").removeClass("wait");
        $(".answer-card[card-id='"+answer_id+"'] .option-btn").removeClass("active");
        $(".answer-card[card-id='"+answer_id+"'] .option-btn.init").addClass("active");
        $(".answer-card[card-id='"+answer_id+"'] .tip-form").find('.tip-close').hide();
        $(".answer-card[card-id='"+answer_id+"'] .tip-form").find('.tip-btn').hide();
        $(".answer-card[card-id='"+answer_id+"'] .tip-form").find('.tip-input').hide();
        $(".answer-card[card-id='"+answer_id+"'] .tip-form").find('.tip-radio-group').hide();
        $(".answer-card[card-id='"+answer_id+"'] .tip-form").find('.tip-toggle').show();
        alert(amount + ' AR tip dispatched!')
    })()
}
