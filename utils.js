const forge = require('node-forge');
const keyCrypto = process.env.KEY_CRYPTO;
module.exports = class Utils{

    encrypt(data){
        const cipher = forge.cipher.createCipher('AES-ECB', keyCrypto);
        cipher.start();
        cipher.update(forge.util.createBuffer(data, 'utf-8'));
        cipher.finish();
        const encrypted = cipher.output;
        return forge.util.encode64(encrypted.getBytes());
    }

    decrypt(data){
        const decipher = forge.cipher.createDecipher('AES-ECB', keyCrypto);
        decipher.start();
        decipher.update(forge.util.createBuffer(atob(data)));
        decipher.finish();
        return decipher.output.toString();
    }
}