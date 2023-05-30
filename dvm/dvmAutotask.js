const axios = require('axios');

exports.handler = async function (payload) {
  const conditionRequest = payload.request.body;
  const matches = [];
  const events = conditionRequest.events;
  for (const evt of events) {

    const btcId = '0xa6f013ee236804827b77696d350e9f0ac3e879328f2a3021d473a0b778ad78ac';
    const ethId = '0x83a7f3d48786ac2667503a61e8c415438ed2922eb86a2906e4ee66d9a2ce4992';
    const trbId = '0x5c13cd9c97dbb98f2429c101a2a8150e6c7a0ddaff6124ee176a3a411067ded0';
    const ltcId = '0x19585d912afb72378e3986a7a53f1eae1fbae792cd17e1d0df063681326823ae';
    const opId = '0xafc6a3f6c18df31f1078cf038745b48e55623330715d90efe3dc7935efd44938';
    const bchId = '0xefa84ae5ea9eb0545e159f78f0a44911ac5a81ecb6ff0c4e32107bcfc66c4baa';
    const maticId = '0x40aa71e5205fdc7bdb7d65f7ae41daca3820c5d3a8f62357a99eda3aa27244a3';
    const solId = '0xb211d6f1abbd5bb431618547402a92250b765151acbe749e7f9c26dc19e5dd9a';
    const dotId = '0x8810ffb0cfcb6131da29ed4b229f252d6bac6fc98fc4a61ffbde5b48131e0228';
    const filId = '0x537422e5383888586f8f9bca62c5bfd8eb0f8c1bcd335b1a691e6b550c92dcce';

    const timestamp = evt.timestamp;
    const queryId = evt.matchReasons[0].args[0];
    const queryData = evt.matchReasons[0].args[3];
    const valueHex = evt.matchReasons[0].args[1];

    let value = (Math.round((parseInt(valueHex, 16) / 1e18) * 100) / 100).toFixed(2);
    let type = abiUtils.decodeParameter('string', queryData);
    let isSpotPrice = queryData.includes('0953706f745072696365');
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

    let cgPrice;

    if (queryId === btcId) {
      label = 'BTC / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.bitcoin.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === ethId) {
      label = 'ETH / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.ethereum.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === trbId) {
      label = 'TRB / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tellor&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.tellor.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === ltcId) {
      label = 'LTC / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.litecoin.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === opId) {
      label = 'OP / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.optimism.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === bchId) {
      label = 'BCH / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data["bitcoin-cash"]["usd"];
        })
        .catch(error => console.error(error));
    } else if (queryId === maticId) {
      label = 'MATIC / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data["matic-network"]["usd"];
        })
        .catch(error => console.error(error));
    } else if (queryId === solId) {
      label = 'SOL / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.solana.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === dotId) {
      label = 'DOT / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.polkadot.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === filId) {
      label = 'FIL / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=filecoin&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.filecoin.usd;
        })
        .catch(error => console.error(error));
    }

    let tolerance = 0.2;
    let diff = Math.abs((value - cgPrice) / cgPrice);
    let percentDiff = Math.round(diff * 100);

    if (cgPrice > 0 && diff >= tolerance) {
      matches.push({
        hash: evt.hash, // needs to be here to connect with sentinel
        metadata: {
          label: label,
          price: cgPrice,
          value: value,
          percentDiff: percentDiff,
          timestamp: timestamp,
        },
      });
    }
  }
  return { matches };
};
