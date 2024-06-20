const axios = require('axios');
const Web3 = require('web3');

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

    let web3 = new Web3();

    const timestamp = evt.timestamp;
    const queryId = evt.matchReasons[0].args[0];
    const queryData = evt.matchReasons[0].args[3];
    const valueHex = evt.matchReasons[0].args[1];
    let value = (Math.round((parseInt(valueHex, 16) / 1e18) * 100) / 100);
    let type = web3.eth.abi.decodeParameter('string', queryData);
    let isSpotPrice = type.includes('SpotPrice');
    let decodedQData, decodedParams;
    let label = "unknown";

    let cgPrice;

    try {
      if (queryId === btcUSD) {
        label = 'BTC / USD';
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        cgPrice = response.data.bitcoin.usd;
      } else if (queryId === ethUSD) {
        label = 'ETH / USD';
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        cgPrice = response.data.ethereum.usd;
      } else if (queryId === trbUSD) {
        label = 'TRB / USD';
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tellor&vs_currencies=usd');
        cgPrice = response.data.tellor.usd;
      } else if (queryId === ltcUSD) {
        label = 'LTC / USD';
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd');
        cgPrice = response.data.litecoin.usd;
      } else if (queryId === opUSD) {
        label = 'OP / USD';
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=usd');
        cgPrice = response.data.optimism.usd;
      } else if (queryId === bchUSD) {
        label = 'BCH / USD';
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
        cgPrice = response.data["bitcoin-cash"]["usd"];
      } else if (queryId === maticUSD) {
        label = 'MATIC / USD';
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
        cgPrice = response.data["matic-network"]["usd"];
      } else if (queryId === solUSD) {
        label = 'SOL / USD';
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        cgPrice = response.data.solana.usd;
      } else if (queryId === dotUSD) {
        label = 'DOT / USD';
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd');
        cgPrice = response.data.polkadot.usd;
      } else if (queryId === filUSD) {
        label = 'FIL / USD';
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=filecoin&vs_currencies=usd');
        cgPrice = response.data.filecoin.usd;
      } else if (queryId === brlUSD) {
        label = 'BRL / USD';
        const response = await axios.get('https://v6.exchangerate-api.com/v6/f3f113229ceb2af69fded16d/latest/BRL');
        cgPrice = response.data.conversion_rates.USD;
      } else if (queryId === cnyUSD) {
        label = 'CNY / USD';
        const response = await axios.get('https://v6.exchangerate-api.com/v6/f3f113229ceb2af69fded16d/latest/CNY');
        cgPrice = response.data.conversion_rates.USD;
      } else if (queryId === stethUSD) {
        label = 'STETH / USD';
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=staked-ether&vs_currencies=usd');
        cgPrice = response.data["staked-ether"]["usd"];
      } else if (queryId === wstethUSD) {
        label = 'WSTETH / USD';
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=wrapped-steth&vs_currencies=usd');
        cgPrice = response.data["wrapped-steth"]["usd"];
      } else if (queryId === swethUSD) {
        label = 'SWETH / USD';
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=sweth&vs_currencies=usd');
        cgPrice = response.data.sweth.usd;
      } else if (queryId === cbethUSD) {
        label = 'CBETH / USD';
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=coinbase-wrapped-staked-eth&vs_currencies=usd');
        cgPrice = response.data["coinbase-wrapped-staked-eth"]["usd"];
      }
    } catch (error) {
      console.error(`Error fetching price for ${label}:`, error);
      continue; // Skip to the next event if an error occurs
    }

    let tolerance = 0.1;
    let diff = Math.abs((value - cgPrice) / cgPrice);
    let percentDiff = (diff * 100).toFixed(2);

    if (cgPrice > 0 && diff >= tolerance) {
      matches.push({
        hash: evt.hash, // needs to be here to connect with sentinel
        metadata: {
          label: label,
          cgPrice: cgPrice,
          value: value,
          percentDiff: percentDiff,
          timestamp: timestamp,
        },
      });
    }
  }
  return { matches };
};
