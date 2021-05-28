const fetch = require('node-fetch');

const oktaClientCredential = async ({auth_url, client_id, client_secret, scope}) => {
    const config = {
        grant_type: 'client_credentials',
        scope,
        client_id,
        client_secret
    }

    console.log('GET AUTH TOKEN FROM OKTA WITH CLIENT_ID:', config.client_id);

    try {
        const params = new URLSearchParams(config)
        const res = await fetch(`${auth_url}`, {
                                method: 'post',
                                body: params
                            })
        if (!res.ok) throw await res.text()
        const json = await res.json()
        console.log('TOKEN COMPLETE')
        // console.log(json)
        return json
    }
    catch (err) {
        console.log(err)
        return err
    }
};

module.exports = {oktaClientCredential}