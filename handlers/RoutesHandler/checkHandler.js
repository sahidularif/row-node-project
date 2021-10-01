/*
 *
 * Title: check handlers
 * Description: Handler to handle user check.
 * Author: Sahidul Arif
 * Date: 25/09/21
 *
 */

// Defendency
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities')
const { parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const utilities = require('../../helpers/utilities');

// module scaffholding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];
    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }

};
handler._check = {};

handler._check.post = (requestProperties, callback) => {
    // validate input
    const protocol = typeof (requestProperties.body.protocol) === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ?
        requestProperties.body.protocol : false;

    const url = typeof (requestProperties.body.url) === 'string' &&
        requestProperties.body.url.trim().length > 0 ?
        requestProperties.body.url : false;

    const method = typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ?
        requestProperties.body.method : false;

    const successCodes = typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array ?
        requestProperties.body.successCodes : false;

    const timeOutSeconds = typeof requestProperties.body.timeOutSeconds === 'number' &&
        requestProperties.body.timeOutSeconds % 1 === 0 &&
        requestProperties.body.timeOutSeconds >= 1 &&
        requestProperties.body.timeOutSeconds <= 5 ?
        requestProperties.body.timeOutSeconds : false;

    if (protocol && url && method && successCodes && timeOutSeconds) {

        const token = typeof requestProperties.headersObject.token === 'string' ?
            requestProperties.headersObject.token : false;

        // lookup the user phone by reading the token
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                const userPhone = parseJSON(tokenData).phone;
                // lookup the user data
                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        tokenHandler._token.verify(token, userPhone, (isTokenValid) => {
                            if (isTokenValid) {
                                const userObject = parseJSON(userData);
                                const userChecks = typeof userObject.checks === 'object' &&
                                    userObject.checks instanceof Array ?
                                    userObject.checks : [];

                                if (userChecks.length < 5) {
                                    const checkId = utilities.createRandomString(20);
                                    const checkObject = {
                                        id: checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeOutSeconds,
                                    };
                                    // save the object
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if (!err3) {
                                            // add check id to the user's object
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);
                                            // save the new user data
                                            data.update('users', userPhone, userObject, (err4) => {
                                                if (!err4) {
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, {
                                                        error: 'There was a problem in the server side'
                                                    })
                                                }
                                            })
                                        } else {
                                            callback(500, {
                                                error: 'There was server side problem!',
                                            });
                                        }
                                    })
                                }

                            } else {
                                callback(403, {
                                    error: 'Authentication problem!',
                                });
                            }
                        })
                    } else {
                        callback(400, {
                            error: 'User not found',
                        });
                    }
                })
            } else {
                callback(400, {
                    error: 'Token not found!',
                });
            }
        })

    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }


};
handler._check.get = (requestProperties, callback) => {
    // check the phone number if valid

    const id = typeof (requestProperties.queryStringObject.id) == 'string' && requestProperties.queryStringObject.id.length == 20 ?
        requestProperties.queryStringObject.id : false;
    if (id) {
        // lookup the user
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                const token = typeof requestProperties.headersObject.token === 'string' ?
                    requestProperties.headersObject.token : false;
                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenId) => {
                    if (tokenId) {
                        callback(200, parseJSON(checkData))
                    } else {
                        callback(400, {
                            404: "Authentication problem"
                        })
                    }
                })
            } else {
                callback(404, {
                    404: 'User not found!'
                })
            }
        })
    } else {
        callback(400, {
            error: "Invalid id"
        })
    }

};

