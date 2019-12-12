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

// https://developer.here.com/documentation/map-tile/topics/overview.html

'use strict';

const fs = require('fs');
const axios = require("axios");
const HERE_API_KEY = process.env.HERE_API_KEY;
let statusCode, result;

const postProcessResource = async(resource, readFile) => {
    let ret = null;
    if (resource) {
        if (readFile) {
            ret = readFile(resource);
        }
        try {
            fs.unlinkSync(resource);
        } catch (err) {
            // Ignore
            console.log('unlinkSync err:'+err);
        }
    }
    return ret;
};

const download = async (url, filename) => {
    const writer = fs.createWriteStream(filename);

    await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    }).then((response) => {
        response.data.pipe(writer);

        console.log('response status:'+response.status);

        return new Promise((resolve, reject) => {
            writer.on('finish',() => {
                statusCode=response.status;
                resolve();
            });
            writer.on('error',(error) => {
                console.log('error in writing to file:'+error);
                statusCode="500";
                reject(new Error("error in writing to file"));
            });
        });
    },(error) =>{
        console.log('error in downloading map:'+error);
        statusCode = (error.response.status)? error.response.status : "500";
    });
};

exports.maptileGET = async (event, context) => {
    console.log(`>>> HERE_API_KEY: ${HERE_API_KEY}`);
    console.log(`>>> event:\r\n${JSON.stringify(event)}`);

    let args = "";
    for (let qsp in event.params.querystring) {
        let qsa = "&" + qsp + "=" + event.params.querystring[qsp]
        console.log(`>>> QueryStringArg: ${qsa}`)
        args += qsa
    }

    const type = event.params.path.type;
    const scheme = event.params.path.scheme;
    const zoomlevel = event.params.path.zoomlevel;
    const col = event.params.path.col;
    const row = event.params.path.row;
    const rez = event.params.path.rez;

    const HERE_API = `https://1.${type}.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${scheme}/${zoomlevel}/${col}/${row}/${rez}/jpg`;

    const filename = "/tmp/maptile.png";
    const url = `${HERE_API}?apiKey=${HERE_API_KEY}`;
    console.log(`URL: ${url}`);

    await download(url, filename);

    if(statusCode == "200") {
        result = await postProcessResource(filename, (file) => new Buffer(fs.readFileSync(file)).toString('base64'));
        context.succeed(result);
    }
    else {
        context.fail('error in downloading map.');
    }
};
