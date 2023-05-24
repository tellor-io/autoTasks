# AutoTasks 

## Overview 
This repository uses OpenZeppelin autotasks and sentinels to create a mock data feed on Discord.

[OpenZeppelin Defender](https://defender.openzeppelin.com)

## Sentinels

Through [Open Zeppelin Defender](https://defender.openzeppelin.com/#/sentinel), create a sentinel that watches the ```submitValue``` function on the TellorFlex contract. Connect each sentinel to a discord server through a webhook. 

Sentinel notifications can be customized using limited markdown syntax, as shown in the [OpenZeppelin docs](https://docs.openzeppelin.com/defender/sentinel#customizing-notification-messages). The metadata used in ```decodingForSentinelTemplate.md ``` and ```dvmTemplate.md``` is defined in their respective autotasks.

## Autotasks

### Accessing function arguments

Both ```decodingForSentinel.js``` and ```dvmAutotask.js``` decode the data sent through the ```submitValue``` function, which has the following parameters:
```    
function submitValue(
        bytes32 _queryId,
        bytes calldata _value,
        uint256 _nonce,
        bytes calldata _queryData
    )
```
Since the ```_queryId``` is the function's first argument, it can be accessed using ``` evt.matchReasons[0].args[0]; ```.
Similarly, ``` _value ``` is accessed using ``` evt.matchReasons[0].args[1]; ```, and so on. These return an abiEncoded hex string.

### Decoding
The function arguments are decoded using [decodeParameter](https://docs.web3js.org/api/web3-eth-abi/function/decodeParameter) and [decodeParameters](https://docs.web3js.org/api/web3-eth-abi/function/decodeParameters) from the web3-eth-abi package. 

Store the decoded parameters in the autotask metadata, and then push it into the sentinel message using `{{ metadata.variableName }}` in the sentinel notification template.


### Customizing labels/values in autotasks
A special ```label``` or  ```value``` calculation can be hardcoded for any ```queryId```. 
  
  1. store the query ID 
  
  ```javascript 
     const newId = '0x...';
  ```
  
  2. add a new if statement to create the corresponding label or value calculation.
  
  ```javascript
     if (queryId === newId) {
     label = 'new / USD';
     value = ... ;
     }
  ```
  


