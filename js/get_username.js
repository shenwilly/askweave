async function get_name(addr) {
	let get_name_query =
		{
			op: 'and',
			expr1:
				{
					op: 'equals',
					expr1: 'App-Name',
					expr2: 'arweave-id'
				},
			expr2:
				{
					op: 'and',
					expr1:
						{
							op: 'equals',
							expr1: 'from',
							expr2: addr
						},
					expr2:
						{
							op: 'equals',
							expr1: 'Type',
							expr2: 'name'
						}
				}
		}

	const txs = await this.arweave.api.post(`arql`, get_name_query)

	if(txs.data.length == 0)
		return addr

	var tx_rows = []
    tx_rows = await Promise.all(txs.data.map(async function (id, i) {
	    let tx_row = {}
	    let tx = await this.arweave.transactions.get(id)

	    tx_row['unixTime'] = '0'
	    tx.get('tags').forEach(tag => {
	        let key = tag.get('name', { decode: true, string: true })
	        let value = tag.get('value', { decode: true, string: true })
	        if (key === 'Unix-Time') tx_row['unixTime'] = value
	    })

	    let data = tx.get('data', {decode: true, string: true})
	    tx_row['value'] = data

	    return tx_row
	}))


    tx_rows.sort((a, b) => (Number(a.unixTime) - Number(b.unixTime)))
    var latest_tx = tx_rows.pop()

	return latest_tx.value

}
