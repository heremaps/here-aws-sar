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

const HERE_API_URL = 'https://geocoder.api.here.com/6.2/geocode.json';
const HERE_API_APP_ID = process.env.HERE_APP_ID;
const HERE_API_APP_CODE = process.env.HERE_APP_CODE;
let statusCode = '200';

const getData = async url => {
    try {
        const response = await axios.get(url);
        statusCode = response.status;
        return response.data;
    } catch (error) {
        statusCode = error.response.status;
        console.log('error:'+error.response.data.Details);
        return error;
    }
};

exports.geocodeGET = async (event, context) => {
    console.log(`>>> HERE_API: ${HERE_API_URL}`);
    console.log(`>>> HERE_API_APP_ID: ${HERE_API_APP_ID}`);
    console.log(`>>> HERE_API_APP_CODE: ${HERE_API_APP_CODE}`);

    const searchtext = event.pathParameters.searchtext;
    console.log(`>>> searchtext: ${searchtext}`);

    const url = `${HERE_API_URL}?app_id=${HERE_API_APP_ID}&app_code=${HERE_API_APP_CODE}&searchtext=${searchtext}`;
    console.log(`>>> url: ${url}`);

    const hlsAPIResponse = await getData(url);

    const response = {
        statusCode: statusCode,
        // headers: { 'Access-Control-Allow-Origin': '*' },
        body: (statusCode == '200')? JSON.stringify(hlsAPIResponse) : JSON.stringify({ 'message' : hlsAPIResponse.response.data.Details })
    };

    context.succeed(response);
};