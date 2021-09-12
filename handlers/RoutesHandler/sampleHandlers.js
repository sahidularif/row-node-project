/*
 *
 * Title: Sample handlers
 * Description: A RESTFul API to monitor up or down time of user define links.
 * Author: Sahidul Arif
 * Date: 6/09/21
 *
 */
// module scaffholding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties);

    callback(200, {
        message: 'This is a sample url',
    });
};

module.exports = handler;