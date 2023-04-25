const Web3 = require("web3");
var Eth = require('web3-eth');
var abiUtils = require("web3-eth-abi");

exports.handler = async function (payload) {
  const conditionRequest = payload.request.body;
  const matches = [];
  const events = conditionRequest.events;
  for (const evt of events) {
    
    const timestamp = evt.timestamp; 
    const queryId = evt.matchReasons[0].args[0];
    const queryData = evt.matchReasons[0].args[3];
    const valueHex = evt.matchReasons[0].args[1];
    let value = (Math.round((parseInt(valueHex, 16) / 1e18) * 100 ) / 100).toFixed(2);

    let type = abiUtils.decodeParameter('string', queryData);
    let makeHex = "0x";
    let isSpotPrice = queryData.includes('0953706f745072696365');

    let removePrefix = queryData.substr(2);
    let arrayBy64 = removePrefix.match(/(.{1,64})/g);   // make 64 character chunks from querydata
    arrayBy64.forEach((element, index) => {
  		arrayBy64[index] = Web3.utils.hexToAscii(makeHex.concat(element));  // convert each array entry from hex to ascii
	  });

    let asset, currency, label;
    if (isSpotPrice === true) {
      asset = arrayBy64[8];
      currency = arrayBy64[10];
      label = asset.concat(" / ", currency);
    } else {
      label = type; 
    }

    const mimMashupSandId = '0x0c70e0b36b9849038027617c0e2ef87ac8c3f0e68168faf5186e0981b6c5eb47';
    const mimMashupApeId = '0x9026839f0ed5b30c73fd0a6046e3ade4e04c94c5e8c982089205109de74b0553';
    
    if (queryId === mimMashupSandId) {
      label = 'Mimicry NFT Mashup (Sand)';
      value = (Math.round((parseInt(valueHex, 16)) * 100 ) / 100).toFixed(2);
    } else if (queryId === mimMashupApeId) {
      label = 'Mimicry NFT Mashup (Ape)';
      value = (Math.round((parseInt(valueHex, 16)) * 100 ) / 100).toFixed(2);
    } 
  
    // metadata 
    matches.push({
      hash: evt.hash, // needs to stay to link with sentinel
      metadata: {
        label: label, 
        timestamp: timestamp,
        value: value,
        queryId: queryId,
        queryData: queryData,
        asset: asset,
        currency: currency,
        array: arrayBy64,
      },
    });
  }
  return { matches };
};
