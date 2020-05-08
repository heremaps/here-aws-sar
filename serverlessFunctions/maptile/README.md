# AWS SAR for HERE Location Service APIs - Map Tile
## Introduction
This project provides [AWS Lambda](https://aws.amazon.com/lambda/) as __proxy__ for [HERE Map Tile API](https://developer.here.com/documentation/map-tile/topics/introduction.html). This AWS Lambda is packaged as per the [AWS Serverless Application Model](https://aws.amazon.com/about-aws/whats-new/2016/11/introducing-the-aws-serverless-application-model/).

"AWS SAR is natively supported by AWS CloudFormation and defines simplified syntax for expressing serverless resources. The specification currently covers APIs, Lambda functions and Amazon DynamoDB tables."

### Benefits

The AWS API Gateway supports configuring both Cache and Throttling, and the lambdas are open source: we welcome pull requests with circuit breakers, graceful error handling, etc.!

## Requirements
To successfully call the [HERE Map Tile API](https://developer.here.com/documentation/map-tile/topics/introduction.html) through the proxy in this project, you need to obtain HERE API credentials. Multiple plans are available: https://aws.amazon.com/marketplace/pp/B07JPLG9SR/?ref=_ptnr_aws_sar_github#pricing-information.

## Setup
### Step 1: Register for an API Key

Visit the [HERE Location Services on AWS Marketplace](https://aws.amazon.com/marketplace/pp/B07JPLG9SR/?ref=_ptnr_aws_sar_github), and review the [Access Control FAQ](https://developer.here.com/faqs#access-control).

### Step 2: Register an AWS Account

Visit [AWS](https://aws.amazon.com/free/) and sign up for a Free Tier account.

### Step 3: Install the AWS CLI and run "aws configure"

Download and install the [AWS CLI](https://aws.amazon.com/cli/), and run `aws configure` as per the [AWS CLI User Guide](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

### Step 4: Get the Source

From GitHub: clone [this repository](https://github.com/heremaps/here-aws-sar), or download the ZIP.

The folder containing the lambda source code (JS) and CloudFormation templates (YML) is `serverlessFunctions\maptile\`.

### Step 5: Package

An S3 bucket is required as a destination for the AWS SAR package. If you don't have one already, create one:

`aws s3 mb s3://here-maps-api--aws-sar`

Note: If the folder contains a `package.json` file: run `npm update`:

`x:\src\here-aws-repository\serverlessFunctions\maptile>npm update`

Use the AWS CLI to package (note the folder layout):

`x:\src\here-aws-repository\serverlessFunctions>aws cloudformation package --s3-bucket here-maps-api--aws-sar --template-file maptile\maptile.yml --output-template-file maptile-packaged.yml`

### Step 6: Deploy

Use the AWS CLI to deploy the AWS SAR package using CloudFormation:

`x:\src\here-aws-repository\serverlessFunctions>aws cloudformation deploy --capabilities CAPABILITY_IAM --stack-name "HERE-Maps-API--MapTile" --parameter-overrides HereApiKey=<apiKey> --template-file maptile-packaged.yml`

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

## HERE Map Tile API with Lambda Proxy
`Note:`
`- For Map MapTile API, success response will return base 64 encoding of map image (not JSON) and for failures, message as error in downloading map will be returned.`

URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|MapTile              | `https://{1-4}.traffic.maps.ls.hereapi.com/`    |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/traffic/`
|MapTile              | `https://{1.4}.base.maps.ls.hereapi.com/`       |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/base/`
|MapTile              | `https://{1.4}.aerial.maps.ls.hereapi.com/`     |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/aerial/`

* An example of an HTTP GET request to HERE Map Tile API & equivalent AWS Lambda Proxy:

    __HERE Map Tile API for Base Map Tiles:__

    `https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/13/4400/2686/256/jpg?apiKey=<apiKey>`

    To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

    __Equivalent AWS Lambda Proxy for HERE Map Tile API for Base Map Tiles:__

    API Gateway URL format:

    `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/{type}/{resourcePath+}`

    {type}: `base`

    {resourcePath+}: `maptile/2.1/maptile/newest/normal.day/13/4400/2686/256/jpg`

    API Gateway URL:

    `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/base/maptile/2.1/maptile/newest/normal.day/13/4400/2686/256/jpg`

* An example of an HTTP GET request to HERE Map Tile API & equivalent AWS Lambda Proxy:

    __HERE Map Tile API for Aerial Tiles:__

    `https://1.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/terrain.day/7/66/45/256/png8?apiKey=<apiKey>`

    To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

    __Equivalent AWS Lambda Proxy for HERE Map Tile API for Aerial Tiles:__

    API Gateway URL format:

    `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/{type}/{resourcePath+}`

    {type}: `aerial`

    {resourcePath+}: `maptile/2.1/maptile/newest/terrain.day/7/66/45/256/png8`

    API Gateway URL:

    `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/maptile/api/aerial/maptile/2.1/maptile/newest/terrain.day/7/66/45/256/png8`

    `Note:`
    `Here {type} is the tile type like base, aerial, traffic`

The AWS Lambda Proxy URL depends on the base URL type. For example:

* https://1.traffic.maps.api.here.com/maptile/2.1/traffictile/newest

    Base URL/tile type: traffic

    Lambda Proxy URL: /maptile/api/traffic/

* https://1.base.maps.api.here.com/maptile/2.1/streettile

    Base URL/tile type: base

    Lambda Proxy URL: /maptile/api/base/

For details please refer [HERE Map Tile API](https://developer.here.com/documentation/map-tile/topics/introduction.html)

## License

Copyright (c) 2017-2019 HERE Europe B.V.

See the [LICENSE](./LICENSE) file in the root of this project for license details.
