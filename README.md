# AutoTasks 

## Overview 
This repository uses [OpenZeppelin Defender](https://defender.openzeppelin.com) autotasks and sentinels to create a mock data feed on Discord.

## What it does

Sentinels watch for the `submitValue` function on the TellorFlex contract to be called on [supported networks](https://docs.openzeppelin.com/defender/#networks). 

The sentinels themselves can only push the encoded on-chain data. Autotasks can refine the contents of the sentinel's messages. Autotasks are JavaScript snippets that can check conditions and gather information from external APIs. Metadata can be created in an autotask and pushed into the sentinel messages.

This repo has an autotask that helps make a mock data feed in discord, an autotask that compares reported spotprices to the coingecko API, and an autotask that ensures every EVMCall value matches the expected function response.



## How to set up defenders for a personal price feed

1. Create a new sentinel from the sentinel dashboard.
2. Select "Contract Sentinel" and choose the desired network. Monitoring multiple networks can be achieved by setting up a separate sentinel for each network.
3. Paste in the TellorTlex contract address: `0xD9157453E2668B2fc45b7A803D3FEF3642430cC0`.
4. If the contract ABI doesn't automatically load, paste it in manually.
5. Continue to the next page.
6. Under contract conditions, select `submitValue`. 
7. Continue to the next page.
8. Connect the sentinel to the notification channel of your choice.
9. Create the sentinel.
10. Create a new autotask from the autotask dashboard to personalize the sentinel.
11. Set the autotask to trigger from a sentinel.
12. In the code block, add custom mathcing logic.



- Common parameters:

```javascript
const timestamp = evt.timestamp;
const queryId = evt.matchReasons[0].args[0];
const valueHex = evt.matchReasons[0].args[1];
const queryData = evt.matchReasons[0].args[3];
// parameters can be decoded using web3.eth.abi.decodeParam(s)
```


- Specific queryIDs can be filtered for:

```javascript
const btcID = '0x...';
if (queryId === btcID) {
    // do something specific for btc/usd reports
    matches.push({
        ...
    });
}
```


- Specific types of queries can be filtered for:
```javascript
let isSpotPrice = queryData.includes('0953706f745072696365');
if (isSpotPrice === true) { 
    // do something for spot price reports
    matches.push({
        ...
    });
}
```
13. Create autotask
14. To connect the sentinel and autotask, go back into the sentinel menu and select edit conditions 
15. At the bottom of the page, under custom conditions, select your autotask and save changes
16. In the sentinel settings, select edit notifications
17. Select customize notification - [limited markdown syntax](https://docs.openzeppelin.com/defender/sentinel#example) can be used for formatting 
  - Metadata from the autotask can be read in the custom notification template, e.g.
  ```javascript
  metadata: {
      timestamp: timestamp,
  },
  ```
  - the timestamp can be pushed by the sentinel with {{ metadata.timestamp }} in the custom notification template.







