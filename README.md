# AutoTasks 

## Overview 
This repository uses OpenZeppelin autotasks and sentinels to create a data feed on Discord.

## Sentinels

Sentinels are set up per network to send a discord message everytime the ```submitValue``` function is called on the TellorFlex contract. 

The markdown template files show what the sentinel is pushing to discord. Sentinel notifications can be customized using limited markdown syntax, as shown in the [OpenZeppelin docs](https://docs.openzeppelin.com/defender/sentinel#customizing-notification-messages).

## Autotasks

Metadata for each submitValue call can be defined within an autotask and then pushed in a message by a sentinel. 

### Accessing function arguments

An autotask can be used to decode the parameters from a function that is being watched by a sentinel.
Both ```decodingForSentinel.js``` and ```dvmAutotask.js``` decode the data sent through the ```submitValue``` function. 
```    
function submitValue(
        bytes32 _queryId,
        bytes calldata _value,
        uint256 _nonce,
        bytes calldata _queryData
    )
```
Since the ```queryId``` is the function's first argument, it can be accessed using ``` evt.matchReasons[0].args[0];. ```
Similarly, ``` value ``` is accessed using ``` evt.matchReasons[0].args[1]; ```, and so on for each of the function in question's arguments.

### Decoding
The queryData and value is decoded using the decodeParameter function from the web3-eth-abi package. 


### Customizing labels/values in autotasks
All ```queryData``` will get decoded before being pushed, but a ```label``` or different ```value``` calculation can be hardcoded for any ```queryId```. 
  
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
  


