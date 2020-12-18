const fetch = require('node-fetch');
const secretsHelper = require('./secretsHelper');

const {SFMC_SECRET_NAME} = process.env;
let MC_SECRET;
let MC_TOKEN;

const getSecret = async () => {
    if (MC_SECRET != null) return MC_SECRET;
    const secret = await secretsHelper.getSecret(SFMC_SECRET_NAME);
    // console.log('SECRET RES:', secret);
    MC_SECRET = secret;
    return secret;
}

const getToken = async (obj) => {
    console.log('PASSED SECRET:', obj);
    if(MC_TOKEN != null && MC_TOKEN.expires > Date.now()) return MC_TOKEN.token
    const res = await fetch('https://auth.exacttargetapis.com/v1/requestToken', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(obj)
        });
    const json = await res.json();
    MC_TOKEN = {token: json.accessToken, expires: Date.now() + (3400 * 1000)}
    console.log('MC_TOKEN:', MC_TOKEN);
    return json.accessToken;
}

const postAPI = async (method, data) => {
    const MC_BASE_URL = 'https://www.exacttargetapis.com/data/v1/async/dataextensions/key'
    console.log('METHOD:', method);
    const KEY = await getSecret();
    const TOKEN = await getToken(KEY);
    // console.log('TOKEN:', TOKEN);
    console.log('CALLING:', `${MC_BASE_URL}:${method}/rows`)
    try {
        const res = await fetch(`${MC_BASE_URL}:${method}/rows`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOKEN}`
                },
                body: JSON.stringify(data)
            });
        const json = await res.json();
        const status = res.status;
        if (status != 202) return `ERROR: Call to SFMC was unsuccessful -- ${JSON.stringify(json)}`
        return json;
    }
    catch (err) {
        console.error(err);
        return err.res.body
    }
};

module.exports = postAPI