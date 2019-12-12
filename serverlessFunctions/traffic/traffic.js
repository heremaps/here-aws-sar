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

// https://developer.here.com/documentation/traffic/topics/introduction.html

'use strict';

const HERE_API = 'https://traffic.ls.hereapi.com/traffic/6.3/incidents/json';

const axios = require("axios");
let statusCode ='200';

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

exports.trafficGET = async(event, context) => {
    console.log(`>>> process.env.HERE_API_KEY: ${process.env.HERE_API_KEY}`);


    const url = `${HERE_API}/${event.pathParameters.A}/${event.pathParameters.B}/${event.pathParameters.C}?apiKey=${process.env.HERE_API_KEY}`;
    console.log(`url: ${url}`);

    const hlsAPIResponse = await getData(url);

    const response = {
        statusCode: statusCode,
        // headers: { 'Access-Control-Allow-Origin': '*' },
        body: (statusCode == '200')? JSON.stringify(hlsAPIResponse) :JSON.stringify({"Details":hlsAPIResponse.response.data.Details , "AdditionalData":hlsAPIResponse.response.data.AdditionalData ,
            "type":hlsAPIResponse.response.data.type ,"subtype":hlsAPIResponse.response.data.subtype})
    };
    context.succeed(response);
};