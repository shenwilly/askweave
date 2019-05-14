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

	const tx = await this.arweave.transactions.get((txs.data)[0])

	return tx.get('data', {decode: true, string: true})

}
