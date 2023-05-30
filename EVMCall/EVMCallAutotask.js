const Web3 = require('web3');
var abiUtils = require('web3-eth-abi');

exports.handler = async function (payload) {
    const conditionRequest = payload.request.body;
    const matches = [];
    const events = conditionRequest.events;
    for (const evt of events) {

        const timestamp = evt.timestamp;
        const queryId = evt.matchReasons[0].args[0];
        const queryData = evt.matchReasons[0].args[3];
        const valueHex = evt.matchReasons[0].args[1];

        let isEVMCall = queryData.includes('0745564d43616c6c');

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
            ], decodedQData['parameters']);

            //seperate timestamp from evmcall value 
            let evmCallValue;
            try {
                evmCallValue = abiUtils.decodeParameters([
                    {
                        type: 'bytes',
                        name: 'value',
                    },
                    {
                        type: 'uint256',
                        name: 'timestamp',
                    }
                ], valueHex);
                // handle undecodeable value 
            } catch (err) {
                evmCallValue = err.name;
            }

            let value = evmCallValue['value'];

            let chainId = decodedParams['chainId'];
            let address = decodedParams['contractAddress'];
            let callData = decodedParams['calldata'];

            let NODE_URL_SEPOLIA = 'https://sepolia.infura.io/v3/af4f379ae4684b05a666df014b950569';
            let NODE_URL_CHIADO = 'https://rpc.chiado.gnosis.gateway.fm/';
            let NODE_URL_MUMBAI = 'https://polygon-mumbai.infura.io/v3/af4f379ae4684b05a666df014b950569';
            let NODE_URL_OPTIMISM = 'https://optimism-mainnet.infura.io/v3/4524014768214144a261e033e6962012';
            let NODE_URL_GNOSIS = 'https://rpc.gnosis.gateway.fm/';
            let NODE_URL_POLYGON = 'https://polygon-mainnet.infura.io/v3/4524014768214144a261e033e6962012';

            let gnosisId = '100';
            let polygonId = '137';
            let optimismId = '10';
            let sepoliaId = '11155111';
            let mumbaiId = '80001';
            let chiadoId = '10200';
            let isSuccess = false;
            let result;

            //gnosis
            if (chainId === gnosisId) {
                var web3 = new Web3(NODE_URL_GNOSIS); //web3 object
                result = await web3.eth.call({
                    to: address, // contract address
                    data: callData
                })
                if (result === value) {
                    isSuccess = true;
                }
            }
            // polygon
            else if (chainId === polygonId) {
                var web3 = new Web3(NODE_URL_POLYGON);
                result = await web3.eth.call({
                    to: address,
                    data: callData
                })
                if (result === value) {
                    isSuccess = true;
                }
            }
            //optimism
            else if (chainId === optimismId) {
                var web3 = new Web3(NODE_URL_OPTIMISM);
                result = await web3.eth.call({
                    to: address,
                    data: callData
                })
                if (result === value) {
                    isSuccess = true;
                }
            }
            // sepolia
            else if (chainId === sepoliaId) {
                var web3 = new Web3(NODE_URL_SEPOLIA);
                result = await web3.eth.call({
                    to: address,
                    data: callData
                })
                if (result === value) {
                    isSuccess = true;
                }
            }
            // mumbai
            else if (chainId === mumbaiId) {
                var web3 = new Web3(NODE_URL_MUMBAI);
                result = await web3.eth.call({
                    to: address,
                    data: callData
                })
                if (result === value) {
                    isSuccess = true;
                }
            }
            //chiado
            else if (chainId === chiadoId) {
                var web3 = new Web3(NODE_URL_CHIADO);
                result = await web3.eth.call({
                    to: address,
                    data: callData
                })
                if (result === value) {
                    isSuccess = true;
                }
            }

            // push notification if evmcall value doesnt match return
            if (isSuccess === false) {
                // metadata 
                matches.push({
                    hash: evt.hash,
                    metadata: {
                        timestamp: timestamp,
                        isSuccess: isSuccess,
                        result: result,
                        value: value,
                    },
                });
            }
        }
    }
    return { matches };
};