handler._check.put = (requestProperties, callback) => {
    const id = typeof (requestProperties.body.id) === 'string' &&
        requestProperties.body.id.trim().length === 20 ?
        requestProperties.body.id : false;
    const protocol = typeof (requestProperties.body.protocol) === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ?
        requestProperties.body.protocol : false;

    const url = typeof (requestProperties.body.url) === 'string' &&
        requestProperties.body.url.trim().length > 0 ?
        requestProperties.body.url : false;

    const method = typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ?
        requestProperties.body.method : false;

    const successCodes = typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array ?
        requestProperties.body.successCodes : false;

    const timeOutSeconds = typeof requestProperties.body.timeOutSeconds === 'number' &&
        requestProperties.body.timeOutSeconds % 1 === 0 &&
        requestProperties.body.timeOutSeconds >= 1 &&
        requestProperties.body.timeOutSeconds <= 5 ?
        requestProperties.body.timeOutSeconds : false;
    if (id) {
        if (protocol || url || method || successCodes || timeOutSeconds) {
            // lookup the use
            data.read('checks', id, (err, userCheck) => {
                if (!err && userCheck) {
                    const token =
                        typeof requestProperties.headersObject.token == 'string' ?
                            requestProperties.headersObject.token : false;
                    const checkData = parseJSON(userCheck);
                    tokenHandler._token.verify(token, checkData.userPhone, (tokenId) => {
                        if (tokenId) {
                            if (protocol) {
                                checkData.protocol = protocol;
                            }
                            if (url) {
                                checkData.url = url;
                            }
                            if (method) {
                                checkData.method = method;
                            }
                            if (successCodes) {
                                checkData.successCodes = successCodes;
                            }
                            if (timeOutSeconds) {
                                checkData.timeOutSeconds = timeOutSeconds;
                            }
                            // store to database
                            data.update('checks', id, checkData, (err) => {
                                if (!err) {
                                    callback(200, checkData)
                                }
                                else {
                                    callback(500, {
                                        'error': 'There was a problem in the server side!'
                                    })
                                }
                            })
                        } else {
                            callback(403, {
                                error: 'Authentication failure!',
                            })
                        }
                    })


                } else {
                    callback(500, {
                        'error': 'You have a problem in your request'
                    })
                }
            })


        } else {
            callback(400, {
                'error': 'You have a problem in your request'
            })
        }
    } else {
        callback(400, {
            'error': 'Invalid phone number. Please try again'
        })
    }
};

handler._check.delete = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    if (id) {
        // look up user is exists
        data.read('checks', id, (err1, checkInfo) => {
            if (!err1 && checkInfo) {
                const token =
                    typeof requestProperties.headersObject.token == 'string' ?
                        requestProperties.headersObject.token : false;
                const checkData = parseJSON(checkInfo);
                tokenHandler._token.verify(token, checkData.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        data.delete('checks', id, (err2) => {
                            if (!err2) {
                                data.read('users', checkData.userPhone, (err3, user) => {
                                    if (!err3 && user) {
                                        const userData = parseJSON(user);
                                        const userChecks = typeof userData.checks === 'object' &&
                                            userData.checks instanceof Array ?
                                            userData.checks : [];
                                        // remove the deleted check id
                                        const checkIndex = userChecks.indexOf(id);
                                        if (checkIndex > -1) {
                                            userChecks.splice(checkIndex, 1);
                                            // resave the user data
                                            userData.checks = userChecks;
                                            data.update('users', userData.phone, userData, (err4) => {
                                                if (!err4) {
                                                    callback(200, {
                                                        200: "Check was successfully deleted!",
                                                    })
                                                } else {
                                                    callback(500, {
                                                        error: "There was a server side problem 3!"
                                                    })
                                                }
                                            })
                                        } else {
                                            callback(500, {
                                                error: "The check id that you are trying to remove is not found in user!",
                                            })
                                        }
                                    } else {
                                        callback(500, {
                                            error: "There was a server side problem 2!"
                                        })
                                    }
                                })
                            } else {
                                callback(500, {
                                    error: "There was a sever side problem 1!"
                                })
                            }
                        })
                    } else {
                        callback(403, {
                            error: 'Authentication failure ou!',
                        })
                    }
                })
            } else {
                callback(500, {
                    'error': 'There was a server side error sd'
                })
            }
        })



    } else {
        callback(500, {
            'Error': 'There was a problem, in your request'
        })
    }
};
module.exports = handler;