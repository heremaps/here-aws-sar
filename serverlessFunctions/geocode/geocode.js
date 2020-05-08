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

// Reference document for HERE API

// https://developer.here.com/documentation/geocoding-search-api/dev_guide/index.html

'use strict';
const axios = require("axios");
const HERE_API_KEY = process.env.HERE_API_KEY;

let statusCode = '200';

const getData = async url => {
    try {
        const response = await axios.get(url);
        statusCode = response.status;
        return response.data;
    } catch (error) {
        statusCode = error.response.status;
        return error;
    }
};

exports.geocodeGET = async (event, context) => {
    console.log(`>>> HERE_API_KEY: ${HERE_API_KEY}`);

    let args = "";
    for (let qsp in event.queryStringParameters) {
        let qsa = "&" + qsp + "=" + event['queryStringParameters'][qsp]
        console.log(`>>> QueryStringArg: ${qsa}`);
        args += qsa
    }
    const resourcePath = event.pathParameters.resourcePath;
    const type = resourcePath.split("/")[1];

    const HERE_API_URL = `https://${type}.search.hereapi.com/${resourcePath}`;
    const url = `${HERE_API_URL}?apikey=${HERE_API_KEY}${args}`;

    console.log(`url: ${url}`);
    const hlsAPIResponse = await getData(url);

    const response = {
        statusCode: statusCode,
        body: (parseInt(statusCode) === 200) ? JSON.stringify(hlsAPIResponse) : JSON.stringify({ "title": hlsAPIResponse.response.data.title, "correlationId": hlsAPIResponse.response.data.correlationId })
    };

    context.succeed(response);
};
