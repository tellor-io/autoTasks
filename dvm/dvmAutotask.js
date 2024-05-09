const axios = require('axios');
var abiUtils = require('web3');

exports.handler = async function (payload) {
  const conditionRequest = payload.request.body;
  const matches = [];
  const events = conditionRequest.events;
  for (const evt of events) {

    const btcUSD = '0xa6f013ee236804827b77696d350e9f0ac3e879328f2a3021d473a0b778ad78ac';
    const ethUSD = '0x83a7f3d48786ac2667503a61e8c415438ed2922eb86a2906e4ee66d9a2ce4992';
    const trbUSD = '0x5c13cd9c97dbb98f2429c101a2a8150e6c7a0ddaff6124ee176a3a411067ded0';
    const ltcUSD = '0x19585d912afb72378e3986a7a53f1eae1fbae792cd17e1d0df063681326823ae';
    const opUSD = '0xafc6a3f6c18df31f1078cf038745b48e55623330715d90efe3dc7935efd44938';
    const bchUSD = '0xefa84ae5ea9eb0545e159f78f0a44911ac5a81ecb6ff0c4e32107bcfc66c4baa';
    const maticUSD = '0x40aa71e5205fdc7bdb7d65f7ae41daca3820c5d3a8f62357a99eda3aa27244a3';
    const solUSD = '0xb211d6f1abbd5bb431618547402a92250b765151acbe749e7f9c26dc19e5dd9a';
    const dotUSD = '0x8810ffb0cfcb6131da29ed4b229f252d6bac6fc98fc4a61ffbde5b48131e0228';
    const filUSD = '0x537422e5383888586f8f9bca62c5bfd8eb0f8c1bcd335b1a691e6b550c92dcce';
    const brlUSD = '0x7f3fc5bbf0bcc372beece1d2711095b6c884c69e21dad1180f2160adfcd8b044';
    const cnyUSD = '0x2c81613b335c890096fd1c9a89766a2d71da2c9636505a9cb3b3dc7877cdad4b';
    const stethUSD = '0x907154958baee4fb0ce2bbe50728141ac76eb2dc1731b3d40f0890746dd07e62';
    const wstethUSD = '0x1962cde2f19178fe2bb2229e78a6d386e6406979edc7b9a1966d89d83b3ebf2e';
    const swethUSD = '0xfd47fa335a8c4886222ebae89a8de8d4a0187eb06c4429d3c0a7932332d2430d';
    const cbethUSD = '0xbb5e0a51ab0e06354439f377e326ca71ec8149249d163f75f543fcdc25818e76';

    const timestamp = evt.timestamp;
    const queryId = evt.matchReasons[0].args[0];
    const queryData = evt.matchReasons[0].args[3];
    const valueHex = evt.matchReasons[0].args[1];
    let value = (Math.round((parseInt(valueHex, 16) / 1e18) * 100) / 100).toFixed(2);
    let type = web3.eth.abi.decodeParameter('string', queryData);
    let isSpotPrice = queryData.includes('0953706f745072696365');
    let decodedQData, decodedParams, label;

    if (isSpotPrice === true) {
      // seperate type from encoded parameters
      decodedQData = web3.eth.abi.decodeParameters([
        { type: 'string', name: 'type', },
        { type: 'bytes', name: 'parameters', }
      ], queryData);
      // decode query parameters
      decodedParams = web3.eth.abi.decodeParameters([
        { type: 'string', name: 'asset', },
        { type: 'string', name: 'currency', }
      ], decodedQData["parameters"]);
      label = decodedParams["asset"].concat(" / ", decodedParams["currency"]);
    } else {
      label = type;
    }

    let cgPrice;

    if (queryId === btcUSD) {
      label = 'BTC / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.bitcoin.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === ethUSD) {
      label = 'ETH / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.ethereum.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === trbUSD) {
      label = 'TRB / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tellor&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.tellor.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === ltcUSD) {
      label = 'LTC / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.litecoin.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === opUSD) {
      label = 'OP / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.optimism.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === bchUSD) {
      label = 'BCH / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data["bitcoin-cash"]["usd"];
        })
        .catch(error => console.error(error));
    } else if (queryId === maticUSD) {
      label = 'MATIC / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data["matic-network"]["usd"];
        })
        .catch(error => console.error(error));
    } else if (queryId === solUSD) {
      label = 'SOL / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.solana.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === dotUSD) {
      label = 'DOT / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.polkadot.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === filUSD) {
      label = 'FIL / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=filecoin&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.filecoin.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === brlUSD) {
      label = 'BRL / USD';
      await axios.get('https://v6.exchangerate-api.com/v6/f3f113229ceb2af69fded16d/latest/BRL')
        .then(response => {
          cgPrice = response.data.conversion_rates.USD;
        })
        .catch(error => console.error(error));
    } else if (queryId === cnyUSD) {
      label = 'CNY / USD';
      await axios.get('https://v6.exchangerate-api.com/v6/f3f113229ceb2af69fded16d/latest/CNY')
        .then(response => {
          cgPrice = response.data.conversion_rates.USD;
        })
        .catch(error => console.error(error));
    } else if (queryId === stethUSD) {
      label = 'STETH / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=staked-ether&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data["staked-ether"]["usd"];
        })
        .catch(error => console.error(error));
    } else if (queryId === wstethUSD) {
      label = 'WSTETH / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=wrapped-steth&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data["wrapped-steth"]["usd"];
        })
        .catch(error => console.error(error));
    } else if (queryId === swethUSD) {
      label = 'SWETH / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=sweth&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data.sweth.usd;
        })
        .catch(error => console.error(error));
    } else if (queryId === cbethUSD) {
      label = 'CBETH / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=coinbase-wrapped-staked-eth&vs_currencies=usd')
        .then(response => {
          cgPrice = response.data["coinbase-wrapped-staked-eth"]["usd"];
        })
        .catch(error => console.error(error));
    }

    let tolerance = 0.1;
    let diff = (value - cgPrice) / cgPrice;
    let percentDiff = (diff * 100);

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
