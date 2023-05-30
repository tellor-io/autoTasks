var abiUtils = require("web3-eth-abi");

exports.handler = async function (payload) {
    const conditionRequest = payload.request.body;
    const matches = [];
    const events = conditionRequest.events;
    for (const evt of events) {

        // submitValue arguments and transaction timestamp
        const timestamp = evt.timestamp;
        const queryId = evt.matchReasons[0].args[0];
        const queryData = evt.matchReasons[0].args[3];
        const valueHex = evt.matchReasons[0].args[1];

        // adjust value decimal place  
        let value = (Math.round((parseInt(valueHex, 16) / 1e18) * 100) / 100).toFixed(2);
        // get querydata type
        let type = abiUtils.decodeParameter('string', queryData);

        let isSpotPrice = queryData.includes('0953706f745072696365');
        let isEVMCall = queryData.includes('0745564d43616c6c');
        let isRNG = queryData.includes('0954656c6c6f72524e47');
        let decodedQData, decodedParams, label;

        if (isSpotPrice === true) {
            // seperate type from encoded parameters
            decodedQData = abiUtils.decodeParameters([
                {
                    type: 'string',
                    name: 'type',
                },
                {
                    type: 'bytes',
                    name: 'parameters',
                }
            ], queryData);

            // decode query parameters
            decodedParams = abiUtils.decodeParameters([
                {
                    type: 'string',
                    name: 'asset',
                },
                {
                    type: 'string',
                    name: 'currency',
                }
            ], decodedQData["parameters"]);

            label = decodedParams["asset"].concat(" / ", decodedParams["currency"]);
        } else {
            label = type;
        }

        if (isEVMCall === true) {
            // seperate type from params
            let decodedQData = abiUtils.decodeParameters([
                {
                    type: 'string',
                    name: 'type',
                },
                {
                    type: 'bytes',
                    name: 'parameters',
                }
            ], queryData);

            // decode params
            let decodedParams = abiUtils.decodeParameters([
                {
                    type: 'uint256',
                    name: 'chainId'
                },
                {
                    type: 'address',
                    name: 'contractAddress',
                },
                {
                    type: 'bytes',
                    name: 'calldata',
                }
            ], decodedQData["parameters"]);

            value = decodedParams['chainId'];
        }

        if (isRNG === true) {
            value = (value.slice(0, 6)).concat('...');
        }

        // hardcoded label and value calculation for mimicry
        const mimMashupSandId = '0x0c70e0b36b9849038027617c0e2ef87ac8c3f0e68168faf5186e0981b6c5eb47';
        const mimMashupApeId = '0x9026839f0ed5b30c73fd0a6046e3ade4e04c94c5e8c982089205109de74b0553';

        if (queryId === mimMashupSandId) {
            label = 'Mimicry NFT Mashup (Sand)';
            value = (Math.round((parseInt(valueHex, 16)) * 100) / 100).toFixed(2);
        } else if (queryId === mimMashupApeId) {
            label = 'Mimicry NFT Mashup (Ape)';
            value = (Math.round((parseInt(valueHex, 16)) * 100) / 100).toFixed(2);
        }

        // metadata 
        matches.push({
            hash: evt.hash, // needs to stay to link with sentinel
            metadata: {
                label: label,
                timestamp: timestamp,
                value: value,
            },
        });
    }
    return { matches };
};
