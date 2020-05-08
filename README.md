# AWS SAR for HERE Maps APIs
## Introduction
This project provides [AWS Lambdas](https://aws.amazon.com/lambda/) as __proxies__ for several of the [HERE Location Services APIs](https://developer.here.com/develop/rest-apis). These AWS Lambdas are packaged as per the [AWS Serverless Application Model](https://aws.amazon.com/about-aws/whats-new/2016/11/introducing-the-aws-serverless-application-model/).

"AWS SAR is natively supported by AWS CloudFormation and defines simplified syntax for expressing serverless resources. The specification currently covers APIs, Lambda functions and Amazon DynamoDB tables."

### Benefits

The AWS API Gateway supports configuring both Cache and Throttling, and the lambdas are open source: we welcome pull requests with circuit breakers, graceful error handling, etc.!

## Requirements
To successfully call the HERE Maps APIs through the proxies in this project you need to obtain HERE API credentials. Multiple plans are available: https://aws.amazon.com/marketplace/pp/B07JPLG9SR/?ref=_ptnr_aws_sar_github#pricing-information.

## List of APIs with AWS Lambda Proxies
* [Geocoding and Search API v7](https://developer.here.com/documentation/geocoding-search-api/dev_guide/index.html)
* [Map Image](https://developer.here.com/documentation/map-image/topics/introduction.html)
* [Map Tile](https://developer.here.com/documentation/map-tile/topics/introduction.html)
* [Positioning](https://developer.here.com/documentation/positioning/topics/introduction.html)
* [Routing API v8](https://developer.here.com/documentation/routing-api/dev_guide/index.html) & [Routing Waypoints Sequence](https://developer.here.com/documentation/routing-waypoints/dev_guide/topics/what-is.html)
* [Toll Costs](https://developer.here.com/documentation/toll-cost/topics/introduction.html)
* [Traffic](https://developer.here.com/documentation/traffic/topics/introduction.html)
* [Public Transit API v8](https://developer.here.com/documentation/public-transit/dev_guide/index.html)
* [Weather](https://developer.here.com/documentation/weather/topics/overview.html)

<details>
  <summary markdown="span">Setup</summary>

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

An S3 bucket is required as a destination for the AWS SAR package. If you don't have one already, create one:

`aws s3 mb s3://here-maps-api--aws-sar`

Note: If the folder contains a `package.json` file: run `npm update`:

`x:\src\here-aws-repository\serverlessFunctions\mapimage>npm update`

Use the AWS CLI to package (note the folder layout):

`x:\src\here-aws-repository\serverlessFunctions>aws cloudformation package --s3-bucket here-maps-api--aws-sar --template-file geocode\geocode.yml --output-template-file geocode-packaged.yml`

### Step 6: Deploy

Use the AWS CLI to deploy the AWS SAR package using CloudFormation:

`x:\src\here-aws-repository\serverlessFunctions>aws cloudformation deploy --capabilities CAPABILITY_IAM --stack-name "HERE-Maps-API--GeoCodev" --parameter-overrides HereApiKey=<apiKey> --template-file geocode-packaged.yml`

### Step 7: Find new API Gateway URL

Once deployment completes, look for the URL of the new API Gateway. It should follow this pattern:

`https://<apigw>.execute-api.<region>.amazonaws.com/...`

The API Gateway URL is an output from the CloudFormation template and can be found among the tabs when selecting a Stack in the AWS Console.

Alternatively look at the API Gateway in the AWS Console, select Stages, and then expand the tree until you see "Invoke URL".

### Step 8: Secure your API Gateways/Lambdas

Note: The AWS Lambda proxies deployed above do not impose **authentication** or **authorization** restrictions!
</details>

<details>
<summary markdown="span">Help</summary>

__You must decide how you will control access to your API Gateway and Lambdas.__

For guidance, see the [AWS Lambda FAQ](https://aws.amazon.com/lambda/faqs/#security).

Consider implementing [AWS API Gateway Custom Authorizers](http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html).

</details>

## HERE Maps APIs with Lambda Proxies
The below list of HERE Maps APIs each has one Lambda as a proxy.

`Note:`
 
 * `1- All APIs except Map Image and Map Tile will return JSON response. For error scenarios, response JSON will be with 4xx - 5xx response code and details of error.`

 * `2- For Map Image and MapTile APIs, success response will return base 64 encoding of map image (not JSON) and for failures, message as error in downloading map will be returned.`  

<details>
<summary markdown="span"><b><em>Geocoding and Search API v7<b><em></summary>

### Geocoding and Search API v7

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Geocoding-Search-discover             | `https://discover.search.hereapi.com/`              |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
|Geocoding-Search-geocode            | `https://geocode.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
|Geocoding-Search-autosuggest            | `https://autosuggest.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
|Geocoding-Search-browse            | `https://browse.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
|Geocoding-Search-lookup            | `https://lookup.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
|Geocoding-Search-revgeocode            | `https://revgeocode.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |

An example of an HTTP GET request to HERE Geocoding and Search API v7 & equivalent AWS Lambda Proxy:
<details>
  <summary markdown="span">discover</summary>

  An example of an HTTP GET request to discover API:  

  `https://discover.search.hereapi.com/v1/discover?apikey=<apikey>&at=42.36399,-71.05493&limit=1&q=restaurant&in=countryCode:USA`

   To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

__Equivalent AWS Lambda Proxy for discover API :__

  API Gateway URL format:
  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/{resourcePath+}`

  {resourcePath+}: `v1/discover?at=42.36399,-71.05493&limit=1&q=restaurant&in=countryCode:USA`

  API Gateway URL:
   `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/v1/discover?at=42.36399,-71.05493&limit=1&  q=restaurant&in=countryCode:USA`

The AWS Lambda Proxy URL depends on the base URL type. For example:

*  https://discover.search.hereapi.com/v1/discover

   Lambda Proxy URL: /geocode/api/v1/discover/

 </details>

<details>
<summary markdown="span">geocode</summary>

 An example of an HTTP GET request to HERE geocode API: 

`https://geocode.search.hereapi.com/v1/geocode?apikey=<apikey>&q=5 Rue Daunou, 75000 Paris, France`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

__Equivalent AWS Lambda Proxy for HERE geocode API:__

 API Gateway URL format:
`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/{resourcePath+}`

 {resourcePath+}: `v1/geocode?q=5 Rue Daunou, 75000 Paris, France`

 API Gateway URL:
  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/v1/geocode?q=5 Rue Daunou, 75000 Paris, France`

  The AWS Lambda Proxy URL depends on the base URL type. For example:

* https://geocode.search.hereapi.com/v1/geocode

    Lambda Proxy URL: /geocode/api/v1/geocode/
   
</details>

<details>
  <summary markdown="span">autosuggest</summary>

 An example of an HTTP GET request to HERE autosuggest API

`https://autosuggest.search.hereapi.com/v1/autosuggest?apikey=<apikey>&at=52.5199813,13.3985138&q=berlin bran`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

__Equivalent AWS Lambda Proxy for HERE autosuggest API:__

 API Gateway URL format:
`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/{resourcePath+}`

 {resourcePath+}: `v1/autosuggest?at=52.5199813,13.3985138&q=berlin bran`

 API Gateway URL:
 `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/v1/autosuggest?at=52.5199813,13.3985138&q=berlin bran`

The AWS Lambda Proxy URL depends on the base URL type. For example:

 * https://autosuggest.search.hereapi.com/v1/autosuggest

    Lambda Proxy URL: /geocode/api/v1/autosuggest/

</details>

<details>
  <summary markdown="span">browse</summary>

 An example of an HTTP GET request to HERE browse API

  `https://browse.search.hereapi.com/v1/browse?apikey=<apikey>&at=-23.000813,-43.351629&limit=2&categories=100-1100,200-2000-0011,100-1000`

  To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

 __Equivalent AWS Lambda Proxy for HERE browse API:__

   API Gateway URL format:
   `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/{resourcePath+}`

   {resourcePath+}: `v1/browse?at=-23.000813,-43.351629&limit=2&categories=100-1100,200-2000-0011,100-1000`

   API Gateway URL:
   `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/v1/browse?at=42.36399,-71.05493&limit=1&q=restaurant&in=countryCode:USA`

   The AWS Lambda Proxy URL depends on the base URL type. For example:
   
* https://browse.search.hereapi.com/v1/browse

  Lambda Proxy URL: /geocode/api/v1/browse/

   </details>

<details>
  <summary markdown="span">lookup</summary>

   An example of an HTTP GET request to HERE lookup API:

  `https://lookup.search.hereapi.com/v1/lookup?apikey=<apikey>& id=here:pds:place:276u0vhj-b0bace6448ae4b0fbc1d5e323998a7d2`

   To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

__Equivalent AWS Lambda Proxy for HERE lookup API:__

  API Gateway URL format:
 `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/{resourcePath+}`

  {resourcePath+}: `v1/lookup?id=here:pds:place:276u0vhj-b0bace6448ae4b0fbc1d5e323998a7d2`

  API Gateway URL:
  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/v1/lookup?at=42.36399,-71.05493&limit=1&q=restaurant&in=countryCode:USA`

  The AWS Lambda Proxy URL depends on the base URL type. For example:

   * https://lookup.search.hereapi.com/v1/lookup

   Lambda Proxy URL: /geocode/api/v1/lookup/

   </details>

<details>
  <summary markdown="span">revgeocode</summary>
 
  An example of an HTTP GET request to HERE revgeocode API:

 `https://revgeocode.search.hereapi.com/v1/revgeocode?apikey=<apikey>&at=48.2181679%2C16.3899064&lang=en-US`

  To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

__Equivalent AWS Lambda Proxy for HERE revgeocode API:__

  API Gateway URL format:
   `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/{resourcePath+}`

  {resourcePath+}: `v1/revgeocode?at=42.36399,-71.05493&limit=1&q=restaurant&in=countryCode:USA`

  API Gateway URL:
  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/v1/revgeocode?at=48.2181679%2C16.3899064&lang=en-US`

   The AWS Lambda Proxy URL depends on the base URL type. For example:

  * https://revgeocode.search.hereapi.com/v1/revgeocode

   Lambda Proxy URL: /geocode/api/v1/revgeocode/

   </details>
   
For details please refer [HERE Geocoding and Search API v7](https://developer.here.com/documentation/geocoding-search-api/dev_guide/index.html) 

</details>

<details>
<summary markdown="span"><b><em>Map Image<b><em></summary>

### Map Image

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Images               | `https://image.maps.ls.hereapi.com/`            |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/mapimage/api/` |

<details>
  <summary markdown="span">Map Image HTTP and Proxy URL</summary>

An example of an HTTP GET request to HERE Map Image API:

`https://image.maps.ls.hereapi.com/mia/1.6/mapview?apiKey=<apiKey>&lat=63.529722&lon=-19.513889`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

__Equivalent AWS Lambda Proxy for HERE Map Image API:__

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/mapimage/api/mia/1.6/mapview?t=1&lat=63.529722&lon=-19.513889`

</details>

For details please refer [HERE Map Image API](https://developer.here.com/documentation/map-image/topics/introduction.html)

</details>

<details>
<summary markdown="span"><b><em>Map Tile<b><em></summary>

### Map Tile

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|MapTile              | `https://{1-4}.traffic.maps.ls.hereapi.com/`    |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/traffic/`
|MapTile              | `https://{1.4}.base.maps.ls.hereapi.com/`       |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/base/`
|MapTile              | `https://{1.4}.aerial.maps.ls.hereapi.com/`     |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/aerial/`

<details>
  <summary markdown="span">Map Tile HTTP and Proxy URL</summary>

An example of an HTTP GET request to HERE Map Tile API:

`https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/13/4400/2686/256/jpg?apiKey=<apiKey>`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

__Equivalent AWS Lambda Proxy for HERE Map Tile API:__

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/base/maptile/2.1/maptile/newest/normal.day/13/4400/2686/256/jpg`

The AWS Lambda Proxy URL depends on the base URL type. For example:

* https://1.traffic.maps.api.here.com/maptile/2.1/traffictile/newest

    Base URL: traffic

    Lambda Proxy URL: /maptile/api/traffic/

* https://1.base.maps.api.here.com/maptile/2.1/streettile

    Base URL: base

    Lambda Proxy URL: /maptile/api/base/

 </details>   
 
For details please refer [HERE Map Tile API](https://developer.here.com/documentation/map-tile/topics/introduction.html)

</details>

<details>
<summary markdown="span"><b><em>Positioning<b><em></summary>

### Positioning

Note: The API type is HTTP **POST**. For GET requests, "Missing Authentication Token" response will be returned from AWS as **POST** type request is expected.   

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Position             | `https://pos.ls.hereapi.com/`                   |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/position/api/` |

<details>
  <summary markdown="span">Positioning HTTP and Proxy URL</summary>

An example of an HTTP POST to HERE Positioning API:

`https://pos.ls.hereapi.com/positioning/v1/locate?apiKey=<apiKey>`

 __Equivalent AWS Lambda Proxy for HERE Positioning API:__

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/position/api/positioning/v1/locate`

Sample Payload : { "gsm": [{ "mcc":262,"mnc":1,"lac":5126,"cid":21857 }] }

</details>

For details please refer [HERE Positioning API](https://developer.here.com/documentation/positioning/topics/request-first-locate.html)

</details>

<details>
<summary markdown="span"><b><em>Routing API v8 & Routing Waypoints Sequence<b><em></summary>

### Routing API v8

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|CalculateRoute              | `https://router.hereapi.com/`|  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/` |
|Routing((Isoline))              | `https://isoline.route.ls.hereapi.com/`|  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/isoline.route/` |
|Routing(Matrix)              | `https://matrix.route.ls.hereapi.com/`|  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/matrix.route/` |

<details>
  <summary markdown="span">CalculateRoute HTTP and Proxy URL</summary>

 An example of an HTTP GET request to HERE CalculateRoute API:

 `https://router.hereapi.com/v8/routes?apikey=<apiKey>&transportMode=car&origin=52.5308,13.3847&destination=52.5323,13.3789&return=summary`

  To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

 __Equivalent AWS Lambda Proxy for HERE Routing API v8(Calculate Route API):__

  API Gateway URL format:

 `https://bn5llxp5m3.execute-api.us-west-2.amazonaws.com/Prod/calculateRoute/api/{resourcePath+}`

 {resourcePath+}: `v8/routes?transportMode=car&origin=52.5308,13.3847&destination=52.5323,13.3789&return=summary`

API Gateway URL:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/calculateRoute/api/v8/routes?transportMode=car&origin=52.5308,13.3847&destination=52.5323,13.3789&return=summary`

</details>
    
For details please refer [HERE Routing API v8(Calculate Route API)](https://developer.here.com/documentation/routing-api/api-reference-swagger.html)

<details>
  <summary markdown="span">Routing(Isoline) HTTP and Proxy URL</summary>

 An example of an HTTP GET request to HERE Routing(Isoline) API:

`https://isoline.route.ls.hereapi.com/routing/7.2/calculateisoline.json?apiKey=<apiKey>&mode=fastest%3Bpedestrian&start=52.5160%2C13.3778&rangetype=distance&range=2000`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

__Equivalent AWS Lambda Proxy for HERE Routing(Isoline) API:__

API Gateway URL format:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/{type}/{resourcePath+}`

{type}: isoline.route

{resourcePath+}: `routing/7.2/calculateisoline.json?mode=fastest%3Bpedestrian&start=52.5160%2C13.3778&rangetype=distance&range=2000`

API Gateway URL:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/isoline.route/routing/7.2/calculateisoline.json?mode=fastest%3Bpedestrian&start=52.5160%2C13.3778&rangetype=distance&range=2000`
The AWS Lambda Proxy URL depends on the base URL type. For example:

`https://isoline.route.ls.hereapi.com/routing/7.2/calculateisoline.json`

Base URL/type: isoline.route

Lambda Proxy URL: /routing/api/isoline.route/

</details>

<details>
  <summary markdown="span">Routing(Matrix) HTTP and Proxy URL</summary>

 An example of an HTTP GET request to HERE Routing(Matrix):

`https://matrix.route.ls.hereapi.com/routing/7.2/calculatematrix.json?apiKey=<apiKey>&mode=fastest%3Btruck%3Btraffic%3Adisabled%3B&start0=40.7790%2C-73.9622&destination0=40.7482%2C-73.9860&destination1=40.7558%2C-73.9870&destination2=40.7054%2C-73.9961`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

__Equivalent AWS Lambda Proxy for HERE Routing(Matrix) API:__

API Gateway URL format:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/{type}/{resourcePath+}`

{type}: matrix.route

{resourcePath+}: `routing/7.2/calculatematrix.json?apiKey=<apiKey>&mode=fastest%3Btruck%3Btraffic%3Adisabled%3B&start0=40.7790%2C-73.9622&destination0=40.7482%2C-73.9860&destination1=40.7558%2C-73.9870&destination2=40.7054%2C-73.9961`

API Gateway URL:

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/matrix.route/routing/7.2/calculatematrix.json?mode=fastest%3Btruck%3Btraffic%3Adisabled%3B&start0=40.7790%2C-73.9622&destination0=40.7482%2C-73.9860&destination1=40.7558%2C-73.9870&destination2=40.7054%2C-73.9961`

The AWS Lambda Proxy URL depends on the base URL type. For example:

`https://matrix.route.ls.hereapi.com/routing/7.2/calculatematrix.json`

Base URL/type: matrix.route

Lambda Proxy URL: /routing/api/matrix.route/

</details>

 
 For details please refer [HERE Routing(isoline & matrix)](https://developer.here.com/documentation/routing/dev_guide/topics/what-is.html)

<details>
<summary markdown="span">Waypoint Sequence (Routing)</summary>

### Waypoint Sequence (Routing)

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Waypoint             | `https://wse.ls.hereapi.com/`                   |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/waypointseq/api/` |

<details>
  <summary markdown="span">Waypoint Sequence HTTP and Proxy URL</summary>

An example of an HTTP GET request to HERE Waypoint Sequence API:

`https://wse.ls.hereapi.com/2/findsequence.json?apiKey=<apiKey>&start=WiesbadenCentralStation;50.0715,8.2434&destination1=FranfurtCentralStation;50.1073,8.6647&destination2=DarmstadtCentralStation;49.8728,8.6326&destination3=FrankfurtAirport;50.050639,8.569641&destination4=HanauCentralStation;50.1218,8.9298&end=MainzCentralStation;50.0021,8.259&improveFor=distance&mode=fastest;truck;traffic:disabled;&hasTrailer=true&limitedWeight=18&height=4.00&width=2.50&length=18.35`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

__Equivalent AWS Lambda Proxy for HERE Waypoint Sequence API:__

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/waypointseq/api/2/findsequence.json?start=WiesbadenCentralStation%3b50.0715%2c8.2434&destination1=FranfurtCentralStation%3b50.1073%2c8.6647&destination2=DarmstadtCentralStation%3b49.8728%2c8.6326&destination3=FrankfurtAirport%3b50.0505%2c8.5698&destination4=HanauCentralStation%3b50.1218%2c8.9298&end=MainzCentralStation%3b50.0021%2c8.259&improveFor=time&mode=fastest%3bcar%3btraffic:disabled%3b`

</details>
</details>

For details please refer [HERE Routing API v8](https://developer.here.com/documentation/routing-api/dev_guide/index.html) & [HERE Routing Waypoints Sequence](https://developer.here.com/documentation/routing-waypoints/dev_guide/topics/what-is.html)

</details>

<details>
<summary markdown="span"><b><em>Toll Cost<b><em></summary>

### Toll Cost

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Toll Cost            | `https://tce.api.here.com/2/calculateroute.json`|  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/tollcost` |

<details>
  <summary markdown="span">Toll Cost HTTP and Proxy URL</summary>

 An example of an HTTP GET request to HERE Toll Cost API:

`https://tce.api.here.com/2/calculateroute.json?app_id=<appID>&app_code=<appCode>&waypoint0=49.33729606975952%2c0.5986232869327068&waypoint1=49.493527937780975%2c0.10129541603788539&mode=fastest%3bcar%26cost_optimize%3d1`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

__Equivalent AWS Lambda Proxy for HERE Toll Cost API:__

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/tollcost?waypoint0=49.33729606975952%2c0.5986232869327068&waypoint1=49.493527937780975%2c0.10129541603788539&mode=fastest%3bcar%26cost_optimize%3d1`

</details>

For details please refer [HERE Toll Cost API](https://developer.here.com/documentation/toll-cost/topics/introduction.html)

</details>

<details>
<summary markdown="span"><b><em>Traffic<b><em></summary>

### Traffic

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Traffic              | `https://traffic.ls.hereapi.com/`               |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/traffic/api/traffic/` |
|Traffic(tiles)       | `https://{1..4}.traffic.maps.ls.hereapi.com/`   |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/traffic/api/traffic.maps/` |

<details>
  <summary markdown="span">Traffic HTTP and Proxy URL</summary>

 An example of an HTTP GET request to HERE Traffic API:

`https://traffic.ls.hereapi.com/traffic/6.2/incidents/json/8/134/86?apiKey=<apiKey>`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

__Equivalent AWS Lambda Proxy for HERE Traffic API:__

`https://<apigw>.execute-api.<region>.amazonaws.com/Prod/traffic/api/traffic/traffic/6.3/incidents/json/8/218/99`

The AWS Lambda Proxy URL depends on the base URL type. For example:

* https://1.traffic.maps.ls.hereapi.com/traffic/6.0/tiles/8/133/86/256/png32

    Base URL: traffic.maps

    Lambda Proxy URL: /traffic/api/traffic.maps/

* https://traffic.ls.hereapi.com/traffic/6.0/incidents.json

    Base URL: traffic

    Lambda Proxy URL: /traffic/api/traffic/

  </details>

For details please refer [HERE Traffic API](https://developer.here.com/documentation/traffic/topics/introduction.html)

  </details>  

<details>
<summary markdown="span"><b><em>Public Transit API v8<b><em></summary>

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Next Departures              | `https:/transit.hereapi.com/`               |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/transit/api/` |
|Station Search              | `https:/transit.hereapi.com/`               |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/transit/api/` |
|Routing              | `https:/transit.router.hereapi.com/`               |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/transit/api/` |

An example of an HTTP GET request to HERE Public Transit API v8 & equivalent AWS Lambda Proxy:
<details>
  <summary markdown="span">Next Departures HTTP and Proxy URL</summary>

  An example of an HTTP GET request to HERE Next Departures API:

  `https:/transit.hereapi.com/v8/departures?apiKey=<apiKey>&ids=415712992`

   To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change resourcePath and Query String Parameters as follows:

  __Equivalent AWS Lambda Proxy for Next Departures:__

   API Gateway URL format:

   `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/transit/api/{type}/{resourcePath+}`

   {type}:`transit`

   {resourcePath+}: `v8/departures?ids=415712992`

   API Gateway URL:

   `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/transit/api/transit/v8/departures?ids=415712992`

   </details>

<details>
  <summary markdown="span">Station Search HTTP and Proxy URL</summary>

  An example of an HTTP GET request to HERE Station Search:
  
  `https:/transit.hereapi.com/v8/stations?apiKey=<apiKey>&in=41.90123,12.500912`

  To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change resourcePath and Query String Parameters as follows:

  __Equivalent AWS Lambda Proxy for HERE Station Search:__

   API Gateway URL format:

   `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/transit/api/{type}/{resourcePath+}`

   {type}:`transit`

   {resourcePath+}: `v8/stations?in=41.90123,12.50091`

   API Gateway URL:

   `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/transit/api/transit/v8/stations?in=41.90123,12.50091`

   </details>

  <details>
  <summary markdown="span">Routing HTTP and Proxy URL</summary>

   An example of an HTTP GET request to HERE Transit Routing API:

  `https://transit.router.hereapi.com/v8/routes?apiKey=<apiKey>&ids=415712992`

   To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change resourcePath and Query String Parameters as follows:

   __Equivalent AWS Lambda Proxy for HERE Transit Routing API:__

   API Gateway URL format:

   `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/transit/api/{type}/{resourcePath+}`

   {type}:`transit.router`

   {resourcePath+}: `v8/routes?origin=41.79457,12.25473&destination=1.90096,12.50243`

   API Gateway URL:
   `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/transit/api/transit.router/v8/routes?origin=41.79457,12.25473&destination=1.90096,12.50243`

   </details>

  For details please refer [HERE Public Transit v8 API](https://developer.here.com/documentation/public-transit/api-reference-swagger.html)

</details>

<details>
<summary markdown="span"><b><em>Weather<b><em></summary>

### Weather

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Weather              | `https://weather.ls.hereapi.com/`               |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/weather/api/` |

An example of an HTTP GET request to HERE Weather API & equivalent AWS Lambda Proxy:

<details>
<summary markdown="span">Weather HTTP and Proxy URL</summary>
  
An example of an HTTP GET request to HERE Weather API:

`https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=<apiKey>&product=observation&name=Berlin-Tegel`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change resourcePath and Query String Parameters as follows:

__Equivalent AWS Lambda Proxy for HERE Weather API:__

   API Gateway URL format:

   `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/weather/api/{resourcePath+}`

   {resourcePath+}: `weather/1.0/report.json?product=observation&name=Berlin-Tegel`

   API Gateway URL:

   `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/weather/api/weather/1.0/report.json?product=observation&name=Berlin-Tegel`

   </details>
  
For details please refer [HERE Weather API](https://developer.here.com/documentation/weather/topics/overview.html)

 </details>

## License 

Copyright (c) 2017-2019 HERE Europe B.V.

See the [LICENSE](./LICENSE) file in the root of this project for license details.
