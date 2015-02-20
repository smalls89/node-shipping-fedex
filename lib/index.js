/*

 Built by
   __                   ____
  / /___  ______  ___  / __/___  ____
 / __/ / / / __ \/ _ \/ /_/ __ \/ __ \
/ /_/ /_/ / /_/ /  __/ __/ /_/ / /_/ /
\__/\__, / .___/\___/_/  \____/\____/
 /____/_/
 */

var https = require('https');
var extend = require('extend');
var parser = require('xml2json');
var soap = require('soap');
var path = require('path');

function FedEx(args) {
  var $scope = this;
  $scope.hosts = {
    sandbox: 'https://gatewaybeta.fedex.com',
    live: 'https://gateway.fedex.com'
  };
  var defaults = {
      imperial: true, // for inches/lbs, false for metric cm/kgs
      currency: 'USD',
      language: 'en-US',
      environment: 'sandbox',
      key: '',
      password: '',
      account_number: '',
      meter_number: '',
      debug: false,
      pretty: false,
      user_agent: 'uh-sem-blee, Co | typefoo'
    };

  $scope.config = function(args) {
    $scope.options = extend(defaults, args);
    return $scope;
  };

  $scope.dimensionalWeight = function(weight, length, width, height) {
    var dimWeight = (length * width * height) / ($scope.options.imperial ? dimensional_weight_values.imperial : dimensional_weight_values.metric);
    if(dimWeight > weight) {
      return parseInt(dimWeight, 10);
    } else {
      return weight;
    }
  };

  $scope.density = function(weight, length, width, height) {
    return (weight / ((length * width * height) / 1728));
  };

  function buildRatesRequest(data, options, resource, callback) {
    soap.createClient(path.join(__dirname,  'wsdl', resource.wsdl), {endpoint: $scope.hosts[$scope.options.environment] + resource.path}, function(err, client) {
      if (err) {
        return callback(err, null);
      }

      console.log($scope.hosts[$scope.options.environment] + resource.path);

      var params = {
        WebAuthenticationDetail: {
          UserCredential: {
            Key: $scope.options.key,
            Password: $scope.options.password
          }
        },
        ClientDetail: {
          AccountNumber: $scope.options.account_number,
          MeterNumber: $scope.options.meter_number
        },
        Version: {
          ServiceId: 'crs',
          Major: '16',
          Intermediate: '0',
          Minor: '0'
        }
      };

      params = extend(params, data);

      client.getRates(params, function(err, result) {
        console.log(client.lastRequest);
        if(err) {
          return callback(err, null);
        }

        return callback(err, result);
      });
    });
  }

  function handleRatesResponse(res, callback) {
    return callback(res);
  }

  function buildShipRequest(data, options, resource, callback) {

  }

  function handleShipResponse(res, callback) {

  }

  function buildTrackingRequest(data, options, resource, callback) {

  }

  function handleTrackingResponse(res, callback) {

  }

  function buildFreightRatesRequest(data, options, resource, callback) {

  }

  function handleFreightRatesResponse(res, callback) {

  }

  var resources = {
    rates: {f: buildRatesRequest, r: handleRatesResponse, wsdl: 'RateService_v16.wsdl', path: '/web-services/rate'},
    ship: {f: buildShipRequest, r: handleShipResponse, wsdl: 'ValidationAvailabilityAndCommitmentService_v2.wsdl'},
    track: {f: buildTrackingRequest, r: handleTrackingResponse, wsdl: 'TrackService_v9.wsdl'},
    freight_rates: {f: buildFreightRatesRequest, r: handleFreightRatesResponse, wsdl: 'RateService_v16.wsdl'}
  };

  function buildResourceFunction(i, resources) {
    return function(data, options, callback) {
      if(!callback) {
        callback = options;
        options = undefined;
      }

      resources[i].f(data, options, resources[i], function(err, res) {
        if(err) {
          return callback(err, null);
        }
        resources[i].r(res, callback);
      });
    }
  }

  for(var i in resources) {
    $scope[i] = buildResourceFunction(i, resources);
  }

  return $scope.config(args);
}

module.exports = FedEx;