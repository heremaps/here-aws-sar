## AWS SAR for HERE Location Service APIs - Geocoding and Search API v7
### Introduction
This project provides [AWS Lambda](https://aws.amazon.com/lambda/) as __proxy__ for [HERE Geocoding and Search API v7](https://developer.here.com/documentation/geocoding-search-api/dev_guide/index.html) & This AWS Lambda is packaged as per the [AWS Serverless Application Model](https://aws.amazon.com/about-aws/whats-new/2016/11/introducing-the-aws-serverless-application-model/).

"AWS SAR is natively supported by AWS CloudFormation and defines simplified syntax for expressing serverless resources. The specification currently covers APIs, Lambda functions and Amazon DynamoDB tables."

### Benefits

The AWS API Gateway supports configuring both Cache and Throttling, and the lambdas are open source: we welcome pull requests with circuit breakers, graceful error handling, etc.!

### Requirements
To successfully call the [HERE Geocoding and Search API v7](https://developer.here.com/documentation/geocoding-search-api/dev_guide/index.html) through the proxy in this project, you need to obtain HERE API credentials. Multiple plans are available: https://aws.amazon.com/marketplace/pp/B07JPLG9SR/?ref=_ptnr_aws_sar_github#pricing-information.

### List of APIs with AWS Lambda Proxies
* [Geocoding and Search API v7](https://developer.here.com/documentation/geocoding-search-api/dev_guide/index.html)
* [Discover](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-discover-brief.html)
 * [Geocode](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-geocode-brief.html)
 * [Autosuggest](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-autosuggest-brief.html)
 * [Browse](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-browse-brief.html)
 * [Lookup](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-lookup-brief.html)
* [Reversegeocode](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-reverse-geocode-brief.html)

### Setup
### Step 1: Register for an API Key

Visit the [HERE Location Services on AWS Marketplace](https://aws.amazon.com/marketplace/pp/B07JPLG9SR/?ref=_ptnr_aws_sar_github), and review the [Access Control FAQ](https://developer.here.com/faqs#access-control).

### Step 2: Register an AWS Account

Visit [AWS](https://aws.amazon.com/free/) and sign up for a Free Tier account.

### Step 3: Install the AWS CLI and run "aws configure"

Download and install the [AWS CLI](https://aws.amazon.com/cli/), and run `aws configure` as per the [AWS CLI User Guide](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

### Step 4: Get the Source

From GitHub: clone [this repository](https://github.com/heremaps/here-aws-sar), or download the ZIP.

The folder containing the lambda source code (JS) and CloudFormation templates (YML) is `serverlessFunctions\geocode\`.

### Step 5: Package

An S3 bucket is required as a destination for the AWS SAR package. If you don't have one already, create one:

`aws s3 mb s3://here-maps-api--aws-sar`

Note: If the folder contains a `package.json` file: run `npm update`:

`x:\src\here-aws-repository\serverlessFunctions\geocode>npm update`

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

Note: The AWS Lambda proxy deployed above do not impose **authentication** or **authorization** restrictions!

__You must decide how you will control access to your API Gateway and Lambda.__

For guidance, see the [AWS Lambda FAQ](https://aws.amazon.com/lambda/faqs/#security).

Consider implementing [AWS API Gateway Custom Authorizers](http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html).

### HERE Geocoding and Search API v7 with Lambda Proxy
URL Mapping

|API                  | HERE URL Prefix                                 |  AWS Lambda App URL Prefix |
|-------------------- |-------------------------------------------------|-----------------------------------------------------------|
|discover             | `https://discover.search.hereapi.com/`              |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
|geocode            | `https://geocode.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
autosuggest            | `https://autosuggest.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
|browse            | `https://browse.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
|lookup            | `https://lookup.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |
|revgeocode            | `https://revgeocode.search.hereapi.com/`      |  `https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/` |


An example of an HTTP GET request to HERE Geocoding and Search API v7 & equivalent AWS Lambda Proxy:
<details>
  <summary markdown="span">discover</summary>

* An example of an HTTP GET request to HERE discover PI & equivalent AWS Lambda Proxy: 
  
  __HERE discover API:__
    ```
    https://discover.search.hereapi.com/v1/discover?apikey= <apikey>&at=42.36399,-71.05493&limit=1&q=restaurant&in=countryCode:USA
    ```
 * To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

    __Equivalent AWS Lambda Proxy for discover API :__

    API Gateway URL format:
    ```
   https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/{resourcePath+}
    ```
   {resourcePath+}: `v1/discover?at=42.36399,-71.05493&limit=1&q=restaurant&in=countryCode:USA`

   API Gateway URL:
   ```
   https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/v1/discover?at=42.36399,-71.05493&limit=1&  q=restaurant&in=countryCode:USA
   ```
   The AWS Lambda Proxy URL depends on the base URL type. For example:

*  https://discover.search.hereapi.com/v1/discover

   Lambda Proxy URL: /geocode/api/v1/discover/

 </details>

<details>
<summary markdown="span">geocode</summary>

* An example of an HTTP GET request to HERE geocode API & equivalent AWS Lambda Proxy: 

    __HERE geocode API:__
 ```
    https://geocode.search.hereapi.com/v1/geocode?apikey=<apikey>&q=5 Rue Daunou, 75000 Paris, France
 ```
* To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

   __Equivalent AWS Lambda Proxy for HERE geocode API:__

     API Gateway URL format:
     ```
     https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/{resourcePath+}
     ```
    {resourcePath+}: `v1/geocode?q=5 Rue Daunou, 75000 Paris, France`

    API Gateway URL:
    ```
    https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/v1/geocode?q=5 Rue Daunou, 75000 Paris, France
    ```

  The AWS Lambda Proxy URL depends on the base URL type. For example:

* https://geocode.search.hereapi.com/v1/geocode

    Lambda Proxy URL: /geocode/api/v1/geocode/
   
</details>

<details>
  <summary markdown="span">autosuggest</summary>

* An example of an HTTP GET request to HERE autosuggest API & equivalent AWS Lambda Proxy:

    __HERE autosuggest API:__
   ```
   https://autosuggest.search.hereapi.com/v1/autosuggest?apikey=<apikey>&at=52.5199813,13.3985138&q=berlin bran
   ```
 * To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

     __Equivalent AWS Lambda Proxy for HERE autosuggest API:__
     
      API Gateway URL format:
      ```
      https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/{resourcePath+}
      ```
      {resourcePath+}: `v1/autosuggest?at=52.5199813,13.3985138&q=berlin bran`

      API Gateway URL:
      ```
      https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/v1/autosuggest?at=52.5199813,13.3985138&q=berlin bran
      ```

   The AWS Lambda Proxy URL depends on the base URL type. For example:

 * https://autosuggest.search.hereapi.com/v1/autosuggest

    Lambda Proxy URL: /geocode/api/v1/autosuggest/

</details>

<details>
  <summary markdown="span">browse</summary>

* An example of an HTTP GET request to HERE browse API & equivalent AWS Lambda Proxy

   __HERE browse API:__
    ```    
    https://browse.search.hereapi.com/v1/browse?apikey=<apikey>&at=-23.000813,-43.351629&limit=2&categories=100-1100,200-2000-0011,100-1000
    ```
* To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

    __Equivalent AWS Lambda Proxy for HERE browse API:__

     API Gateway URL format:
     ```
     https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/{resourcePath+}
     ```
     {resourcePath+}: `v1/browse?at=-23.000813,-43.351629&limit=2&categories=100-1100,200-2000-0011,100-1000`

     API Gateway URL:
     ```
     https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/v1/browse?at=42.36399,-71.05493&limit=1&q=restaurant&in=countryCode:USA
     ```
     The AWS Lambda Proxy URL depends on the base URL type. For example:
   
* https://browse.search.hereapi.com/v1/browse

  Lambda Proxy URL: /geocode/api/v1/browse/

   </details>

<details>
  <summary markdown="span">lookup</summary>

  * An example of an HTTP GET request to HERE lookup API  & equivalent AWS Lambda Proxy:
   
     __HERE lookup API:__
     
     ```
     https://lookup.search.hereapi.com/v1/lookup?apikey=<apikey>& id=here:pds:place:276u0vhj-b0bace6448ae4b0fbc1d5e323998a7d2
     ```
  * To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

     __Equivalent AWS Lambda Proxy for HERE lookup API:__

      API Gateway URL format:
      ``` 
      https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/{resourcePath+}
      ```
     {resourcePath+}: `v1/lookup?id=here:pds:place:276u0vhj-b0bace6448ae4b0fbc1d5e323998a7d2`

     API Gateway URL:
    ```
    https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/v1/lookup?at=42.36399,-71.05493&limit=1&q=restaurant&in=countryCode:USA
    ```

    The AWS Lambda Proxy URL depends on the base URL type. For example:

   * https://lookup.search.hereapi.com/v1/lookup

   Lambda Proxy URL: /geocode/api/v1/lookup/

   </details>

<details>
  <summary markdown="span">revgeocode</summary>
 
 * An example of an HTTP GET request to HERE revgeocode API & equivalent AWS Lambda Proxy:

    __HERE revgeocode API:__

     ```
    https://revgeocode.search.hereapi.com/v1/revgeocode?apikey=<apikey>&at=48.2181679%2C16.3899064&lang=en-US
     ```
 *  To call the Lambda proxy instead, replace the original URL with the API Gateway URL, change the type, resourcePath and Query String Parameters as follows:

    __Equivalent AWS Lambda Proxy for HERE revgeocode API:__

      API Gateway URL format:
      ```
      https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/{resourcePath+}
      ```
     {resourcePath+}: `v1/revgeocode?at=42.36399,-71.05493&limit=1&q=restaurant&in=countryCode:USA`

     API Gateway URL:
     ```
     https://<apigw>.execute-api.<region>.amazonaws.com/Prod/geocode/api/v1/revgeocode?at=48.2181679%2C16.3899064&lang=en-US
     ```
     The AWS Lambda Proxy URL depends on the base URL type. For example:

  * https://revgeocode.search.hereapi.com/v1/revgeocode

    Lambda Proxy URL: /geocode/api/v1/revgeocode/

    </details>

    `Note: You also need to provide the Method type as GET for the API call.`

     For details documents please refer [HERE Geocoding and Search API v7](https://developer.here.com/documentation/geocoding-search-api/dev_guide/index.html) 

 ### License

Copyright (c) 2017-2019 HERE Europe B.V.

See the [LICENSE](./LICENSE) file in the root of this project for license details.
