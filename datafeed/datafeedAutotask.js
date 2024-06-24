const Web3 = require('web3');

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

        let web3 = new Web3();

        // turn value from hex to number, adjust value decimal place  
        let value = (Math.round((parseInt(valueHex, 16) / 1e18) * 100) / 100);
        // get querydata type
        let type = web3.eth.abi.decodeParameter('string', queryData);

        let isSpotPrice = type.includes('SpotPrice');
        let isEVMCall = type.includes('EVMCall');
        let isRNG = type.includes('RNG');
        let decodedQData, decodedParams, label, padded;

        const nf = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
        });

        if (isSpotPrice === true) {
            if (valueHex.length === 66) {
                padded = true;
            }
            value = nf.format(value);

            // separate type from encoded parameters
            decodedQData = web3.eth.abi.decodeParameters([
                {type: 'string', name: 'type'},
                {type: 'bytes', name: 'parameters'}
            ], queryData);

            // decode query parameters
            decodedParams = web3.eth.abi.decodeParameters([
                {type: 'string', name: 'asset'},
                {type: 'string', name: 'currency'}
            ], decodedQData.parameters);

            label = (decodedParams.asset.concat(" / ", decodedParams.currency)).toUpperCase();

        } else {
            label = type;
        }

        if (isEVMCall === true) {
            // separate type from params
            decodedQData = web3.eth.abi.decodeParameters([
                {type: 'string', name: 'type'},
                {type: 'bytes', name: 'parameters'}
            ], queryData);

            // decode params
            decodedParams = web3.eth.abi.decodeParameters([
                {type: 'uint256', name: 'chainId'},
                {type: 'address', name: 'contractAddress'},
                {type: 'bytes', name: 'calldata'}
            ], decodedQData.parameters);

            value = decodedParams.chainId;
        }

        if (isRNG === true) {
            // Additional logic for RNG can be added here
        }

        // metadata 
        matches.push({
            hash: evt.hash, // needs to stay to link with sentinel
            metadata: {
                label: label,
                timestamp: timestamp,
                value: value,
                padded: padded,
            },
        });
    }
    return { matches };
};
