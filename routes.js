/*
 *
 * Title: Routes
 * Description: Application Routes
 * Author: Sahidul Arif
 * Date: 6/09/21
 *
 */
//defendencies
const {sampleHandler} = require('./handlers/RoutesHandler/sampleHandlers')
const {userHandler} = require('./handlers/RoutesHandler/userHandler')
const {tokenHandler} = require('./handlers/RoutesHandler/tokenHandler')
const {checkHandler} = require('./handlers/RoutesHandler/checkHandler')
const routes = {
    'sample': sampleHandler,
    'user': userHandler,
    'token': tokenHandler,
    'check': checkHandler,
}
module.exports = routes;