/*
 * Copyright (c) 2017-2019 HERE Europe B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * License-Filename: LICENSE
 */

// https://developer.here.com/documentation/geocoder/topics/introduction.html

'use strict';

const axios = require("axios");
const HERE_API_KEY = process.env.HERE_API_KEY;
let statusCode = '200';

const getData = async (url, apiMethod, postData) => {
    let response = '';

    try {
        if (apiMethod === 'POST') {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': '*',
                    'Cache-Control': 'no-cache'
                }
            };

            response = await axios.post(url, postData, options);
        } else {
            response = await axios.get(url);
        }

        statusCode = response.status;
        return response.data;
    } catch (error) {
        statusCode = error.response.status;
        return error;
    }
};

exports.geocodeGET = async (event, context) => {
    console.log(`>>> HERE_API_KEY: ${HERE_API_KEY}`);
    let apiMethod = "GET";
    let postData = "";
    let args = "";
    for (let qsp in event.queryStringParameters) {
        let qsa = "&" + qsp + "=" + event['queryStringParameters'][qsp];
        console.log(`>>> QueryStringArg: ${qsa}`);
        args += qsa;
    }

    const type = event.pathParameters.type;
    const resourcePath = event.pathParameters.resourcePath;

    const HERE_API_URL = `https://${type}.ls.hereapi.com/${resourcePath}`;
    const url = `${HERE_API_URL}?apiKey=${HERE_API_KEY}${args}`;
    console.log(`>>> url: ${url}`);

    if (url.indexOf("multi-reversegeocode") > 0) {
        apiMethod = "POST";
        postData = event.body;
    }

    const hlsAPIResponse = await getData(url, apiMethod, postData);

    const response = {
        statusCode: statusCode,
        // headers: { 'Access-Control-Allow-Origin': '*' },
        body: (parseInt(statusCode) === 200)? JSON.stringify(hlsAPIResponse) : JSON.stringify({ 'message' : hlsAPIResponse.response.data.Details })
    };

    context.succeed(response);
};
