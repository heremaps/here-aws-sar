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

// https://developer.here.com/documentation/map-image/topics/introduction.html

'use strict';

const fs = require('fs');
const request = require('request');
const HERE_API = "https://image.maps.api.here.com/mia/1.6/mapview";
const HERE_APP_ID = process.env.HERE_APP_ID;
const HERE_APP_CODE = process.env.HERE_APP_CODE;

const postProcessResource = (resource, callback) => {
    let ret = null;
    if (resource) {
        if (callback) {
            ret = callback(resource);
        }
        try {
            fs.unlinkSync(resource);
        } catch (err) {
            // Ignore
        }
    }
    return ret;
};

var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body){

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

exports.mapimageGET = (event, context, callback) => {
    console.log(`>>> process.env.HERE_APP_ID: ${process.env.HERE_APP_ID}`);
    console.log(`>>> process.env.HERE_APP_CODE: ${process.env.HERE_APP_CODE}`);
    console.log(`>>> event:\r\n${JSON.stringify(event)}`);

    let args = ""
    for (let qsp in event.params.querystring) {
        let qsa = "&" + qsp + "=" + event.params.querystring[qsp]
        console.log(`>>> QueryStringArg: ${qsa}`)
        args += qsa
    }

    const filename = "/tmp/mapview.png";
    const url = `${HERE_API}?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}${args}`;
    console.log(`>> url: ${url}`);

    download(url, filename, function(){
        console.log('download to disk completed');
        callback(null,
            postProcessResource(
                filename,
                (file) => new Buffer(fs.readFileSync(file)).toString('base64')
        )
    );
    });
};