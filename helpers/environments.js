/*
 * Title: Environments variable
 * Description:
 * Author: Sahidul Arif ( Learn with Sumit )
 * Date: 12/9/2021
 *
 */

const environments = {};

environments.staging = {
    port: 1000,
    envName: 'staging',
    secretKey: 'sdowfjsdflashdfuifasdj'
}

environments.production = {
    port: 2000, 
    envName: 'production',
    secretKey: 'weoiwoejfjshasjlsjdfasd'
};

// detarmin which environment was passed
const currentEnvironments =
    typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
    typeof environments[currentEnvironments] == 'object' ?
        environments[currentEnvironments] : environments.staging;

module.exports = environmentToExport;
