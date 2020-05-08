git using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Diagnostics;
using System.IO;
using System.Net;

namespace HERE_AWS_SAR
{
    /// <summary>
    /// https://developer.here.com/documentation/geocoder/topics/introduction.html
    /// </summary>
    [TestClass]
    public class Tests_GeoCoder
    {
        private static string AWS_URL;
        private static string HereApi_AppID;
        private static string HereApi_AppCode;
        private static string HereApi_DNS = "geocoder.cit.api.here.com";
        private static string HereApi_URL = $"https://{HereApi_DNS}/6.2/geocode.json";

        private static string searchText = "425+W+Randolph+Chicago";
        private static string expectedText = "425 W Randolph St, Chicago, IL 60606, United States";

        [ClassInitialize]
        public static void Class_Init(TestContext ctx)
        {
            HereApi_AppID = ctx.Properties["HereApi-AppID"] as string ?? throw new InvalidOperationException("Missing 'AppID' from .RunSettings");
            HereApi_AppCode = ctx.Properties["HereApi-AppCode"] as string ?? throw new InvalidOperationException("Missing 'AppCode' from .RunSettings");

            AWS_URL = ctx.Properties["AwsApiGateway-GeoCoder"] as string ?? throw new InvalidOperationException("Missing 'ApiGatewayUrl' from .RunSettings");
        }

        [TestMethod]
        public void GeoCoder()
        {
            var uriHere = new Uri(HereApi_URL + $"?app_id={HereApi_AppID}&app_code={HereApi_AppCode}&searchtext={searchText}");
            Debug.WriteLine($"Here Maps API URL: {uriHere}");

            var uriAWS = new Uri(AWS_URL + $"/geocode/{searchText}");
            Debug.WriteLine($"AWS Lambda Proxy URL: {uriAWS}");

            var jsonHere = GetResponse(uriHere);
            var jsonAWS = GetResponse(uriAWS);

            Assert.AreEqual<string>(jsonHere, jsonAWS);

            Assert.IsTrue(jsonHere.Contains(expectedText));
            Assert.IsTrue(jsonAWS.Contains(expectedText));
        }

        private static string GetResponse(Uri target)
        {
            var response = HttpWebRequest.CreateHttp(target).GetResponse();
            Assert.IsTrue(response.ContentType.Contains("json"));

            using (var sr = new StreamReader(response.GetResponseStream()))
            {
                var json = sr.ReadToEnd();
                Assert.IsTrue(!string.IsNullOrWhiteSpace(json));
                return json;
            }
        }
    }
}