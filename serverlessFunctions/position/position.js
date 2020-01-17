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

// https://developer.here.com/documentation/positioning/topics/introduction.html

'use strict';

const axios = require("axios");
const HERE_API_URL = "https://pos.ls.hereapi.com";
const HERE_API_KEY = process.env.HERE_API_KEY;
let statusCode ='200';

const loadPositionInfo = async (postData, url) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    console.log(">>>> options\r\n" + JSON.stringify(options));
    console.log(`>>> url: ${url}`);

    try {
        const response = await axios.post(url,postData,options);
        statusCode = response.status;
        return response.data;
    } catch (error) {
        statusCode = error.response.status;
        return error;
    }
};

exports.positionPOST = async(event, context) => {
    console.log(`>>> process.env.HERE_API_KEY: ${HERE_API_KEY}`);
    const resourcePath = event.pathParameters.resourcePath;
    let args = ""

    for (let qsp in event.queryStringParameters) {
        let qsa = "&" + qsp + "=" + event['queryStringParameters'][qsp]
        console.log(`>>> QueryStringArg: ${qsa}`)
        args += qsa
    }

    const url = `${HERE_API_URL}/${resourcePath}?apiKey=${HERE_API_KEY}${args}`;

    const postData = event.body;
    console.log(`>>> incoming HTTP POST contents:\r\n${postData}`);

    const hlsAPIResponse = await loadPositionInfo(postData, url);

    const response = {
        statusCode: statusCode,
        body: (parseInt(statusCode) === 200)? JSON.stringify(hlsAPIResponse) : JSON.stringify({"error ":hlsAPIResponse.response.data.error})
    };
    context.succeed(response);
};
