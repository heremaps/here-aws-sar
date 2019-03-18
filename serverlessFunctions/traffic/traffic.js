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

const HERE_API = 'https://traffic.api.here.com/traffic/6.3/incidents/json'

const https = require("https");

function queryApi(url, callback) {
    https.get(url, res => {
        res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
        body += data;
});
    res.on("end", () => {
        callback(body);
});
});
}

exports.trafficGET = (event, context, callback) => {
    console.log(`>>> process.env.HERE_APP_ID: ${process.env.HERE_APP_ID}`);
    console.log(`>>> process.env.HERE_APP_CODE: ${process.env.HERE_APP_CODE}`);
    console.log(`>>> event.pathParameters.A: ${event.pathParameters.A}`);
    console.log(`>>> event.pathParameters.B: ${event.pathParameters.B}`);
    console.log(`>>> event.pathParameters.C: ${event.pathParameters.C}`);

    const url = `${HERE_API}/${event.pathParameters.A}/${event.pathParameters.B}/${event.pathParameters.C}?app_id=${process.env.HERE_APP_ID}&app_code=${process.env.HERE_APP_CODE}`;
    console.log(`url: ${url}`);

    queryApi(url, (body) => { callback(null, { body: body }); });
}