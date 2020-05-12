## AWS SAR for HERE Maps APIs
### Introduction
This project provides [AWS Lambdas](https://aws.amazon.com/lambda/) as __proxies__ for several of the [HERE Location Services APIs](https://developer.here.com/develop/rest-apis). These AWS Lambdas are packaged as per the [AWS Serverless Application Model](https://aws.amazon.com/about-aws/whats-new/2016/11/introducing-the-aws-serverless-application-model/).

"AWS SAR is natively supported by AWS CloudFormation and defines simplified syntax for expressing serverless resources. The specification currently covers APIs, Lambda functions and Amazon DynamoDB tables."

### Benefits

The AWS API Gateway supports configuring both Cache and Throttling, and the lambdas are open source: we welcome pull requests with circuit breakers, graceful error handling, etc.!

### Requirements
To successfully call the HERE Maps APIs through the proxies in this project you need to obtain HERE API credentials. Multiple plans are available: https://aws.amazon.com/marketplace/pp/B07JPLG9SR/?ref=_ptnr_aws_sar_github#pricing-information.

### List of APIs with AWS Lambda Proxies
* [Geocoding and Search API v7](https://developer.here.com/documentation/geocoding-search-api/dev_guide/index.html)
* [Map Image](https://developer.here.com/documentation/map-image/topics/introduction.html)
* [Map Tile](https://developer.here.com/documentation/map-tile/topics/introduction.html)
* [Positioning](https://developer.here.com/documentation/positioning/topics/introduction.html)
* [Routing API v8](https://developer.here.com/documentation/routing-api/dev_guide/index.html) & [Routing Waypoints Sequence](https://developer.here.com/documentation/routing-waypoints/dev_guide/topics/what-is.html)
* [Toll Costs](https://developer.here.com/documentation/toll-cost/topics/introduction.html)
* [Traffic](https://developer.here.com/documentation/traffic/topics/introduction.html)
* [Public Transit API v8](https://developer.here.com/documentation/public-transit/dev_guide/index.html)
* [Weather](https://developer.here.com/documentation/weather/topics/overview.html)


### Setup

* ##### Step 1: Register for an API Key

    Visit the [HERE Location Services on AWS Marketplace](https://aws.amazon.com/marketplace/pp/B07JPLG9SR/?ref=_ptnr_aws_sar_github), and review the [Access Control FAQ](https://developer.here.com/faqs#access-control).

* ##### Step 2: Register an AWS Account

    Visit [AWS](https://aws.amazon.com/free/) and sign up for a Free Tier account.

* ##### Step 3: Install the AWS CLI and run "aws configure"

    Download and install the [AWS CLI](https://aws.amazon.com/cli/), and run `aws configure` as per the [AWS CLI User Guide](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

* ##### Step 4: Get the Source

    From GitHub: clone [this repository](https://github.com/heremaps/here-aws-sar), or download the ZIP.

    The folder containing the lambda source code (JS) and CloudFormation templates (YML) is `serverlessFunctions`.

* ##### Step 5: Package

    An S3 bucket is required as a destination for the AWS SAR package. If you don't have one already, create one:

    ```aws s3 mb s3://here-maps-api--aws-sar

    Note: If the folder contains a `package.json` file: run `npm update`:

    `x:\src\here-aws-repository\serverlessFunctions\mapimage>npm update
  ```

    Use the AWS CLI to package (note the folder layout):

    ```x:\src\here-aws-repository\serverlessFunctions>aws cloudformation package --s3-bucket here-maps-api--aws-sar --template-file geocode\geocode.yml --output-template-file geocode-packaged.yml```

* ##### Step 6: Deploy

    Use the AWS CLI to deploy the AWS SAR package using CloudFormation:

    ```x:\src\here-aws-repository\serverlessFunctions>aws cloudformation deploy --capabilities CAPABILITY_IAM --stack-name "HERE-Maps-API--GeoCode" --parameter-overrides HereApiKey=<apiKey> --template-file geocode-packaged.yml```

* ##### Step 7: Find new API Gateway URL

    Once deployment completes, look for the URL of the new API Gateway. It should follow this pattern:

    ```https://<apigw>.execute-api.<region>.amazonaws.com/...```

    The API Gateway URL is an output from the CloudFormation template and can be found among the tabs when selecting a Stack in the AWS Console.

    Alternatively look at the API Gateway in the AWS Console, select Stages, and then expand the tree until you see "Invoke URL".

* ##### Step 8: Secure your API Gateways/Lambdas

    The AWS Lambda proxies deployed above do not impose **authentication** or **authorization** restrictions!


### Help

You must decide how you will control access to your API Gateway and Lambdas.

For guidance, see the [AWS Lambda FAQ](https://aws.amazon.com/lambda/faqs/#security).

Consider implementing [AWS API Gateway Custom Authorizers](http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html).



### HERE Maps APIs with Lambda Proxies

The below list of HERE Maps APIs has one Lambda each as a proxy.

Note:

 * All APIs except Map Image and Map Tile will return JSON response. For error scenarios, response JSON will be with 4xx - 5xx response code and details of error.

 * For Map Image and MapTile APIs, success response will return base 64 encoding of map image (not JSON) and for failures, message as error in downloading map will be returned.


<details>
<summary markdown="span">**Geocoding and Search API v7**</summary>

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|discover             | `https://discover.search.hereapi.com/`              |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
|geocode            | `https://geocode.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
|autosuggest            | `https://autosuggest.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
|browse            | `https://browse.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
|lookup            | `https://lookup.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
|revgeocode            | `https://revgeocode.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |

* For detailed examples refer [here](serverlessFunctions/geocode/README.md).

</details>

<details>
<summary markdown="span">**Map Image**</summary>

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Images               | `https://image.maps.ls.hereapi.com/`            |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/mapimage/api/` |

* For detailed examples refer [here](serverlessFunctions/mapimage/README.md). 

</details>

<details>
<summary markdown="span">**Map Tile**</summary>

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|MapTile              | `https://{1-4}.traffic.maps.ls.hereapi.com/`    |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/traffic/`
|MapTile              | `https://{1.4}.base.maps.ls.hereapi.com/`       |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/base/`
|MapTile              | `https://{1.4}.aerial.maps.ls.hereapi.com/`     |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/aerial/`

* For detailed examples refer [here](serverlessFunctions/maptile/README.md). 

</details>

<details>
<summary markdown="span">**Positioning**</summary>

Note: The API type is HTTP **POST**. For GET requests, "Missing Authentication Token" response will be returned from AWS as **POST** type request is expected.   

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Position             | `https://pos.ls.hereapi.com/`                   |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/position/api/` |

* For detailed examples refer [here](serverlessFunctions/position/README.md). 
</details>

<details>
<summary markdown="span">**Routing API v8 & Routing Waypoints Sequence**</summary>

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|CalculateRoute              | `https://router.hereapi.com/`|  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/` |
|Routing((Isoline))              | `https://isoline.route.ls.hereapi.com/`|  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/isoline.route/` |
|Routing(Matrix)              | `https://matrix.route.ls.hereapi.com/`|  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/matrix.route/` |

* For detailed examples refer [here](serverlessFunctions/routing/README.md). 

</details>

<details>
<summary markdown="span">**Toll Cost**</summary>

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Toll Cost            | `https://tce.api.here.com/2/calculateroute.json`|  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/tollcost` |

* For detailed examples refer [here](serverlessFunctions/tollcost/README.md). 

</details>

<details>
<summary markdown="span">**Traffic**</summary>

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Traffic              | `https://traffic.ls.hereapi.com/`               |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/traffic/api/traffic/` |
|Traffic(tiles)       | `https://{1..4}.traffic.maps.ls.hereapi.com/`   |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/traffic/api/traffic.maps/` |

* For detailed examples refer [here](serverlessFunctions/traffic/README.md). 

</details>  

<details>
<summary markdown="span">**Public Transit API v8**</summary>

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Next Departures              | `https:/transit.hereapi.com/`               |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/transit/api/` |
|Station Search              | `https:/transit.hereapi.com/`               |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/transit/api/` |
|Routing              | `https:/transit.router.hereapi.com/`               |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/transit/api/` |

* For detailed examples refer [here](serverlessFunctions/transit/README.md). 

</details>

<details>
<summary markdown="span">**Weather**</summary>

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Weather              | `https://weather.ls.hereapi.com/`               |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/weather/api/` |

* For detailed examples refer [here](serverlessFunctions/weather/README.md). 

 </details>

### License 

Copyright (c) 2017-2019 HERE Europe B.V.

See the [LICENSE](./LICENSE) file in the root of this project for license details.
