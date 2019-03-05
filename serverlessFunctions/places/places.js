/*
 * Copyright (c) 2017 HERE Europe B.V.
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

// https://developer.here.com/documentation/places/topics/introduction.html

'use strict';

const HERE_API = 'https://places.api.here.com/places/v1/autosuggest'

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

exports.placesGET = (event, context, callback) => {
    console.log(`>>> process.env.HERE_APP_ID: ${process.env.HERE_APP_ID}`);
    console.log(`>>> process.env.HERE_APP_CODE: ${process.env.HERE_APP_CODE}`);

    let args = ""
    for (let qsp in event.queryStringParameters) {
        let qsa = "&" + qsp + "=" + event['queryStringParameters'][qsp]
        console.log(`>>> QueryStringArg: ${qsa}` )
        args += qsa
    }

    const url = `${HERE_API}?app_id=${process.env.HERE_APP_ID}&app_code=${process.env.HERE_APP_CODE}` + args;
    console.log(`>>> url: ${url}`);

    queryApi(url, (body) => { callback(null, { body: body }); });
}