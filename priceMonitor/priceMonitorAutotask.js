const axios = require('axios');
const Web3 = require('web3');

exports.handler = async function (payload) {
    const conditionRequest = payload.request.body;
    const matches = [];
    const events = conditionRequest.events;
    const key = '92addc40-4305-406c-8b17-86f6b455a256';

    const fetchPriceFromCoinGecko = async (id) => {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
        return response.data[id].usd;
    };

    const fetchPriceFromCoinMarketCap = async (symbol) => {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': key,
            },
            params: {
                symbol: symbol,
            }
        });
        const data = response.data.data[symbol][0].quote.USD.price;
        return data;
    };

    const fetchPriceFromCoinCap = async (id) => {
        const response = await axios.get(`https://api.coincap.io/v2/assets/${id}`);
        return parseFloat(response.data.data.priceUsd);
    };

    const assetInfo = {
        '0xa6f013ee236804827b77696d350e9f0ac3e879328f2a3021d473a0b778ad78ac': { label: 'BTC / USD', cgId: 'bitcoin', cmcSymbol: 'BTC', coinCapId: 'bitcoin' },
        '0x83a7f3d48786ac2667503a61e8c415438ed2922eb86a2906e4ee66d9a2ce4992': { label: 'ETH / USD', cgId: 'ethereum', cmcSymbol: 'ETH', coinCapId: 'ethereum' },
        '0x5c13cd9c97dbb98f2429c101a2a8150e6c7a0ddaff6124ee176a3a411067ded0': { label: 'TRB / USD', cgId: 'tellor', cmcSymbol: 'TRB', coinCapId: 'tellor' },
        '0x40aa71e5205fdc7bdb7d65f7ae41daca3820c5d3a8f62357a99eda3aa27244a3': { label: 'MATIC / USD', cgId: 'matic-network', cmcSymbol: 'MATIC' }
    };

    for (const evt of events) {
        let web3 = new Web3();

        const timestamp = evt.timestamp;
        const queryId = evt.matchReasons[0].args[0];
        const queryData = evt.matchReasons[0].args[3];
        const valueHex = evt.matchReasons[0].args[1];

        let reportedValue = (Math.round((parseInt(valueHex, 16) / 1e18) * 100) / 100);
        let type = web3.eth.abi.decodeParameter('string', queryData);
        let isSpotPrice = type.includes('SpotPrice');
        let decodedQData, decodedParams;
        let label = "unknown";

        if (isSpotPrice === true) {
            decodedQData = web3.eth.abi.decodeParameters([
                { type: 'string', name: 'type' },
                { type: 'bytes', name: 'parameters' }
            ], queryData);

            decodedParams = web3.eth.abi.decodeParameters([
                { type: 'string', name: 'asset' },
                { type: 'string', name: 'currency' }
            ], decodedQData.parameters);

            label = (decodedParams.asset.concat(" / ", decodedParams.currency)).toUpperCase();
        } else {
            label = type;
        }

        if (assetInfo[queryId]) {
            try {
                const { label, cgId, cmcSymbol, coinCapId } = assetInfo[queryId];

                const priceFetchers = [
                    fetchPriceFromCoinGecko(cgId),
                    fetchPriceFromCoinMarketCap(cmcSymbol)
                ];

                if (coinCapId) {
                    priceFetchers.push(fetchPriceFromCoinCap(coinCapId));
                }

                const [cgPrice, cmcPrice, coinCapPrice] = await Promise.all(priceFetchers);

                const prices = [cgPrice, cmcPrice];
                if (coinCapPrice !== undefined) {
                    prices.push(coinCapPrice);
                }

                const averagePrice = prices.reduce((acc, price) => acc + price, 0) / prices.length;

                matches.push({
                    hash: evt.hash,
                    metadata: {
                        label: label,
                        cgPrice: cgPrice,
                        cmcPrice: cmcPrice,
                        coinCapPrice: coinCapPrice,
                        avg: averagePrice,
                        value: reportedValue,
                        timestamp: timestamp,
                    },
                });
            } catch (error) {
                console.error(`Error fetching price for ${label}:`, error);
                continue;
            }
        }
    }
    return { matches };
};
