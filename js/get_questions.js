function get_questions () {
    (async () => {
        $("#question-card-list").empty()
        $(".loading-question").show();

        let query =
			{
			    op: 'and',
			    expr1:
					{
                        op: 'and',
                        expr1:
                            {
                                op: 'equals',
                                expr1: 'App-Name',
                                expr2: 'querweave'
                            },
                        expr2: 
                            {
                                op: 'equals',
                                expr1: 'App-Version',
                                expr2: versionNumber,
                            }
					},
			    expr2:
					{
                        op: 'equals',
                        expr1: 'Type',
                        expr2: 'question'
					},
			}

        console.log('fetching questions...')
    	const res = await this.arweave.api.post(`arql`, query)
        console.log('fetching questions success!')
        var tx_rows = []
        if (res.data == '') {
            tx_rows = []
        } else {
		    tx_rows = await Promise.all(res.data.map(async function (id, i) {
                let tx_row = {}
                var tx = await this.arweave.transactions.get(id)

                tx_row['unixTime'] = '0'
                tx.get('tags').forEach(tag => {
                    let key = tag.get('name', { decode: true, string: true })
                    let value = tag.get('value', { decode: true, string: true })
                    if (key === 'Unix-Time') tx_row['unixTime'] = value
                })

                var jsonData = tx.get('data', {decode: true, string: true})
                var data = JSON.parse(jsonData);

                tx_row['id'] = id
                tx_row['from'] = await get_name(await arweave.wallets.ownerToAddress(tx.owner))
                tx_row['question'] = data["question"]
                tx_row['description'] = data["description"]

                return tx_row
            }))
        }

        $(".loading-question").hide();
        tx_rows.sort((a, b) => (Number(b.unixTime) - Number(a.unixTime)))
        tx_rows.forEach(function (item) {
            var question_card = $("#question-card-template").html()

            var datetime = new Date(item["unixTime"]*1000);
            var date_options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            var formatted_datetime = datetime.toLocaleDateString('default', date_options)

            question_card = question_card.replace("\[id\]", item["id"]);
            question_card = question_card.replace("\[author\]", item["from"]);
            question_card = question_card.replace("\[datetime\]", formatted_datetime);
            question_card = question_card.replace("\[question\]", item["question"]);
            question_card = question_card.replace("\[description\]", item["description"]);

            $("#question-card-list").append(question_card);
        })

        mark_owned_questions()
    })()
}
