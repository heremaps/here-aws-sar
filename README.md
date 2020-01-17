# AWS SAM for HERE Maps APIs
## Introduction
This project provides [AWS Lambdas](https://aws.amazon.com/lambda/) as __proxies__ for several of the [HERE Location Services APIs](https://developer.here.com/develop/rest-apis). These AWS Lambdas are packaged as per the [AWS Serverless Application Model](https://aws.amazon.com/about-aws/whats-new/2016/11/introducing-the-aws-serverless-application-model/).

"AWS SAM is natively supported by AWS CloudFormation and defines simplified syntax for expressing serverless resources. The specification currently covers APIs, Lambda functions and Amazon DynamoDB tables."

### Benefits

The AWS API Gateway supports configuring both Cache and Throttling, and the lambdas are open source: we welcome pull requests with circuit breakers, graceful error handling, etc.!

## Requirements
To successfully call the HERE Maps APIs through the proxies in this project you need to obtain HERE API credentials. Multiple plans are available: https://aws.amazon.com/marketplace/pp/B07JPLG9SR/?ref=_ptnr_aws_sar_github#pricing-information.

## List of APIs with AWS Lambda Proxies
* [geocode](https://developer.here.com/documentation/geocoder/topics/introduction.html) & [geocode autocomplete](https://developer.here.com/documentation/geocoder-autocomplete/topics/introduction.html)
* [map image](https://developer.here.com/documentation/map-image/topics/introduction.html)
* [map tile](https://developer.here.com/documentation/map-tile/topics/introduction.html)
* [places](https://developer.here.com/documentation/places/topics/introduction.html)
* [position](https://developer.here.com/documentation/positioning/topics/introduction.html)
* [routing](https://developer.here.com/documentation/routing/topics/overview.html) & [routing waypoints aka sequence](https://developer.here.com/documentation/routing-waypoints/topics/introduction.html)
* [tollcost](https://developer.here.com/documentation/toll-cost/topics/introduction.html)
* [traffic](https://developer.here.com/documentation/traffic/topics/introduction.html)
* [transit](https://developer.here.com/documentation/transit/topics/what-is.html)
* [weather](https://developer.here.com/documentation/weather/topics/overview.html)

## Setup
### Step 1: Register for an API Key

Visit the [HERE Location Services on AWS Marketplace](https://aws.amazon.com/marketplace/pp/B07JPLG9SR/?ref=_ptnr_aws_sar_github), and review the [Access Control FAQ](https://developer.here.com/faqs#access-control).

### Step 2: Register an AWS Account

Visit [AWS](https://aws.amazon.com/free/) and sign up for a Free Tier account.

### Step 3: Install the AWS CLI and run "aws configure"

Download and install the [AWS CLI](https://aws.amazon.com/cli/), and run `aws configure` as per the [AWS CLI User Guide](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

### Step 4: Get the Source

From GitHub: clone [this repository](https://github.com/heremaps/here-aws-sar), or download the ZIP.

The folder containing the lambda source code (JS) and CloudFormation templates (YML) is `serverlessFunctions`.

### Step 5: Package

An S3 bucket is required as a destination for the AWS SAM package. If you don't have one already, create one:

`aws s3 mb s3://here-maps-api--aws-sam`

Note: If the folder contains a `package.json` file: run `npm update`:

`x:\src\here-aws-repository\serverlessFunctions\mapimage>npm update`

Use the AWS CLI to package (note the folder layout):

`x:\src\here-aws-repository\serverlessFunctions>aws cloudformation package --s3-bucket here-maps-api--aws-sam --template-file geocode\geocode.yml --output-template-file geocode-packaged.yml`

### Step 6: Deploy

Use the AWS CLI to deploy the AWS SAM package using CloudFormation:

`x:\src\here-aws-repository\serverlessFunctions>aws cloudformation deploy --capabilities CAPABILITY_IAM --stack-name "HERE-Maps-API--GeoCode" --parameter-overrides HereAppId=<appID> HereAppCode=<appCode> --template-file geocode-packaged.yml`

### Step 7: Find new API Gateway URL

Once deployment completes, look for the URL of the new API Gateway. It should follow this pattern:

`https://<apigw>.execute-api.<region>.amazonaws.com/...`

The API Gateway URL is an output from the CloudFormation template and can be found among the tabs when selecting a Stack in the AWS Console.

Alternatively look at the API Gateway in the AWS Console, select Stages, and then expand the tree until you see "Invoke URL".

### Step 8: Secure your API Gateways/Lambdas

Note: The AWS Lambda proxies deployed above do not impose **authentication** or **authorization** restrictions!

__You must decide how you will control access to your API Gateway and Lambdas.__

For guidance, see the [AWS Lambda FAQ](https://aws.amazon.com/lambda/faqs/#security).

Consider implementing [AWS API Gateway Custom Authorizers](http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html).

## HERE Maps APIs with Lambda Proxies
The below list of HERE Maps APIs each has one Lambda as a proxy.

`Note:`
 
`1- All APIs except Map Image and Map Tile will return JSON response. For error scenarios, response JSON will be with 4xx - 5xx response code and details of error.`

`2- For Map Image and MapTile APIs, success response will return base 64 encoding of map image (not JSON) and for failures, message as error in downloading map will be returned.`  

### GeoCode

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|GeoCoder             | `https://geocoder.ls.hereapi.com/`              |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/geocoder/` |
|GeoCoder             | `https://reverse.geocoder.ls.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/reverse.geocoder/` |GeoCode AutoComplete | `https://autocomplete.geocoder.ls.hereapi.com/` |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/autocomplete.geocoder` |

An example of an HTTP GET request to HERE API:

`https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=<apiKey>&searchtext={searchtext}`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/geocoder/6.2/geocode.json?searchtext={searchtext}`

An example of an HTTP GET request to HERE GeoCode AutoComplete API:

`https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?apiKey=<apiKey>&query={query}`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:


An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocodesuggest/api/6.2/suggest.json?query={query}`

The AWS Lambda Proxy URL depends on the base URL type. For example:

* https://geocoder.ls.hereapi.com/6.2/geocode.json

    Base URL: geocoder

    Lambda Proxy URL: /geocode/api/geocoder/

* https://reverse.geocoder.ls.hereapi.com/6.2/multi-reversegeocode.json

    Base URL: reverse.geocoder

    Lambda Proxy URL: /geocode/api/reverse.geocoder/

* https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json

    Base URL: autocomplete.geocoder

    Lambda Proxy URL: /geocode/api/autocomplete.geocoder/

For details please refer [HERE Geocode API](https://developer.here.com/documentation/geocoder/topics/introduction.html) & [HERE Geocode Autocomplete API](https://developer.here.com/documentation/geocoder-autocomplete/topics/introduction.html)

### Map Image

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Images               | `https://image.maps.ls.hereapi.com/`            |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/mapimage/api/` |

An example of an HTTP GET request to HERE API:

`https://image.maps.ls.hereapi.com/mia/1.6/mapview?apiKey=<apiKey>&lat=63.529722&lon=-19.513889`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/mapimage/api/mia/1.6/mapview?t=1&lat=63.529722&lon=-19.513889`

For details please refer [HERE Map Image API](https://developer.here.com/documentation/map-image/topics/introduction.html)

### Map Tile

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|MapTile              | `https://{1-4}.traffic.maps.ls.hereapi.com/`    |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/traffic/`
|MapTile              | `https://{1.4}.base.maps.ls.hereapi.com/`       |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/base/`
|MapTile              | `https://{1.4}.aerial.maps.ls.hereapi.com/`     |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/aerial/`

An example of an HTTP GET request to HERE API:

`https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/13/4400/2686/256/jpg?apiKey=<apiKey>`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/base/maptile/2.1/maptile/newest/normal.day/13/4400/2686/256/jpg`

The AWS Lambda Proxy URL depends on the base URL type. For example:

* https://1.traffic.maps.api.here.com/maptile/2.1/traffictile/newest

    Base URL: traffic

    Lambda Proxy URL: /maptile/api/traffic/

* https://1.base.maps.api.here.com/maptile/2.1/streettile

    Base URL: base

    Lambda Proxy URL: /maptile/api/base/

For details please refer [HERE Map Tile API](https://developer.here.com/documentation/map-tile/topics/introduction.html)

### Places

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Places               | `https://places.ls.hereapi.com/`                |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/places/api/` |

An example of an HTTP GET request to HERE API:

`https://places.ls.hereapi.com/places/v1/autosuggest?apiKey=<apiKey>&at=40.74917,-73.98529&q=chrysler`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/places/api/places/v1/autosuggest?at=40.74917,-73.98529&q=chrysler`

For details please refer [HERE Places API](https://developer.here.com/documentation/places/topics/introduction.html)

### Position

Note: The API type is HTTP **POST**. For GET requests, "Missing Authentication Token" response will be returned from AWS as **POST** type request is expected.   

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Position             | `https://pos.ls.hereapi.com/`                   |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/position/api/` |

An example of an HTTP POST to HERE API:

`https://pos.ls.hereapi.com/positioning/v1/locate?apiKey=<apiKey>`

An example of an HTTP POST to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/position/api/positioning/v1/locate`

Sample Payload : { "gsm": [{ "mcc":262,"mnc":1,"lac":5126,"cid":21857 }] }

For details please refer [HERE Positioning API](https://developer.here.com/documentation/positioning/topics/request-first-locate.html)

### Routing

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Routing              | `https://route.ls.hereapi.com/`                 |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/route/` |
|Routing(Isoline)     | `https://isoline.route.ls.hereapi.com/`         |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/isoline.route/` |
|Routing(Matrix)      | `https://matrix.route.ls.hereapi.com/`          |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/matrix.route/` |

An example of an HTTP GET request to HERE API:

`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=<apiKey>&waypoint0=geo!52.5%2c13.4&waypoint1=geo!52.5%2c13.45&mode=fastest%3bcar%3btraffic:disabled%3b`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/route/routing/7.2/calculateroute.json?waypoint0=geo!52.5%2c13.4&waypoint1=geo!52.5%2c13.45&mode=fastest%3bcar%3btraffic:disabled%3b`

The AWS Lambda Proxy URL depends on the base URL type. For example:

* 	https://route.ls.hereapi.com/routing/7.2/calculateroute.json

    Base URL: route

    Lambda Proxy URL: /routing/api/route/

* https://isoline.route.ls.hereapi.com/routing/7.2/calculateisoline.json

    Base URL: isoline.route

    Lambda Proxy URL: /routing/api/isoline.route/

* 	https://matrix.route.ls.hereapi.com/routing/7.2/calculatematrix.json

    Base URL: matrix.route

    Lambda Proxy URL: /routing/api/matrix.route/

For details please refer [HERE Routing API](https://developer.here.com/documentation/routing/topics/overview.html)

### Waypoint Sequence (Routing)

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Waypoint             | `https://wse.ls.hereapi.com/`                   |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/waypointseq/api/` |

An example of an HTTP GET request to HERE API:

`https://wse.ls.hereapi.com/2/findsequence.json?apiKey=<apiKey>&start=WiesbadenCentralStation;50.0715,8.2434&destination1=FranfurtCentralStation;50.1073,8.6647&destination2=DarmstadtCentralStation;49.8728,8.6326&destination3=FrankfurtAirport;50.050639,8.569641&destination4=HanauCentralStation;50.1218,8.9298&end=MainzCentralStation;50.0021,8.259&improveFor=distance&mode=fastest;truck;traffic:disabled;&hasTrailer=true&limitedWeight=18&height=4.00&width=2.50&length=18.35`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/waypointseq/api/2/findsequence.json?start=WiesbadenCentralStation%3b50.0715%2c8.2434&destination1=FranfurtCentralStation%3b50.1073%2c8.6647&destination2=DarmstadtCentralStation%3b49.8728%2c8.6326&destination3=FrankfurtAirport%3b50.0505%2c8.5698&destination4=HanauCentralStation%3b50.1218%2c8.9298&end=MainzCentralStation%3b50.0021%2c8.259&improveFor=time&mode=fastest%3bcar%3btraffic:disabled%3b`

For details please refer [HERE Routing Waypoints aka Sequence API](https://developer.here.com/documentation/routing-waypoints/topics/introduction.html)

### Toll Cost

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Toll Cost            | `https://tce.api.here.com/2/calculateroute.json`|  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/tollcost` |

An example of an HTTP GET request to HERE API:

`https://tce.api.here.com/2/calculateroute.json?app_id=<appID>&app_code=<appCode>&waypoint0=49.33729606975952%2c0.5986232869327068&waypoint1=49.493527937780975%2c0.10129541603788539&mode=fastest%3bcar%26cost_optimize%3d1`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/tollcost?waypoint0=49.33729606975952%2c0.5986232869327068&waypoint1=49.493527937780975%2c0.10129541603788539&mode=fastest%3bcar%26cost_optimize%3d1`

For details please refer [HERE Toll Cost API](https://developer.here.com/documentation/toll-cost/topics/introduction.html)

### Traffic

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Traffic              | `https://traffic.ls.hereapi.com/`               |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/traffic/api/traffic/` |
|Traffic(tiles)       | `https://{1..4}.traffic.maps.ls.hereapi.com/`   |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/traffic/api/traffic.maps/` |

An example of an HTTP GET request to HERE API:

`https://traffic.ls.hereapi.com/traffic/6.2/incidents/json/8/134/86?apiKey=<apiKey>`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/traffic/api/traffic/traffic/6.3/incidents/json/8/218/99`

The AWS Lambda Proxy URL depends on the base URL type. For example:

* https://1.traffic.maps.ls.hereapi.com/traffic/6.0/tiles/8/133/86/256/png32

    Base URL: traffic.maps

    Lambda Proxy URL: /traffic/api/traffic.maps/

* https://traffic.ls.hereapi.com/traffic/6.0/incidents.json

    Base URL: traffic

    Lambda Proxy URL: /traffic/api/traffic/

For details please refer [HERE Traffic API](https://developer.here.com/documentation/traffic/topics/introduction.html)

### Transit

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Transit              | `https://transit.ls.hereapi.com/`               |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/transit/api/` |

An example of an HTTP GET request to HERE API:

`https://transit.ls.hereapi.com/v3/route.json?apiKey=<apiKey>&arr=41.8961,-87.6552&dep=41.9773,-87.9019&routing=all&time=2019-06-24T07:30:00`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/transit/api/v3/route.json?routing=all&dep=41.9773%2C-87.9019&arr=41.8961%2C-87.6552&time=2019-12-12T07%3A30%3A00`

For details please refer [Public Transit API](https://developer.here.com/documentation/transit/topics/quick-start-routing.html)

### Weather API

Note: The Weather API is not available by default. Please contact the [here.com Sales Team](https://developer.here.com/contact-us#contact-sales) for more information.

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Weather              | `https://weather.ls.hereapi.com/`               |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/weather/api/` |

An example of an HTTP GET request to HERE API:

`https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=<apiKey>&product=observation&name=Berlin-Tegel`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/weather/api/weather/1.0/report.json?product=observation&name=Berlin-Tegel`

For details please refer [HERE Weather API](https://developer.here.com/documentation/weather/topics/overview.html)

## License

Copyright (c) 2017-2019 HERE Europe B.V.

See the [LICENSE](./LICENSE) file in the root of this project for license details.
