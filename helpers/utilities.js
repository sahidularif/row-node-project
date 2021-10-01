/*
 * Title: Utilities helper modules
 * Description:
 * Author: Sahidul Arif ( Learn with Sumit )
 * Date: 15/9/2021
 *
 */
// Defendency
const crypto = require('crypto');
const environments = require('./environments');
//module scaffholding
const utilities = {};


utilities.hash = (str) => {
    if (typeof (str) == 'string' && str.length > 0) {
        let hash = crypto
            .createHmac('sha256', environments.secretKey)
            .update(str)
            .digest('hex');
        return hash;
    }
}
utilities.createRandomString = (strLength) => {
    let length = strLength;
    length = typeof strLength == 'number' && strLength > 0 ? strLength : false;
    if (length) {
        const possibleCharecter = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for (let i = 0; i < length; i++) {
            const randomCharecter = possibleCharecter.charAt(Math.random() * possibleCharecter.length);
            output += randomCharecter;
        }
        return output;
    }
    return false;
}
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString)
    } catch {
        output = {};
    }
    return output;
}

module.exports = utilities;
