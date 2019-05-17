function login (files) {
    $(".file-input").hide();
    $(".login-loading-indicator").show();

    var fr = new FileReader()
    fr.onload = function (ev) {
        try {

            wallet = JSON.parse(ev.target.result)

            var public_address;
            arweave.wallets.jwkToAddress(wallet).then((address) => {
				get_name(address).then((output_address) => {
					public_address = output_address;
					update_login_state(true, public_address);
                    
                    $('#loginModal').modal('hide');
				});

            });
        } catch (err) {
            alert('Error logging in: ' + err)
        } finally {
        }
    }
    fr.readAsText(files[0])

}
