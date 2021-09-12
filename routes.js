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
const routes = {
    'sample': sampleHandler
}
module.exports = routes;