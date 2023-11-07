const forge = require('node-forge');
const keyCrypto = process.env.KEY_CRYPTO;
module.exports = class Utils {

    encrypt(data) {
        const cipher = forge.cipher.createCipher('AES-ECB', keyCrypto);
        cipher.start();
        cipher.update(forge.util.createBuffer(data, 'utf-8'));
        cipher.finish();
        const encrypted = cipher.output;
        return forge.util.encode64(encrypted.getBytes());
    }

    decrypt(data) {
        const decipher = forge.cipher.createDecipher('AES-ECB', keyCrypto);
        decipher.start();
        decipher.update(forge.util.createBuffer(atob(data)));
        decipher.finish();
        return decipher.output.toString();
    }
// return base64 user profile picture
    getUserPicture(user, callback) {
        const sdk = require('api')('@telegram-bot-sdk/v2.0#8hz4kq6s9i74');
        sdk.getuserprofilephotos({
            user_id: user.usuario.idPlataforma, offset: null, limit: null
        }, {token: process.env.TELEGRAM_BOT_TOKEN})
            .then(({data}) => {
                if (data.ok) {
                    if (data.result.total_count > 0) {
                        let fileSize = 0;
                        let picture = null;
                        for (let i = 0; i < data.result.photos[0].length; i++) {
                            let photo = data.result.photos[0][i];
                            if (photo.file_size > fileSize) {
                                fileSize = photo.file_size;
                                picture = photo;
                            }
                        }
                        if (picture) {
                            sdk.getfile({file_id: picture.file_id}, {
                                token: process.env.TELEGRAM_BOT_TOKEN,
                                'user-agent': 'Telegram Bot SDK - (https://github.com/irazasyed/telegram-bot-sdk)'
                            })
                                .then(({data}) => {
                                    let urlDownload = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${data.result.file_path}`;
                                    let request = require('request').defaults({encoding: null});
                                    request.get(urlDownload, function (err, res, body) {
                                        if (!err && res.statusCode === 200) {
                                            let data = "data:" + res.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                                            callback(data);
                                        }else{
                                            callback(null);
                                        }
                                    });
                                })
                                .catch(err2 => console.error(err2));
                        } else {
                            callback(null);
                        }
                    } else {
                        callback(null);
                    }
                }
            })
            .catch(err => console.error(err));
    }
}