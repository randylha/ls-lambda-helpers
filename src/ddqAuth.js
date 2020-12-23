const aws = require('aws-sdk');
const ssm = new aws.SSM();
const fetch = require('node-fetch');

const {DDQ_URL, DDQ_TOKEN, DDQ_CREDENTIALS, DDQ_SESSION_TOKEN}

const authApp = async token =>
  fetch(`${DDQ_URL}/security/api/saauthenticate`, {
    method: 'POST',
    headers: { sappkey: token, Accept: 'application/json' },
  })
    .then(res => res.text())
    .then(body => body)
    .catch(e => {
      console.log(e);
      throw e;
    });

const authUser = async (token, credentials) =>
  fetch(`${DDQ_URL}/security/api/userauthenticate`, {
    method: 'POST',
    headers: {
      satoken: token,
      udusername: credentials.udusername,
      udpassword: credentials.udpassword,
      Accept: 'application/json',
    },
  })
    .then(res => res.text())
    .then(body => body)
    .catch(e => {
      console.log(e);
      throw e;
    });

const getParams = async name => {
  console.log(name);
  return ssm
    .getParameter({
      Name: name,
      WithDecryption: true,
    })
    .promise()
    .then(data => {
      // console.log(data);
      return data.Parameter.Value;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const ddqAuth = async (renewToken) => {
  
  let ddqToken = null;
  let ddqCredentials = null;
  let currentUserToken = null;
  
  try {
    currentUserToken = await getParams(DDQ_SESSION_TOKEN);
    ddqToken = await getParams(DDQ_TOKEN);
    ddqCredentials = await getParams(DDQ_CREDENTIALS);
  } catch (e) {
    console.log(e);
    throw e;
  }

  //console.debug('Current User Token:', currentUserToken);
  //console.debug('DDQ application token:', ddqToken);
  //console.debug('DDQ creds:', ddqCredentials);

  if (!currentUserToken || !currentUserToken.ddqToken) {
    console.log('Renew the Token!!');
    renewToken = true;
  }

  if (!ddqToken || !ddqCredentials) {
    console.error('could not get ddq SSM params');
    throw 'Error getting DDQ Params'
  }
  
  if (renewToken) {
    try {
      const appToken = await authApp(ddqToken);
      const userToken = await authUser(appToken, JSON.parse(ddqCredentials));

      //console.debug('Results of DDQ Auth:', userToken);

      if (userToken.includes('Unauthorized')) {
        throw `Error getting token: ${userToken}`
      }

      const params = {
        Name: DDQ_SESSION_TOKEN,
        Type: 'SecureString',
        Value: userToken,
        Overwrite: true
      }

      await ssm.putParameter(params).promise()
      .then(data => console.log(data))
      .catch(err => console.log(err))

      return {
        ddqToken: userToken,
      };
    } catch (e) {
      throw e;
    }
  }
  else {
    return {
      ddqToken: currentUserToken,
    };
  }
};

module.exports = ddqAuth;