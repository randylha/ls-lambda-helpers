const aws = require('aws-sdk');
const Crypto = require('crypto');

const ssm = new aws.SSM({ region: 'us-west-2' });
class Encryption {
  constructor(keyPath) {
    return (async () => {
      this.password = '';
      this.iv = Buffer.from('Ab4rh2dein23fytc');
      this.salt = await Encryption.getParams(keyPath);
      this.hash = Crypto.createHash('sha256')
        .update(this.salt)
        .digest('base64')
        .slice(0, 32);
      this.key = this.hash;
      return this;
    })();
  }

  static async getParams(path) {
    return ssm
      .getParameter({
        Name: path,
        WithDecryption: true,
      })
      .promise()
      .then(data => data.Parameter.Value)
      .catch(e => {
        console.error(e);
        throw e;
      });
  }

  encrypt(data) {
    try {
      const cipher = Crypto.createCipheriv('aes256', this.key, this.iv);
      let encryptdata = cipher.update(data, 'utf8', 'base64');
      encryptdata += cipher.final('base64');
      return encryptdata;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  decrypt(data) {
    let encryptedData = data;
    try {
      try {
        JSON.parse(data);
        return data;
      } catch (e) {
        console.debug('data is encrypted');
      }
      if (!encryptedData) {
        return '{}';
      }
      if (Buffer.isBuffer(data)) {
        encryptedData = data.toString('base64');
      }
      if (encryptedData.constructor === Object) {
        encryptedData = JSON.stringify(encryptedData);
      }
      const decipher = Crypto.createDecipheriv('aes256', this.key, this.iv);
      let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

module.exports = Encryption;
