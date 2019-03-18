# AWS SAM for HERE Maps APIs
## Introduction
This project provides [AWS Lambdas](https://aws.amazon.com/lambda/) as __proxies__ for several of the [HERE Location Services APIs](http://saas.awsmarketplace.here.com/rest-api). These AWS Lambdas are packaged as per the [AWS Serverless Application Model](https://aws.amazon.com/about-aws/whats-new/2016/11/introducing-the-aws-serverless-application-model/).

"AWS SAM is natively supported by AWS CloudFormation and defines simplified syntax for expressing serverless resources. The specification currently covers APIs, Lambda functions and Amazon DynamoDB tables."

### Benefits

The AWS API Gateway supports configuring both Cache and Throttling, and the lambdas are open source: we welcome pull requests with circuit breakers, graceful error handling, etc.!

## Requirements
To successfully call the HERE Maps APIs through the proxies in this project you need to obtain HERE API credentials. Multiple plans are available: https://aws.amazon.com/marketplace/pp/B07JPLG9SR/?ref=_ptnr_aws_sar_github#pricing-information.

## List of APIs with AWS Lambda Proxies
* [geocode](https://developer.here.com/documentation/geocoder/topics/introduction.html) & [geocode autocomplete](https://developer.here.com/documentation/geocoder-autocomplete/topics/introduction.html)
* [mapimage](https://developer.here.com/documentation/map-image/topics/introduction.html)
* [maptile](https://developer.here.com/documentation/map-tile/topics/overview.html)
* [places](https://developer.here.com/documentation/places/topics/introduction.html)
* [position](https://developer.here.com/documentation/positioning/topics/introduction.html)
* [routing](https://developer.here.com/documentation/routing/topics/overview.html) & [routing waypoints aka sequence](https://developer.here.com/documentation/routing-waypoints/topics/introduction.html)
* [tollcost](https://developer.here.com/documentation/toll-cost/topics/introduction.html)
* [traffic](https://developer.here.com/documentation/traffic/topics/introduction.html)
* [weather](https://developer.here.com/documentation/weather/topics/overview.html)

## Setup
### Step 1: Register for an API Key

Visit the [HERE Location Services on AWS Marketplace](https://aws.amazon.com/marketplace/pp/B07JPLG9SR/?ref=_ptnr_aws_sar_github), and review the [Access Control FAQ](https://saas.awsmarketplace.here.com/faq#api-access).

### Step 2: Register an AWS Account

Visit [AWS](https://aws.amazon.com/free/) and sign up for a Free Tier account.

### Step 3: Install the AWS CLI and run "aws configure"

Download and install the [AWS CLI](https://aws.amazon.com/cli/), and run `aws configure` as per the [AWS CLI User Guide](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

### Step 4: Get the Source

From GitHub: clone [this repository](https://github.com/heremaps/here-aws-sar), or download the ZIP.

The folder containing the lambda source code (JS) and CloudFormation templates (YML) is `reInvent2017`.

### Step 5: Package

An S3 bucket is required as a destination for the AWS SAM package. If you don't have one already, create one:

`aws s3 mb s3://here-maps-api--aws-sam`

Note: If the folder contains a `package.json` file: run `npm update`:

`x:\src\here-aws-repository\reInvent2017\mapimage>npm update`

Use the AWS CLI to package (note the folder layout):

`x:\src\here-aws-repository\reInvent2017>aws cloudformation package --s3-bucket here-maps-api--aws-sam --template-file geocode\geocode.yml --output-template-file geocode-packaged.yml`

### Step 6: Deploy

Use the AWS CLI to deploy the AWS SAM package using CloudFormation:

`x:\src\here-aws-repository\reInvent2017>aws cloudformation deploy --capabilities CAPABILITY_IAM --stack-name "HERE-Maps-API--GeoCode" --parameter-overrides HereAppId=<appID> HereAppCode=<appCode> --template-file geocode-packaged.yml`

### Step 7: Find new API Gateway URL

Once deployment completes, look for the URL of the new API Gateway. It should follow this pattern:

`https://<apigw>.execute-api.<region>.amazonaws.com/...`

The API Gateway URL is an output from the CloudFormation template and can be found among the tabs when selecting a Stack in the AWS Console.

Alternatively look at the API Gateway in the AWS Console, select Stages, and then expand the tree until you see "Invoke URL".

### Step 8: Secure your API Gateways/Lambdas

Note: the AWS Lambda proxies deployed above do not impose **authentication** or **authorization** restrictions!

__You must decide how you will control access to your API Gateway and Lambdas.__

For guidance, see the [AWS Lambda FAQ](https://aws.amazon.com/lambda/faqs/#security).

Consider implementing [AWS API Gateway Custom Authorizers](http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html).

## HERE Maps APIs with Lambda Proxies
The below list of HERE Maps APIs each has one Lambda as a proxy.

### GeoCode

An example of an HTTP GET request to HERE.com:

`https://geocoder.api.here.com/6.2/geocode.json?app_id=<appID>&app_code=<appCode>&searchtext={searchtext}`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Stage/geocode/{searchtext}`

### GeoCode AutoComplete

An example of an HTTP GET request to HERE.com:

`https://autocomplete.geocoder.api.here.com/6.2/suggest.json?app_id=<appID>&app_code=<appCode>&query={query}`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Stage/geocodesuggest/{query}`

### MapImage

An example of an HTTP GET request to HERE.com:

`https://image.maps.api.here.com/mia/1.6/mapview?app_id=<appID>&app_code=<appCode>&lat=63.529722&lon=-19.513889`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Stage/mapimage?t=1&lat=63.529722&lon=-19.513889`

### Places

An example of an HTTP GET request to HERE.com:

`https://places.api.here.com/places/v1/autosuggest?app_id=<appID>&app_code=<appCode>&at=40.74917,-73.98529&q=chrysler`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Stage/places?at=40.74917,-73.98529&q=chrysler`

### Position

Note: this API call requires an HTTP **POST**. See the Test project for an example payload.

An example of an HTTP POST to HERE.com:

`https://pos.api.here.com/positioning/v1/locate?app_id=<appID>&app_code=<appCode>`

An example of an HTTP POST to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Stage/position`

### Routing

An example of an HTTP GET request to HERE.com:

`https://route.api.here.com/routing/7.2/calculateroute.json?app_id=<appID>&app_code=<appCode>&waypoint0=geo!52.5%2c13.4&waypoint1=geo!52.5%2c13.45&mode=fastest%3bcar%3btraffic:disabled%3b`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Stage/routing?waypoint0=geo!52.5%2c13.4&waypoint1=geo!52.5%2c13.45&mode=fastest%3bcar%3btraffic:disabled%3b`

### Waypoint Sequence (Routing)

An example of an HTTP GET request to HERE.com:

`https://wse.api.here.com/2/findsequence.json?app_id=<appID>&app_code=<appCode>&start=WiesbadenCentralStation%3b50.0715%2c8.2434&destination1=FranfurtCentralStation%3b50.1073%2c8.6647&destination2=DarmstadtCentralStation%3b49.8728%2c8.6326&destination3=FrankfurtAirport%3b50.0505%2c8.5698&destination4=HanauCentralStation%3b50.1218%2c8.9298&end=MainzCentralStation%3b50.0021%2c8.259&improveFor=time&departure=2014-12-09T09:30:00%2b01:00&mode=fastest%3bcar%3btraffic:disabled%3b`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Stage/waypointseq?start=WiesbadenCentralStation%3b50.0715%2c8.2434&destination1=FranfurtCentralStation%3b50.1073%2c8.6647&destination2=DarmstadtCentralStation%3b49.8728%2c8.6326&destination3=FrankfurtAirport%3b50.0505%2c8.5698&destination4=HanauCentralStation%3b50.1218%2c8.9298&end=MainzCentralStation%3b50.0021%2c8.259&improveFor=time&departure=2014-12-09T09:30:00%2b01:00&mode=fastest%3bcar%3btraffic:disabled%3b`

### Toll Cost

An example of an HTTP GET request to HERE.com:

`https://tce.api.here.com/2/calculateroute.json?app_id=<appID>&app_code=<appCode>&waypoint0=49.33729606975952%2c0.5986232869327068&waypoint1=49.493527937780975%2c0.10129541603788539&mode=fastest%3bcar%26cost_optimize%3d1`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Stage/tollcost?waypoint0=49.33729606975952%2c0.5986232869327068&waypoint1=49.493527937780975%2c0.10129541603788539&mode=fastest%3bcar%26cost_optimize%3d1`

### Traffic

An example of an HTTP GET request to HERE.com:

`https://traffic.api.here.com/traffic/6.2/incidents/json/8/134/86?app_id=<appID>&app_code=<appCode>`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Stage/traffic/8/134/86`

### Weather

Note: the Weather API is not available by default. Please contact the [here.com Sales Team](https://developer.here.com/contact-us#contact-sales) for more information.

An example of an HTTP GET request to HERE.com:

`https://weather.api.here.com/weather/1.0/report.json?app_id=<appID>&app_code=<appCode>&product=observation&name=Berlin-Tegel`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<apigw>.execute-api.<region>.amazonaws.com/Stage/weather?product=observation&name=Berlin-Tegel`

## License

Copyright (c) 2017 HERE Europe B.V.

See the [LICENSE](./LICENSE) file in the root of this project for license details.