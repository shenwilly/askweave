function get_answers (question_id) {
    (async () => {
        $("#answer-card-list").empty()
        $(".loading-answer").show();
        $(".detail-container").hide();
        $(".no-answer").hide();
        
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
                        op: 'or',
                        expr1: {
                            op: 'and',
                            expr1:
                                {
                                    op: 'equals',
                                    expr1: 'Type',
                                    expr2: 'answer',
                                },
                            expr2:
                                {
                                    op: 'equals',
                                    expr1: 'Question-Tx',
                                    expr2: question_id,
                                }
                        },
                        expr2: {
                            op: 'and',
                            expr1:
                                {
                                    op: 'equals',
                                    expr1: 'Type',
                                    expr2: 'tip',
                                },
                            expr2:
                                {
                                    op: 'equals',
                                    expr1: 'Question-Tx',
                                    expr2: question_id,
                                }
                        }
					},
			}

    	const res = await this.arweave.api.post(`arql`, query)
        var tx_rows = []
        var tips_hash = {}
        if (res.data == '') {
            tx_rows = []
        } else {
		    await Promise.all(res.data.map(async function (id, i) {
                let tx_row = {}
                var tx_type;
                var tx_answer_id

                var tx = await this.arweave.transactions.get(id)
                var comments = await get_comments(question_id, id)
                tx_row["comments"] = comments

                tx_row['unixTime'] = '0'
                tx.get('tags').forEach(tag => {
                    let key = tag.get('name', { decode: true, string: true })
                    let value = tag.get('value', { decode: true, string: true })
                    if (key === 'Unix-Time') tx_row['unixTime'] = value
                    if (key === 'Type') tx_type = value

                    // for tip only
                    if (key === 'Answer-Tx') tx_answer_id = (value)
                })

                if (tx_type === 'tip') {
                    if (!(tx_answer_id in tips_hash)) tips_hash[tx_answer_id] = 0
                    tips_hash[tx_answer_id] += parseInt(tx.get('quantity'))
                    return;
                }

                var jsonData = tx.get('data', {decode: true, string: true})
                var data = JSON.parse(jsonData);

                tx_row['id'] = id
                tx_row['author_id'] = await arweave.wallets.ownerToAddress(tx.owner)
                tx_row['author_name'] = await get_name(await arweave.wallets.ownerToAddress(tx.owner))
                tx_row['answer'] = data["answer"]

                tx_rows.push(tx_row)
            }))
        }

        if (tx_rows.length === 0) {
            $(".no-answer").show();
        }
        
        tx_rows.sort((a, b) => {
            var a_tip = 0;
            var b_tip = 0;
            if (a["id"] in tips_hash) {
                a_tip = tips_hash[a["id"]]
            } 
            if (b["id"] in tips_hash) {
                b_tip = tips_hash[b["id"]]
            } 

            if (a_tip === b_tip) {
                return (Number(b.unixTime) - Number(a.unixTime));
            } else {
                return b_tip - a_tip;
            }
        })

        var date_options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        tx_rows.forEach(function (item) {
            var answer_card = $("#answer-card-template").html()

            var datetime = new Date(item["unixTime"]*1000);
            var formatted_datetime = datetime.toLocaleDateString('default', date_options)

            var answer_id = item["id"]
            var tip_amount = 0;
            if (answer_id in tips_hash) {
                var winston = tips_hash[answer_id];
                // remove trailing zeroes
                tip_amount = parseFloat(arweave.ar.winstonToAr(winston)).toString();
            } 

            var comments_length = item["comments"].length;

            answer_card = answer_card.replace("\[id\]", answer_id);
            answer_card = answer_card.replace("\[author_id\]", item["author_id"]);
            answer_card = answer_card.replace("\[author\]", item["author_name"]);
            answer_card = answer_card.replace("\[datetime\]", formatted_datetime);
            answer_card = answer_card.replace("\[tip_amount\]", tip_amount);
            answer_card = answer_card.replace("\[answer\]", item["answer"]);
            answer_card = answer_card.replace("\[comments-count\]", comments_length);

            $("#answer-card-list").append(answer_card);

            if (comments_length > 0) {
                var comment_container = $("#answer-card-list .answer-card").last().find(".comments-container");
                item["comments"].forEach(function (comment_item) {
                    var comment_datetime = new Date(comment_item["unixTime"]*1000);
                    var formatted_comment_datetime = comment_datetime.toLocaleDateString('default', date_options)

                    var comment_card = $("#comment-card-template").html()
                    comment_card = comment_card.replace("\[id\]", comment_item["id"]);
                    comment_card = comment_card.replace("\[author\]", comment_item["from"]);
                    comment_card = comment_card.replace("\[datetime\]", formatted_comment_datetime);
                    comment_card = comment_card.replace("\[comment\]", comment_item["comment"]);
                    
                    comment_container.append(comment_card);
                });
            }
        });


        $(".loading-answer").hide();
        $(".detail-container").show();
    })()
}
