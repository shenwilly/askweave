async function get_comments(question_id, answer_id) {
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
                        op: 'and',
                        expr1: 
	                        {
	                            op: 'equals',
	                            expr1: 'Type',
	                            expr2: 'comment',
	                        },
                        expr2: 
	                        {
	                            op: 'and',
	                            expr1:
	                                {
	                                    op: 'equals',
	                                    expr1: 'Question-Tx',
	                                    expr2: question_id,
	                                },
	                            expr2:
	                                {
	                                    op: 'equals',
	                                    expr1: 'Answer-Tx',
	                                    expr2: answer_id,
	                                }
	                        }
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
            tx_row['from'] = await get_name(await arweave.wallets.ownerToAddress(tx.owner))
            tx_row['comment'] = data["comment"]

            return tx_row
        }))
    }

    tx_rows.sort((a, b) => (Number(a.unixTime) - Number(b.unixTime)))
    return tx_rows
}
