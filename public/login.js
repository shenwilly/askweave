function login (files) {
    var fr = new FileReader()
    fr.onload = function (ev) {
        try {
            wallet = JSON.parse(ev.target.result)
            arweave.wallets.jwkToAddress(wallet).then((address) => {
                public_address = address;
            });

            update_login_state(true);

            $('#loginModal').modal('hide');
        } catch (err) {
            alert('Error logging in: ' + err)
        }
    }
    fr.readAsText(files[0])
}
