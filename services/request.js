const util = require('util');
const request = require('postman-request');

const requestPromise = util.promisify(request);

const fetch = (url, responseHandler) => requestPromise({ url, json: true })
    .then(response => response.body)
    .catch(error => { throw error });

module.exports = fetch;
