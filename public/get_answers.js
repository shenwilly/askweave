function get_answers () {
    (async () => {
        $("#answer-card-list").empty()

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
                        expr2: 'answer'
					},
			}

        console.log('fetching answers...')
    	const res = await this.arweave.api.post(`arql`, query)
        console.log('fetching answers success!')
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
                tx_row['from'] = await arweave.wallets.ownerToAddress(tx.owner)
                tx_row['answer'] = data["answer"]

                return tx_row
            }))
        }

        tx_rows.sort((a, b) => (Number(b.unixTime) - Number(a.unixTime)))
        tx_rows.forEach(function (item) {
            var answer_card = $("#answer-card-template").html()

            var datetime = new Date(item["unixTime"]*1000);
            var date_options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            var formatted_datetime = datetime.toLocaleDateString('default', date_options)

            answer_card = answer_card.replace("\[id\]", item["id"]);
            answer_card = answer_card.replace("\[author\]", item["from"]);
            answer_card = answer_card.replace("\[datetime\]", formatted_datetime);
            answer_card = answer_card.replace("\[answer\]", item["answer"]);

            $("#answer-card-list").append(answer_card);
        })
    })()
}
