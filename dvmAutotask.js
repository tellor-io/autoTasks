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
    //const mimIndexId = '0x486e2149f25d46bb39a27f5e0c81be9b6f193abf46c0d49314b8d1dd104cd53b';
    //const mimMashupSandId = '0x0c70e0b36b9849038027617c0e2ef87ac8c3f0e68168faf5186e0981b6c5eb47';
    //const mimMashupApeId = '0x9026839f0ed5b30c73fd0a6046e3ade4e04c94c5e8c982089205109de74b0553';
    
    const timestamp = evt.timestamp;
    const queryId = evt.matchReasons[0].args[0];
    const queryData = evt.matchReasons[0].args[3];
    const value = (Math.round((parseInt(evt.matchReasons[0].args[1], 16) / 1e18) * 100 ) / 100).toFixed(2);
    
    let hexString = queryData; 
    hexString = hexString.replace(/04/g, ''); // remove special characters
    hexString = hexString.replace(/08/g, '');
    hexString = hexString.replace(/0c/g, '');                                     
    const uint8Array = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16))); // convert hex string to a Uint8Array of bytes
    const asciiString = new TextDecoder().decode(uint8Array); // convert bytes to an ASCII string

    let label = asciiString;
    let isRNG = label.includes('RNG');
    let isEvmCall = label.includes('EVM');
    let price;
    
    if (queryId === btcId) {
    	label = 'BTC / USD';
    	await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    	.then(response => {
    	  price = response.data.bitcoin.usd;
  		})
  		.catch(error => console.error(error));
    } else if (queryId === ethId) {
      label = 'ETH / USD';
     	await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    	.then(response => {
    	  price = response.data.ethereum.usd;
  		})
  		.catch(error => console.error(error));
    } else if (queryId === trbId) {
      label = 'TRB / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tellor&vs_currencies=usd')
    	.then(response => {
    	  price = response.data.tellor.usd;
  		})
  		.catch(error => console.error(error));
    } else if (queryId === ltcId) {
    	label = 'LTC / USD';
     	await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd')
    	.then(response => {
    	  price = response.data.litecoin.usd;
  		})
  		.catch(error => console.error(error));
    } else if (queryId === opId) {
      label = 'OP / USD';
    	await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=usd')
    	.then(response => {
    	  price = response.data.optimism.usd;
  		})
  		.catch(error => console.error(error));
    } else if (queryId === bchId) {
     	label = 'BCH / USD';
     	await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd')
    	.then(response => {
    	  price = response.data["bitcoin-cash"]["usd"];
  		})
  		.catch(error => console.error(error));
    } else if (queryId === maticId) {
      label = 'MATIC / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd')
    	.then(response => {
        price = response.data["matic-network"]["usd"];
  		})
  		.catch(error => console.error(error));
    } else if (queryId === solId) {
      label = 'SOL / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
    	.then(response => {
    	  price = response.data.solana.usd;
  		})
  		.catch(error => console.error(error));
    } else if (queryId === dotId) {
      label = 'DOT / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd')
    	.then(response => {
    	  price = response.data.polkadot.usd;
  		})
  		.catch(error => console.error(error));
    } else if (queryId === filId) {
      label = 'FIL / USD';
      await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=filecoin&vs_currencies=usd')
    	.then(response => {
    	  price = response.data.filecoin.usd;
  		})
  		.catch(error => console.error(error)); 
    } /* else if (queryId === mimIndexId) {
      label = 'Mimicry NFT Index';
    } else if (queryId === mimMashupSandId) {
      label = 'Mimicry NFT Mashup (Sand)';
    } else if (queryId === mimMashupSandId) {
      label = 'Mimicry NFT Mashup (Ape)';
    } else if (isRNG === true) {
      label = 'Tellor RNG';
    } else if (isEvmCall === true) {
      label = 'EVM Call'; 
    } */
    
    let tolerance = 0.2;
    let diff = Math.abs((value - price)/price);
    let percentDiff = Math.round(diff*100);
    
    if (price > 0 && diff >= tolerance) {
    	matches.push({
          hash: evt.hash, // needs to be here to connect with sentinel
      		metadata: {
            label: label,
            price: price,
            value: value,
            percentDiff: percentDiff,
            timestamp: timestamp,
      		},
    	});
    }
  }
  return { matches };
};
 
