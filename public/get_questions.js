function get_questions () {
    (async () => {
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

    	const res = await this.arweave.api.post(`arql`, query)
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
                tx_row['tx_status'] = await this.arweave.transactions.getStatus(id)
                tx_row['question'] = data["question"]
                tx_row['description'] = data["description"]

                return tx_row
            }))
        }

        tx_rows.sort((a, b) => (Number(b.unixTime) - Number(a.unixTime)))
        tx_rows.forEach(function (item) {
            var question_card = $("#question-card-template").html()

            question_card = question_card.replace("\[id\]", item["id"]);
            question_card = question_card.replace("\[question\]", item["question"]);
            question_card = question_card.replace("\[description\]", item["description"]);

            $("#question-card-list").append(question_card);
        })
    })()
}
