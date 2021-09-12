/*
 *
 * Title: Not Found handler
 * Description: A RESTFul API to monitor up or down time of user define links.
 * Author: Sahidul Arif
 * Date: 6/09/21
 *
 */
// module scaffholding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'Your requested URL was not found!',
    });
};

module.exports = handler;