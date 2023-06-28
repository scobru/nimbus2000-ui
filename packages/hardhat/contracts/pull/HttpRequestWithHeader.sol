// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "./HttpRequestOracle.sol";
import "./RequestConsumer.sol";

contract HttpRequestConsumerWithHeader is RequestConsumer {
  using RequestLib for RequestLib.Request;

  HttpRequestOracle httpOracle;
  string prediction_signal;

  event RequestExchangeRate(bytes32 indexed requestId, string prediction_signal);

  constructor(address _oracle) {
    httpOracle = HttpRequestOracle(_oracle);
  }

  function requestPredictionSignal() private returns (bytes32) {
    RequestLib.Request memory req = buildRequest(this._requestedDataCompleted.selector);
    req.setId(keccak256(abi.encodePacked(block.timestamp, msg.sender)));

    // The code above is the same as
    // const request = require('request');

    // request.get({
    //   url: 'https://api.api-ninjas.com/v1/exchangerate?pair=USD_EUR',
    //   headers: {
    //     'X-Api-Key': 'YOUR_API_KEY'
    //   },
    // }, function(error, response, body) {
    //   if(error) return console.error('Request failed:', error);
    //   else if(response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
    //   else console.log(body)
    // });

    req.add("get", "https://api.scobrudot.dev/data/");
    req.addHeader("Authorization", "");

    // Set the path to find the desired data in the API response, where the response format is:
    //  {
    //   "currency_pair": "USD_EUR",
    //   "exchange_rate": 0.826641
    // }
    req.add("path", "prediction_signal");
    httpOracle.sendRequest(req);
    return req.id;
  }

  function _requestedDataCompleted(bytes32 _requestId, string memory _prediction_signal) public {
    emit RequestExchangeRate(_requestId, _prediction_signal);
    prediction_signal = _prediction_signal;
  }
}