# AWS SAM for HERE Location Service APIs - Routing
## Introduction
This project provides [AWS Lambda](https://aws.amazon.com/lambda/) as __proxy__ for [HERE Routing API](https://developer.here.com/documentation/routing/topics/overview.html). This AWS Lambda is packaged as per the [AWS Serverless Application Model](https://aws.amazon.com/about-aws/whats-new/2016/11/introducing-the-aws-serverless-application-model/).

"AWS SAM is natively supported by AWS CloudFormation and defines simplified syntax for expressing serverless resources. The specification currently covers APIs, Lambda functions and Amazon DynamoDB tables."

### Benefits

The AWS API Gateway supports configuring both Cache and Throttling, and the lambdas are open source: we welcome pull requests with circuit breakers, graceful error handling, etc.!

## Requirements
To successfully call the [HERE Routing API](https://developer.here.com/documentation/routing/topics/overview.html) through the proxy in this project, you need to obtain HERE API credentials. Multiple plans are available: https://aws.amazon.com/marketplace/pp/B07JPLG9SR/?ref=_ptnr_aws_sar_github#pricing-information.

## Setup
### Step 1: Register for an API Key

Visit the [HERE Location Services on AWS Marketplace](https://aws.amazon.com/marketplace/pp/B07JPLG9SR/?ref=_ptnr_aws_sar_github), and review the [Access Control FAQ](https://developer.here.com/faqs#access-control).

### Step 2: Register an AWS Account

Visit [AWS](https://aws.amazon.com/free/) and sign up for a Free Tier account.

### Step 3: Install the AWS CLI and run "aws configure"

Download and install the [AWS CLI](https://aws.amazon.com/cli/), and run `aws configure` as per the [AWS CLI User Guide](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

### Step 4: Get the Source

From GitHub: clone [this repository](https://github.com/heremaps/here-aws-sar), or download the ZIP.

The folder containing the lambda source code (JS) and CloudFormation templates (YML) is `serverlessFunctions\routing\`.

### Step 5: Package

An S3 bucket is required as a destination for the AWS SAM package. If you don't have one already, create one:

`aws s3 mb s3://here-maps-api--aws-sam`

Note: If the folder contains a `package.json` file: run `npm update`:

`x:\src\here-aws-repository\serverlessFunctions\routing>npm update`

Use the AWS CLI to package (note the folder layout):

`x:\src\here-aws-repository\serverlessFunctions>aws cloudformation package --s3-bucket here-maps-api--aws-sam --template-file routing\routing.yml --output-template-file routing-packaged.yml`

### Step 6: Deploy

Use the AWS CLI to deploy the AWS SAM package using CloudFormation:

`x:\src\here-aws-repository\serverlessFunctions>aws cloudformation deploy --capabilities CAPABILITY_IAM --stack-name "HERE-Maps-API--Routing" --parameter-overrides HereApiKey=<apiKey> --template-file routing-packaged.yml`

### Step 7: Find new API Gateway URL

Once deployment completes, look for the URL of the new API Gateway. It should follow this pattern:

`https://<apigw>.execute-api.<region>.amazonaws.com/...`

The API Gateway URL is an output from the CloudFormation template and can be found among the tabs when selecting a Stack in the AWS Console.

Alternatively look at the API Gateway in the AWS Console, select Stages, and then expand the tree until you see "Invoke URL".

### Step 8: Secure your API Gateways/Lambdas

Note: The AWS Lambda proxy deployed above do not impose **authentication** or **authorization** restrictions!

__You must decide how you will control access to your API Gateway and Lambda.__

For guidance, see the [AWS Lambda FAQ](https://aws.amazon.com/lambda/faqs/#security).

Consider implementing [AWS API Gateway Custom Authorizers](http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html).

## HERE Maps API with Lambda Proxy
### Routing

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Routing              | `https://route.ls.hereapi.com/`                 |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/route/` |
|Routing(Isoline)     | `https://isoline.route.ls.hereapi.com/`         |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/isoline.route/` |
|Routing(Matrix)      | `https://matrix.route.ls.hereapi.com/`          |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/matrix.route/` |

* An example of an HTTP GET request to HERE Routing API & equivalent AWS Lambda Proxy:

    __HERE Routing API:__

    `https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=<apiKey>&waypoint0=geo!52.5%2c13.4&waypoint1=geo!52.5%2c13.45&mode=fastest%3bcar%3btraffic:disabled%3b`

    To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

    __Equivalent AWS Lambda Proxy for HERE Routing API:__

    API Gateway URL format:

    `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/{type}/{resourcePath+}`

    {type}: `route`

    {resourcePath+}: `routing/7.2/calculateroute.json?waypoint0=geo!52.5%2c13.4&waypoint1=geo!52.5%2c13.45&mode=fastest%3bcar%3btraffic:disabled%3b`

    API Gateway URL:

    `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/route/routing/7.2/calculateroute.json?waypoint0=geo!52.5%2c13.4&waypoint1=geo!52.5%2c13.45&mode=fastest%3bcar%3btraffic:disabled%3b`

* An example of an HTTP GET request to HERE Routing(Isoline) API & equivalent AWS Lambda Proxy:

    __HERE Routing(Isoline) API:__

    `https://isoline.route.ls.hereapi.com/routing/7.2/calculateisoline.json?apiKey=<apiKey>&mode=fastest%3Bpedestrian&start=52.5160%2C13.3778&rangetype=distance&range=2000`

    To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

    __Equivalent AWS Lambda Proxy for HERE Routing(Isoline) API:__

    API Gateway URL format:

    `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/{type}/{resourcePath+}`

    {type}: `isoline.route`

    {resourcePath+}: `routing/7.2/calculateisoline.json?mode=fastest%3Bpedestrian&start=52.5160%2C13.3778&rangetype=distance&range=2000`

    API Gateway URL:

    `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/isoline.route/routing/7.2/calculateisoline.json?mode=fastest%3Bpedestrian&start=52.5160%2C13.3778&rangetype=distance&range=2000`

* An example of an HTTP GET request to HERE Routing(Matrix) API & equivalent AWS Lambda Proxy:

    __HERE Routing(Matrix) API:__

    `https://matrix.route.ls.hereapi.com/routing/7.2/calculatematrix.json?apiKey=<apiKey>&mode=fastest%3Btruck%3Btraffic%3Adisabled%3B&start0=40.7790%2C-73.9622&destination0=40.7482%2C-73.9860&destination1=40.7558%2C-73.9870&destination2=40.7054%2C-73.9961`

    To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

    __Equivalent AWS Lambda Proxy for HERE Routing(Matrix) API:__

    API Gateway URL format:

    `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/{type}/{resourcePath+}`

    {type}: `matrix.route`

    {resourcePath+}: `routing/7.2/calculatematrix.json?apiKey=<apiKey>&mode=fastest%3Btruck%3Btraffic%3Adisabled%3B&start0=40.7790%2C-73.9622&destination0=40.7482%2C-73.9860&destination1=40.7558%2C-73.9870&destination2=40.7054%2C-73.9961`

    API Gateway URL:

    `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/routing/api/matrix.route/routing/7.2/calculatematrix.json?mode=fastest%3Btruck%3Btraffic%3Adisabled%3B&start0=40.7790%2C-73.9622&destination0=40.7482%2C-73.9860&destination1=40.7558%2C-73.9870&destination2=40.7054%2C-73.9961`

The AWS Lambda Proxy URL depends on the base URL type. For example:

* 	https://route.ls.hereapi.com/routing/7.2/calculateroute.json

    Base URL/type: route

    Lambda Proxy URL: /routing/api/route/

* https://isoline.route.ls.hereapi.com/routing/7.2/calculateisoline.json

    Base URL/type: isoline.route

    Lambda Proxy URL: /routing/api/isoline.route/

* 	https://matrix.route.ls.hereapi.com/routing/7.2/calculatematrix.json

    Base URL/type: matrix.route

    Lambda Proxy URL: /routing/api/matrix.route/

For details please refer [HERE Routing API](https://developer.here.com/documentation/routing/topics/overview.html)

### Waypoint Sequence (Routing)

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|Waypoint             | `https://wse.ls.hereapi.com/`                   |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/waypointseq/api/` |

* An example of an HTTP GET request to HERE Waypoint Sequence (Routing) API & equivalent AWS Lambda Proxy:

    __HERE Waypoint Sequence (Routing) API:__

    `https://wse.ls.hereapi.com/2/findsequence.json?apiKey=<apiKey>&start=WiesbadenCentralStation;50.0715,8.2434&destination1=FranfurtCentralStation;50.1073,8.6647&destination2=DarmstadtCentralStation;49.8728,8.6326&destination3=FrankfurtAirport;50.050639,8.569641&destination4=HanauCentralStation;50.1218,8.9298&end=MainzCentralStation;50.0021,8.259&improveFor=distance&mode=fastest;truck;traffic:disabled;&hasTrailer=true&limitedWeight=18&height=4.00&width=2.50&length=18.35`

    To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the resourcePath and Query String Parameters as follows:

    __Equivalent AWS Lambda Proxy for HERE Waypoint Sequence (Routing) API:__

    API Gateway URL format:

    `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/waypointseq/api/{resourcePath+}`

    {resourcePath+}: `2/findsequence.json?start=WiesbadenCentralStation;50.0715,8.2434&destination1=FranfurtCentralStation;50.1073,8.6647&destination2=DarmstadtCentralStation;49.8728,8.6326&destination3=FrankfurtAirport;50.050639,8.569641&destination4=HanauCentralStation;50.1218,8.9298&end=MainzCentralStation;50.0021,8.259&improveFor=distance&mode=fastest;truck;traffic:disabled;&hasTrailer=true&limitedWeight=18&height=4.00&width=2.50&length=18.35`

    API Gateway URL:

    `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/waypointseq/api/2/findsequence.json?start=WiesbadenCentralStation%3b50.0715%2c8.2434&destination1=FranfurtCentralStation%3b50.1073%2c8.6647&destination2=DarmstadtCentralStation%3b49.8728%2c8.6326&destination3=FrankfurtAirport%3b50.0505%2c8.5698&destination4=HanauCentralStation%3b50.1218%2c8.9298&end=MainzCentralStation%3b50.0021%2c8.259&improveFor=time&mode=fastest%3bcar%3btraffic:disabled%3b`

For details please refer [HERE Routing Waypoints aka Sequence API](https://developer.here.com/documentation/routing-waypoints/topics/introduction.html)

## License

Copyright (c) 2017-2019 HERE Europe B.V.

See the [LICENSE](./LICENSE) file in the root of this project for license details.
