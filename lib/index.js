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
var builder = require('xmlbuilder');
var parser = require('xml2json');

function FedEX(args) {
  var hosts = {
      sandbox: 'wwwcie.ups.com',
      live: 'onlinetools.ups.com'
    },
    defaults = {
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

  function buildRatesRequest(data, options, resource, callback) {

  }

  function handleRatesResponse(res, callback) {

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
    rates: {f: buildRatesRequest, r: handleRatesResponse, wsdl: 'RateService_v16.wsdl'},
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